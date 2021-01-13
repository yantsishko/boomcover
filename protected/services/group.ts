'use strict';
import log from '@component/logger';
import Queue from '@component/queue';
import config from '@config';
import { Cover } from '@entity/Cover';
import { SocialGroup } from '@entity/SocialGroup';
import { SocialGroupCache } from '@entity/SocialGroupCache';
import { User } from '@entity/User';
import { CommentService } from '@service/comment';
import { LikeService } from '@service/like';
import { RepostService } from '@service/reposts';
import { VK } from '@service/vk';
import * as moment from 'moment';
import { getRepository } from 'typeorm';

export class GroupService {

    static async createCover(group: SocialGroup, need_save: boolean = true): Promise<SocialGroup> {
        const groupRepository = getRepository(SocialGroup);
        const cover = new Cover();
        cover.group = Promise.resolve(group);
        cover.cached_data = {};
        cover.settings = [];
        group.cover = Promise.resolve(cover);

        const cache = new SocialGroupCache();
        cache.data = {};
        cache.group = Promise.resolve(group);
        group.cache = Promise.resolve(cache);

        if (need_save) {
            group = await groupRepository.save(group);
        }
        return group;
    }

    static async getGroupBySocialID(social_id: string) {
        const groupRepository = getRepository(SocialGroup);
        return await groupRepository.findOne({
            social_id
        });
    }

    static async generateAllCovers(include_widgets: string[] = []) {
        const groupRepository = getRepository(SocialGroup);

        const groups = await groupRepository.find({
            where: {
                connected: true
            }
        });
        for (const group of groups) {
            const cover = await group.cover;
            if (include_widgets.length && cover) {
                let include = false;
                for (const widget of cover.settings) {
                    if (include_widgets.includes(widget.name)) {
                        include = true;
                        break;
                    }
                }
                if (!include) {
                    continue;
                }
            }
            await Queue.sendMessage({
                group_id: group.id
            }, Queue.QUEUE_COVER_GENERATION);
        }
        return true;
    }

    static async generateAllCoversWithoutUpload() {
        const groupRepository = getRepository(SocialGroup);

        const groups = await groupRepository.find({
            connected: true
        });
        for (const group of groups) {
            await Queue.sendMessage({
                group_id: group.id,
                upload: false
            }, Queue.QUEUE_COVER_GENERATION);
        }
        return true;
    }

    static async updateCacheInAllGroups() {
        const groupRepository = getRepository(SocialGroup);

        const groups = await groupRepository.find({
            connected: true
        });
        log.debug(`Senging ${groups.length} to ${Queue.QUEUE_COMMENTS_UPDATE}`);
        for (const group of groups) {
            await Queue.sendMessage({
                group_id: group.id,
                update_cache: true,
                update_likes: true
            }, Queue.QUEUE_COMMENTS_UPDATE);
        }
        return true;
    }

    static async updateCommentsInAllGroups() {
        const groupRepository = getRepository(SocialGroup);

        const groups = await groupRepository.find({
            connected: true
        });
        for (const group of groups) {
            await Queue.sendMessage({
                group_id: group.id
            }, Queue.QUEUE_COMMENTS_UPDATE);
        }
        return true;
    }

    static async connectGroup(vk_access_token: string, group_id: string, expires_in?: number): Promise<SocialGroup> {
        const groupRepository = getRepository(SocialGroup);
        let group = await groupRepository.findOneById(group_id);
        if (!group) {
            throw new Error('Not found group.');
        }

        group.access_token = vk_access_token;
        group.connected = true;
        if (expires_in) {
            group.expires_in = new Date(expires_in * 1000);
        }
        group = await groupRepository.save(group);

        await VK.setGroupCallback(group);
        group = await groupRepository.save(group);
        return group;
    }

    static async checkSameGroup(group: SocialGroup): Promise<SocialGroup> {
        const groupRepository = getRepository(SocialGroup);
        const same_group = await groupRepository.findOne({
            where: {
                social_id: group.social_id,
                connected: true
            }
        });
        if (same_group) {
            const cover = await same_group.cover;
            cover.group = Promise.resolve(group);

            group.cover = Promise.resolve(cover);
            group.comments = same_group.comments;
            group.reposts = same_group.reposts;
            group.likes = same_group.likes;

            let group_cache = await group.cache;
            if (!group_cache) {
                group_cache = new SocialGroupCache();
                group_cache.group = Promise.resolve(group);
            }
            const same_group_cache = await same_group.cache;
            group_cache.data = same_group_cache.data || {};
            group_cache.last_cache_update = same_group_cache.last_cache_update;
            group.cache = Promise.resolve(group_cache);

            await groupRepository.save(group);

            same_group.connected = false;
            same_group.cover = null;
            same_group.comments = Promise.resolve([]);
            same_group.reposts = Promise.resolve([]);
            same_group.likes = Promise.resolve([]);
            await groupRepository.save(same_group);
        }
        return group;
    }

    static async setGroupConnected(group: SocialGroup) {
        const groupRepository = getRepository(SocialGroup);

        group.connected = true;
        group = await groupRepository.save(group);

        await VK.setGroupCallback(group);
        group = await groupRepository.save(group);
        return group;
    }

    static async unconnectGroup(group: SocialGroup, clear_token: boolean = false) {
        const groupRepository = getRepository(SocialGroup);

        if (clear_token) {
            group.access_token = null;
        } else if (!config.isTest) {
            try {
                await VK.deleteGroupCallback(group);
            } catch (e) {
                log.warn(`Error on deleting callback server in group ${group.id}`);
            }
            group.social_server_id = null;
        }
        group.connected = false;

        group = await groupRepository.save(group);

        if (clear_token && !config.isTest) {
            await VK.sendMessage(group.user.vk_id, `Проблема с токеном. Ваша группа "${group.title}" была отсоединена. Пожалуйста, подключите заново на ${config.site_url}`);
        }

        return group;
    }

    static async updateCachedData(group: SocialGroup, save: boolean = false) {
        const cover = await group.cover;
        if (!cover) {
            return group;
        }
        let cache = await group.cache;
        if (!cache) {
            cache = new SocialGroupCache();
        }

        cache.group = Promise.resolve(group);
        group.cache = Promise.resolve(cache);
        cache.data = await CommentService.getWidgetsCachedData(cover.settings, group);
        cache.data = Object.assign(cache.data, await RepostService.getWidgetsCachedData(cover.settings, group));
        cache.data = Object.assign(cache.data, await LikeService.getWidgetsCachedData(cover.settings, group));
        cache.last_cache_update = new Date();
        log.debug(`Cache data for group ${group.id}`, JSON.stringify(cache.data));

        if (save) {
            const cacheRepository = getRepository(SocialGroupCache);
            await cacheRepository.save(cache);
            log.info(`Cache for group ${group.id} was saved`);
        }

        return group;
    }

    static async setNeedCaptcha(group: SocialGroup, need_captcha: boolean) {
        const groupRepository = getRepository(SocialGroup);

        group.need_captcha = need_captcha;
        group.set_captcha = need_captcha ? moment().unix() : null;

        group = await groupRepository.save(group);
        return group;
    }

    static async removeNeedCaptcha() {
        const groupRepository = getRepository(SocialGroup);
        const groups: SocialGroup[] = await groupRepository
            .createQueryBuilder('group')
            .where('group.set_captcha < :date', {
                date: moment().subtract(10, 'minutes').unix()
            })
            .getMany();

        for (const group of groups) {
            await this.setNeedCaptcha(group, false);
        }
    }
}
