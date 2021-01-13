'use strict';

import { Log } from '@component/logger';
import Queue from '@component/queue';
import DB from '@db';
import { SocialGroup } from '@entity/SocialGroup';
import { CoverService } from '@service/cover';

Log.CONVERT.info('Look messages for', Queue.QUEUE_COVER_GENERATION);

const start = (new Date()).valueOf();
const TIME_TO_RESTART = 1000 * 60 * 60 * 2; // every 2 hours

DB.getConnection()
    .then((connection) => {
        const groupRepository = connection.getRepository(SocialGroup);
        Queue.recieveMessages(async (msg) => {
            try {
                const data = Object.assign({
                    upload: true
                }, JSON.parse(msg.content.toString()));
                const group = await groupRepository.findOneById(data.group_id);
                if (!group) {
                    throw new Error('There no group with id ' + data.group_id);
                }
                if (!group.connected) {
                    return;
                }
                const cover = await group.cover;
                if (!cover) {
                    return;
                }
                if (group.need_captcha) {
                    return;
                }
                if (data.upload) {
                    await CoverService.generateAndUploadCover(cover);
                } else {
                    await CoverService.generate(cover);
                }
            } catch (err) {
                Log.CONVERT.error(err);
            }
            if ((new Date()).valueOf() - start > TIME_TO_RESTART) {
                return 'exit';
            }
            return null;
        }, Queue.QUEUE_COVER_GENERATION, 1);
    })
    .catch((err) => {
        Log.CONVERT.error('Queue error: ', err);
    });
