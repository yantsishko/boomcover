'use strict';

import cache from '@component/cache';
import { Files } from '@component/files';
import { Log } from '@component/logger';
import log from '@component/logger';
import config from '@config';
import { Cover } from '@entity/Cover';
import { SocialGroup } from '@entity/SocialGroup';
import { SocialGroupComment } from '@entity/SocialGroupComment';
import { SocialGroupLike } from '@entity/SocialGroupLike';
import { SocialGroupRepost } from '@entity/SocialGroupRepost';
import { User } from '@entity/User';
import AbstractService from '@service/abstract';
import { CommentService } from '@service/comment';
import { GroupService } from '@service/group';
import { LikeService } from '@service/like';
import { RepostService } from '@service/reposts';
import { RuCaptcha } from '@service/rucaptcha';
import sha256 = require('crypto-js/sha256');
import * as fs from 'graceful-fs';
import * as moment from 'moment';
import { Moment } from 'moment';
import * as path from 'path';
import * as querystring from 'querystring';
import * as rp from 'request-promise';
import * as sleep from 'system-sleep';
import { getRepository } from 'typeorm';

export interface IVkGroup {
    id: string;
    name: string;
    screen_name: string;
    is_closed: boolean;
    type: string;
    is_admin: boolean;
    is_member: boolean;
    members_count: number;
    photo_50: string;
    photo_100: string;
    photo_200: string;
}

export interface IVkUser {
    id: number;
    first_name: string;
    last_name: string;
    photo_200: string;
    photo_max?: string;
}

interface IVKQuery {
    [key: string]: string | number;
    access_token: string;
    v: string;
}

export interface IVKComment {
    id: number;
    from_id: number;
    date: number;
    text: string;
    reply_to_user: number;
    reply_to_comment: number;
    likes: {
        count: number,
        user_likes: boolean,
        can_like: boolean
    };
    attachments: any[];
}

export interface IVKProfile {
    id: number;
    first_name: string;
    last_name: string;
    photo_max: string;
}

export interface IVKCommentFromCallback {
    id: number;
    from_id: number;
    date: number;
    text: string;
    post_owner_id: number;
    post_id: number;
}

export interface IVKRepost {
    post_id: string;
    user_social_id: string;
    user_photo: string;
    user_first_name: string;
    user_last_name: string;
    date: Date;
}

export interface IVKRepostFromCallback {
    id: number;
    owner_id: number;
    from_id: number;
    date: number;
    text: string;
    comments: {
        count: number
    };
    copy_history: Array<{
        id: number,
        owner_id: number,
        from_id: number,
        date: number,
        post_type: 'post' | 'copy' | 'reply' | 'postpone' | 'suggest',
        text: string
    }>;
    post_type: 'post' | 'copy' | 'reply' | 'postpone' | 'suggest';

}

export interface VKStats {
    members: number;
    subscribed: number;
    visitors: number;
    views: number;
}

export interface VKPermissions {
    has_stats: boolean;
}

export interface VKAccessTokenResponse {
    access_token?: string;
    expires_in?: number;
    user_id?: string;
    email?: string;
    state?: VKState;
    error?: string;
    error_description?: string;
}

export type VKState = VKStatePartner | VKStateReferal;

export interface VKStateReferal {
    type: 'referral';
    promocode: string;
}

export interface VKStatePartner {
    type: 'partner';
    code: string;
}

export class VK extends AbstractService {

    static readonly V = '5.68';

    static getLoginUri(state?: VKState): string {
        return 'https://oauth.vk.com/authorize?' + querystring.stringify({
            client_id: config.vk.client_id,
            redirect_uri: config.vk.redirect_url,
            dislay: 'page',
            scope: 'offline,groups,email,stats',
            response_type: 'code',
            state: JSON.stringify(state || {}),
            v: this.V
        });
    }

    static async getAccessToken(code: string): Promise<VKAccessTokenResponse> {
        const URI = 'https://oauth.vk.com/access_token?' + querystring.stringify({
            client_id: config.vk.client_id,
            redirect_uri: config.vk.redirect_url,
            client_secret: config.vk.secret_key,
            code,
            v: this.V
        });
        let result;
        try {
            result = await rp.get(URI);
        } catch (error) {
            if (error.name === 'StatusCodeError') {
                log.error('VK get access token error: ', JSON.stringify(error));
                result = error.error;
            } else {
                throw error;
            }
        }
        return JSON.parse(result);
    }

