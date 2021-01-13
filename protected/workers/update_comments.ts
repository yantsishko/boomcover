'use strict';

import log from '@component/logger';
import Queue from '@component/queue';
import DB from '@db';
import { SocialGroup } from '@entity/SocialGroup';
import { VK } from '@service/vk';
import * as moment from 'moment';

log.info('Look messages for', Queue.QUEUE_COMMENTS_UPDATE);
DB.getConnection()
    .then((connection) => {
        const groupRepository = connection.getRepository(SocialGroup);
        Queue.recieveMessages(async (msg) => {
            log.debug('Get message', msg.content.toString());
            try {
                const data = Object.assign({
                    generate_cover: true,
                    update_cache: false,
                    update_likes: false
                }, JSON.parse(msg.content.toString()));

                const group = await groupRepository.findOneById(data.group_id);
                if (!group) {
                    throw new Error('There no group with id ' + data.group_id);
                }
                if (!group.user) {
                    throw new Error('There no user in group ' + data.group_id);
                }
                if (!group.connected) {
                    throw new Error('Group not connected ' + data.group_id);
                }
                const cover = await group.cover;
                if (!cover || !cover.settings) {
                    log.warn('There no cover or cover settings in group ' + data.group_id);
                    return;
                }
                if (group.need_captcha) {
                    return 'resend';
                }
                const date = moment().subtract(7, 'days');
                await VK.getGroupComments(group, date);
                if (data.update_likes) {
                    await VK.getGroupLikes(group, moment().subtract(1, 'days'));
                }
                if (data.generate_cover) {
                    await Queue.sendMessage({
                        group_id: group.id
                    }, Queue.QUEUE_COVER_GENERATION);
                }
                if (data.update_cache) {
                    await Queue.sendMessage({
                        group_id: group.id,
                    }, Queue.QUEUE_CACHE_UPDATE);
                }
                return null;
            } catch (err) {
                log.error(err, msg.content.toString());
            }
        }, Queue.QUEUE_COMMENTS_UPDATE, 1);
    })
    .catch((err) => {
        log.error('Queue error: ', err);
    });
