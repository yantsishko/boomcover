'use strict';

import log from '@component/logger';
import Queue from '@component/queue';
import DB from '@db';
import { SocialGroup } from '@entity/SocialGroup';
import { GroupService } from '@service/group';
import { VK } from '@service/vk';
import * as moment from 'moment';

log.info('Look messages for', Queue.QUEUE_CACHE_UPDATE);
DB.getConnection()
    .then((connection) => {
        const groupRepository = connection.getRepository(SocialGroup);
        Queue.recieveMessages(async (msg) => {
            log.debug('Get message', msg.content.toString());
            try {
                const data = JSON.parse(msg.content.toString());

                const group = await groupRepository.findOneById(data.group_id);
                if (!group) {
                    throw new Error('There no group with id ' + data.group_id);
                }
                if (!group.connected) {
                    throw new Error('Group not connected ' + data.group_id);
                }
                if (group.need_captcha) {
                    return 'resend';
                }
                await GroupService.updateCachedData(group, true);
                await Queue.sendMessage({
                    group_id: group.id
                }, Queue.QUEUE_COVER_GENERATION);
            } catch (err) {
                log.error(err, msg.content.toString());
            }
        }, Queue.QUEUE_CACHE_UPDATE, 3);
    })
    .catch((err) => {
        log.error('Queue error: ', err);
    });