    static async getUserInfoById(user_id: string | number, token: string): Promise<IVkUser> {
        const URI = 'https://api.vk.com/method/users.get?' + querystring.stringify({
            user_ids: user_id,
            fields: 'photo_max',
            access_token: token,
            lang: 'ru',
            v: this.V
        });
        const vk_user_response = JSON.parse(await rp.get(URI));
        return vk_user_response.response && vk_user_response.response.length ? vk_user_response.response[0] : null;
    }

    static async getUserInfo(user: User): Promise<IVkUser> {
        const URI = 'https://api.vk.com/method/users.get?' + querystring.stringify({
            user_ids: user.vk_id,
            fields: 'photo_200',
            access_token: user.vk_token,
            lang: 'ru',
            v: this.V
        });
        const vk_user_response = JSON.parse(await rp.get(URI));
        return vk_user_response.response && vk_user_response.response.length ? vk_user_response.response[0] : null;
    }

    static getGroupLoginUrl(group: SocialGroup): string {
        return 'https://oauth.vk.com/authorize?' + querystring.stringify({
            client_id: config.vk.client_id,
            redirect_uri: config.vk.group_redirect_url,
            group_ids: group.social_id,
            dislay: 'page',
            scope: 'manage,photos',
            response_type: 'code',
            v: this.V,
            state: JSON.stringify({
                group_id: group.id,
                social_id: group.social_id
            })
        });
    }

    static async getGroupAccessToken(code: string) {
        const URI = 'https://oauth.vk.com/access_token?' + querystring.stringify({
            client_id: config.vk.client_id,
            redirect_uri: config.vk.group_redirect_url,
            client_secret: config.vk.secret_key,
            code,
            v: this.V
        });
        let result;
        try {
            result = await rp.get(URI);
        } catch (error) {
            if (error.name === 'StatusCodeError') {
                result = error.error;
            } else {
                throw error;
            }
        }
        return JSON.parse(result);
    }

    static async getUserGroups(access_token: string): Promise<IVkGroup[]> {
        const response = await this._request('groups.get', {
            extended: 1,
            filter: 'admin',
            fields: 'members_count',
            access_token,
            v: this.V
        }, null);
        // fs.writeFileSync(path.join(__dirname, 'groups'), JSON.stringify(response, null, 4));
        return response.items;
    }

    static async setGroupCallback(group: SocialGroup) {
        if (!group.social_server_id) {
            const result = await this._request('groups.addCallbackServer', {
                group_id: group.social_id,
                url: `${config.site_url}/vk/group_callback/${group.id}`,
                title: 'Boomcover',
                access_token: group.access_token,
                v: this.V
            }, group);
            group.social_server_id = result.server_id;
        }
        return await this.setCallbackSettings(group);
    }

    static async deleteGroupCallback(group: SocialGroup) {
        if (group.social_server_id && group.access_token) {
            await this._request('groups.deleteCallbackServer', {
                group_id: group.social_id,
                server_id: group.social_server_id || 0,
                access_token: group.access_token,
                v: this.V
            }, group);
        }
    }

    static async setCallbackSettings(group: SocialGroup) {
        if (group.social_server_id) {
            await this._request('groups.setCallbackSettings', {
                group_id: group.social_id,
                server_id: group.social_server_id,
                wall_reply_new: 1,
                wall_reply_edit: 1,
                wall_reply_delete: 1,
                wall_reply_restore: 1,
                wall_repost: 1,
                group_join: 1,
                group_leave: 1,
                access_token: group.access_token,
                v: this.V
            }, group);
        }
        return true;
    }

    static async confirmCallbackUrl(group: SocialGroup) {
        if (group.access_token) {
            return await this._request('groups.getCallbackConfirmationCode', {
                group_id: group.social_id,
                access_token: group.access_token,
                v: this.V
            }, group);
        } else {
            throw new Error(`No access token in group ${group.id}`);
        }
    }

