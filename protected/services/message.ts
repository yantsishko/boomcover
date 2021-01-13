'use strict';

import log from '@component/logger';
import {Message} from '@entity/Message';
import * as moment from 'moment';
import { getRepository } from 'typeorm';
import config from '../../config/index';

export class MessageService {

    static async isExistsMessage(messageID: string) {
        const messageRepository = getRepository(Message);

        const message = await messageRepository.findOne({message_key: messageID});

        return !!message;
    }

    static async addMessage(messageID: string) {
        const messageRepository = getRepository(Message);

        const message = new Message();
        message.message_key = messageID;

        try {
            await messageRepository.save(message);
        } catch (err) {
            if (err.code !== 'ER_DUP_ENTRY') {
                throw err;
            } else {
                return false;
            }
        }

        return true;
    }

    static async removeMessage(messageID: string) {
        const messageRepository = getRepository(Message);

        const message = await messageRepository.findOne({message_key: messageID});
        if (message) {
            await messageRepository.remove(message);
        }

        return true;
    }

    static async clearAll() {
        const messageRepository = getRepository(Message);
        await messageRepository.delete({});
        return true;
    }

    static async clearOld() {
        const messageRepository = getRepository(Message);
        await messageRepository.createQueryBuilder('message')
            .delete()
            .where('message.create_date <= :date', {
                date: moment().subtract(1, 'hours').format('YYYY-MM-DD HH:mm:ss')
            })
            .execute();
        return true;
    }
}
