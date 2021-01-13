'use strict';

import log from '@component/logger';
import Queue from '@component/queue';
import DB from '@db';
import { SocialGroup } from '@entity/SocialGroup';
import { IVKCommentFromCallback, VK } from '@service/vk';
import * as moment from 'moment';

log.info('Look messages for', Queue.QUEUE_REPOST_CREATE);
DB.getConnection()
    .then((connection) => {
        const groupRepository = connection.getRepository(SocialGroup);
        Queue.recieveMessages(async (msg) => {
            log.debug('Get message', msg.content.toString());
            try {
                const data = Object.assign({

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
                if (group.is_closed) {
                    throw new Error('Group can`t be closed ' + data.group_id);
                }
                if (group.need_captcha) {
                    return 'resend';
                }
                await VK.addGroupRepost(group, data.callback_data);
                await Queue.sendMessage({
                    group_id: group.id
                }, Queue.QUEUE_COVER_GENERATION);
                return null;
            } catch (err) {
                log.error(err, msg.content.toString());
            }
        }, Queue.QUEUE_REPOST_CREATE, 3);
    })
    .catch((err) => {
        log.error('Queue error: ', err);
    });