    static async getWidgetsWithData(widgets: any[], group: SocialGroup) {
        const new_widgets = [];
        const data = {
            subscribers_count: 0
        };
        for (const widget of widgets) {
            if (widget.name === 'subscriber') {
                data.subscribers_count++;
            }
        }

        const subscribers_data = await VK.getGroupSubscribers(group, data.subscribers_count);

        for (const widget of widgets) {
            if (widget.name === 'subscriber') {
                widget.widget_data = subscribers_data.shift();
            }
            if (widget.name === 'winner') {
                widget.widget_data = await VK.getVkUserInfo(group, widget.winnerId);
            }
            new_widgets.push(widget);
        }

        return new_widgets;
    }

    static async addGroupRepost(group: SocialGroup, repost: IVKRepostFromCallback) {
        const repostRepository = getRepository(SocialGroupRepost);

        const user_data = await this.getUserInfoById(repost.from_id, group.access_token);
        if (user_data) {
            await RepostService.createOrUpdateRepost({
                post_id: repost.copy_history[0].id.toString(),
                user_social_id: user_data.id.toString(),
                user_first_name: user_data.first_name,
                user_last_name: user_data.last_name,
                user_photo: user_data.photo_max,
                date: moment.unix(repost.date).toDate()
            }, group);
        }
    }

    static async addGroupComment(group: SocialGroup, comment: IVKCommentFromCallback) {
        const commentRepository = getRepository(SocialGroupComment);

        const query_params = {
            owner_id: '-' + group.social_id,
            post_id: comment.post_id,
            need_likes: 1,
            extended: 1,
            start_comment_id: comment.id,
            count: 1,
            sort: 'desc',
            fields: 'photo_max',
            lang: 'ru',
            access_token: group.user.vk_token,
            v: this.V
        };
        const response = await this._request('wall.getComments', query_params, group);
        if (!response.items.length) {
            return;
        }
        for (const item of response.items as IVKComment[]) {
            if (item.from_id < 0) {
                continue;
            }
            if (item.text) {
                await CommentService.createOrUpdateComment(item, response.profiles, comment.post_id.toString(), group);
                // log.debug(`Added comment for group ${group.id}. Text: ${item.text}`);
            }
        }
    }

    static async getGroupComments(group: SocialGroup, until_date: Moment) {
        const commentRepository = getRepository(SocialGroupComment);

        let comments_count = 0;

        const wallPostsIds = await this.getWallPosts(group, until_date);
        for (const wallPostsId of wallPostsIds) {
            const query_params = {
                owner_id: '-' + group.social_id,
                post_id: wallPostsId,
                need_likes: 1,
                extended: 1,
                offset: 0,
                count: 100,
                sort: 'desc',
                fields: 'photo_max',
                lang: 'ru',
                access_token: group.user.vk_token,
                v: this.V
            };
            let is_enought = false;
            while (!is_enought) {
                const response = await this._request('wall.getComments', query_params, group);

                if (!response.items.length) {
                    is_enought = true;
                }
                for (const item of response.items as IVKComment[]) {
                    if (item.from_id < 0) {
                        continue;
                    }
                    const comment_date = moment.unix(item.date);
                    if (comment_date >= until_date) {
                        if (item.text) {
                            comments_count++;
                            await CommentService.createOrUpdateComment(item, response.profiles, wallPostsId, group);
                        }
                    } else {
                        is_enought = true;
                        break;
                    }
                }
                query_params.offset += 100;
            }
        }
        log.info(`Added or updated ${comments_count} comments in group ${group.id}`);
    }

    static async getWallPosts(group: SocialGroup, until_date: Moment): Promise<string[]> {
        const wall_posts_ids: string[] = [];
        const query_params = {
            owner_id: '-' + group.social_id,
            offset: 0,
            count: 100,
            lang: 'ru',
            access_token: group.user.vk_token,
            v: this.V
        };
        let is_enought = false;
        while (!is_enought) {
            const response = await this._request('wall.get', query_params, group);

            if (!response.items.length) {
                is_enought = true;
            }
            for (const item of response.items) {
                const post_date = moment.unix(item.date);
                if (post_date >= until_date || item.is_pinned) {
                    wall_posts_ids.push(item.id);
                } else {
                    is_enought = true;
                    break;
                }
            }
            query_params.offset += 100;
        }
        return wall_posts_ids;
    }

