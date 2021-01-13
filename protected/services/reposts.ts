'use strict';

import log from '@component/logger';
import Queue from '@component/queue';
import config from '@config';
import { SocialGroup } from '@entity/SocialGroup';
import { SocialGroupRepost } from '@entity/SocialGroupRepost';
import { IVKRepost, VK } from '@service/vk';
import { IWidgetReposterLast } from '@widget/ReposterLast';
import * as moment from 'moment';
import { getRepository } from 'typeorm';

export class RepostService {

    static async createOrUpdateRepost(vk_repost: IVKRepost, group: SocialGroup) {
        const repostRepository = getRepository(SocialGroupRepost);

        let repost = await this.getRepostByPostIDAndUserID(vk_repost.post_id, vk_repost.user_social_id, group.id);
        if (!repost) {
            repost = new SocialGroupRepost();
            repost.post_id = vk_repost.post_id;
            repost.user_social_id = vk_repost.user_social_id;
        }
        repost.group = group;
        repost.user_first_name = vk_repost.user_first_name;
        repost.user_last_name = vk_repost.user_last_name;
        repost.user_photo = vk_repost.user_photo;
        repost.date = vk_repost.date;
        try {
            await repostRepository.save(repost);
        } catch (error) {
            if (error.code !== 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
                log.error(error);
            }
        }
    }

    static async getRepostByPostIDAndUserID(post_id: string, user_social_id: string, group_id: number) {
        const repostRepository = getRepository(SocialGroupRepost);
        return await repostRepository.findOne({
            where: {
                post_id,
                user_social_id,
                group: group_id
            }
        });
    }

    static async getLastRepostData(group: SocialGroup, widget) {
        const repostRepository = getRepository(SocialGroupRepost);
        const repost_data = await repostRepository.createQueryBuilder('repost')
            .where('repost.groupId = :groupId', {
                groupId: group.id
            })
            .orderBy('repost.date', 'DESC')
            .getOne();
        if (repost_data) {
            return {
                first_name: repost_data.user_first_name,
                last_name: repost_data.user_last_name,
                photo_max: repost_data.user_photo
            };
        }
        return null;
    }

    static async getWidgetsCachedData(widgets: any[], group: SocialGroup): Promise<any[]> {
        const data: any = {};
        for (const widget of widgets) {
            if (widget.isShown) {
                switch (widget.name) {
                    case 'reposterDay':
                        data.reposterDay = await this.getDayRepostData(group, widget);
                        break;
                }
            }
        }
        return data;
    }

    static async getDayRepostData(group: SocialGroup, widget) {
        const repostRepository = getRepository(SocialGroupRepost);
        const repost_data_query = repostRepository.createQueryBuilder('repost')
            .select([
                'repost.user_social_id AS user_social_id',
                'COUNT(repost.user_social_id) AS reposts_count'
            ])
            .where('repost.groupId = :groupId', {
                groupId: group.id
            })
            .andWhere('repost.date >= :date', {
                date: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')
            })
            .groupBy('repost.user_social_id')
            .orderBy('reposts_count', 'DESC')
            .having('reposts_count >= :reposts_count', {
                reposts_count: widget.minReposts
            });

        const repost_data = await repost_data_query.getRawOne();

        if (repost_data) {
            const user_id = repost_data.user_social_id;

            const repost_query = repostRepository.createQueryBuilder('repost')
                .where('repost.user_social_id = :user_social_id', {
                    user_social_id: user_id
                });

            const repost: SocialGroupRepost = await repost_query.getOne();

            if (repost) {
                return {
                    first_name: repost.user_first_name,
                    last_name: repost.user_last_name,
                    photo_max: repost.user_photo,
                    reposts_count: repost_data.reposts_count
                };
            }
        }

        return null;
    }

    static async clearOld() {
        const repostRepository = getRepository(SocialGroupRepost);
        await repostRepository.createQueryBuilder('social_group_repost')
            .where('social_group_repost.date <= :date', {
                date: moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')
            })
            .delete()
            .execute();
        return true;
    }
}