    static async setCover(cover: Cover) {
        const group = await cover.group;
        const response = await this._request('photos.getOwnerCoverPhotoUploadServer', {
            group_id: group.social_id,
            crop_x: 0,
            crop_y: 0,
            crop_x2: 1590,
            crop_y2: 400,
            access_token: group.access_token,
            v: this.V
        }, group);
        const file_response = JSON.parse(await rp.post({
            url: response.upload_url,
            formData: {
                photo: fs.createReadStream(cover.full_output_path)
            }
        }));
        if (file_response.error) {
            throw new Error(response.error.error_msg);
        }
        await this._request('photos.saveOwnerCoverPhoto', {
            hash: file_response.hash,
            photo: file_response.photo,
            access_token: group.access_token,
            v: this.V
        }, group);
    }

    static async sendMessage(user_id: string, message: string): Promise<any> {
        const URI = `https://api.vk.com/method/messages.send?` + querystring.stringify({
            user_id,
            peer_id: -config.vk.group_id,
            message,
            access_token: config.vk.group_access_token,
            v: this.V
        });
        const response = JSON.parse(await rp.get(URI));
        if (response.error) {
            if (![900, 901, 902].includes(response.error.error_code)) {
                log.error('Sending message error: ', JSON.stringify(response.error));
            }
            return false;
        }
        return true;
    }

    static async getGroupLikes(group: SocialGroup, until_date: Moment) {
        const likesRepository = getRepository(SocialGroupLike);
        const wallPostsIds = await this.getWallPosts(group, until_date);
        for (const wallPostsId of wallPostsIds) {
            const queryParams = {
                type: 'post',
                owner_id: '-' + group.social_id,
                item_id: wallPostsId,
                filter: 'likes',
                extended: 0,
                offset: 0,
                count: 1000,
                lang: 'ru',
                access_token: group.user.vk_token,
                v: this.V
            };
            let is_enought = false;
            while (!is_enought) {
                const response = await this._request('likes.getList', queryParams, group);
                if (!response.items.length) {
                    is_enought = true;
                }
                for (const vkUserId of response.items as number[]) {
                    await LikeService.createOrUpdateLikeByVkUserId(wallPostsId, vkUserId, group);
                }
                if (queryParams.offset + queryParams.count <= response.count) {
                    is_enought = true;
                }
                queryParams.offset += 1000;
            }
        }
        log.info(`Likes for group ${group.id} was updated.`);
    }

    static async getGroupStats(group: SocialGroup) {
        const nowString = moment().format('YYYY-MM-DD');
        const cacheKey = sha256(`stats${group.id}`).toString();
        let value: VKStats = cache.get(cacheKey);
        if (value !== undefined) {
            return value;
        }
        const groupWithUser = await getRepository(SocialGroup).findOneById(group.id);
        if (!(await this.getAppPermissions(groupWithUser.user)).has_stats) {
            return {
                members: null,
                subscribed: null,
                visitors: null,
                views: null
            };
        }
        const response = await this._request('stats.get', {
            group_id: group.social_id,
            date_from: nowString,
            date_to: nowString,
            access_token: groupWithUser.user.vk_token,
            v: this.V
        }, group);
        const groupInfo = await this._request('groups.getById', {
            group_id: group.social_id,
            fields: 'members_count',
            access_token: group.access_token,
            v: this.V
        }, group);
        value = {
            members: groupInfo[0].members_count,
            subscribed: response.length ? response[0].subscribed : 0,
            visitors: response.length ? response[0].visitors : 0,
            views: response.length ? response[0].views : 0
        };
        cache.set(cacheKey, value, 600);
        return value;
    }

    static async getAppPermissions(user: User) {
        const cacheKey = sha256(`permissions${user.vk_token}`).toString();
        let value: VKPermissions = cache.get(cacheKey);
        if (value !== undefined) {
            return value;
        }
        const response = await this._request('account.getAppPermissions', {
            user_id: user.vk_id,
            access_token: user.vk_token,
            v: this.V
        }, null);
        value = {
            has_stats: !!(response & 1048576)
        };
        cache.set(cacheKey, value);
        return value;
    }

    private static async getGroupSubscribers(group: SocialGroup, subscribers_count: number): Promise<any[]> {
        const response = await this._request('groups.getMembers', {
            group_id: group.social_id,
            sort: 'time_desc',
            offset: 0,
            count: subscribers_count,
            fields: 'photo_max',
            lang: 'ru',
            access_token: group.access_token,
            v: this.V
        }, group);
        return response.items || [];
    }

    private static async getVkUserInfo(group: SocialGroup, user_id: string): Promise<any> {
        if (!user_id) {
            return null;
        }
        const key = `VK_${user_id}`;
        let value = cache.get(key);
        if (!value) {
            const response = await this._request('users.get', {
                user_ids: user_id,
                fields: 'photo_max',
                name_case: 'Nom',
                lang: 'ru',
                access_token: group.access_token,
                v: this.V
            }, group);
            value = response.length ? response[0] : null;
            cache.set(key, value, 600);
        }
        return value;
    }

    private static async _request(method: string, data: IVKQuery, group: SocialGroup) {
        const URI = `https://api.vk.com/method/${method}?` + querystring.stringify(data);
        const response = JSON.parse(await rp.get(URI));
        if (response.error) {
            if ([5, 27, 203].includes(response.error.error_code)) {
                if (group) {
                    if (response.error.error_code === 5) {
                        Log.UNCONNECT.error(`Problem with user token in group ${group.id}`);
                    } else if (response.error.error_code === 27) {
                        Log.UNCONNECT.error(`Problem with group token in group ${group.id}`);
                    } else if (response.error.error_code === 203) {
                        Log.UNCONNECT.error(`Доступ к группе запрещён. ${group.id}`);
                    }
                    await GroupService.unconnectGroup(group, true);
                }
                if (response.error.error_code === 5 && data.user_id) {
                    const userRepository = getRepository(User);
                    const user = await userRepository.findOne({
                        where: {
                            vk_id: data.user_id
                        }
                    });
                    user.vk_token = null;
                    user.token = null;
                    await userRepository.save(user);
                }
            } else if (response.error.error_code === 14) {
                Log.CAPTCHA.warn(`Captcha for group ${group.id}`);
                if (group && (!group.need_captcha || data.captcha_sid)) {
                    if (data.captcha_id) {
                        Log.CAPTCHA.error(`Report bad captcha for group ${group.id}\n Rucaptcha ID: ${data.captcha_id}\n Result: ${data.captcha_key}`);
                        await RuCaptcha.report(data.captcha_id as string);
                    }
                    group = await GroupService.setNeedCaptcha(group, true);
                    const captcha_key = await RuCaptcha.getCaptcha(response.error.captcha_img);
                    if (captcha_key) {
                        Log.CAPTCHA.debug(`Sid: ${response.error.captcha_sid}\n Img: ${response.error.captcha_img}\n Rucaptcha ID: ${captcha_key.captcha_id}\n Result: ${captcha_key.captcha}`);
                        data.captcha_sid = response.error.captcha_sid;
                        data.captcha_id = captcha_key.captcha_id;
                        data.captcha_key = captcha_key.captcha;
                        try {
                            const result = await this._request(method, data, group);
                            group = await GroupService.setNeedCaptcha(group, false);
                            return result;
                        } catch (err) {
                            Log.CAPTCHA.error(`Trouble with captcha in group ${group.id}. ${JSON.stringify(err)}`);
                            throw err;
                        }
                    }
                    Log.CAPTCHA.error('Can`t recognize captcha: ', response.error.captcha_img);
                }
            } else if (response.error.error_code === 6) {
                log.warn('Requests limit. Wait for 500ms.');
                sleep(500);
                return await this._request(method, data, group);
            } else if (response.error.error_code === 9) {
                log.warn(`Flood request detected in method ${method}, ${group ? group.id : JSON.stringify(data)}` );
                return false;
            } else if (method === 'groups.setCallbackSettings' && response.error.error_code === 104) {
                log.warn(`Group social id ${data.group_id}. Error when set callback settings.`);
                return false;
            }
            throw new Error(`Code: ${response.error.error_code}. Message: ${response.error.error_msg}. Resp: ${JSON.stringify(response)}. URL ${URI}`);
        }
        return response.response;
    }
}
