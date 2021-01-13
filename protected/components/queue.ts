'use strict';

import log from '@component/logger';
import config from '@config';
import {MessageService} from '@service/message';
import * as amqp from 'amqplib';
import sha256 = require('crypto-js/sha256');

class Queue {

    readonly QUEUE_COVER_GENERATION = config.env + '_cover_generation';
    readonly QUEUE_COMMENTS_UPDATE = config.env + '_comments_updates';
    readonly QUEUE_COMMENT_CREATE = config.env + '_comment_create';
    readonly QUEUE_CACHE_UPDATE = config.env + '_cache_updates';
    readonly QUEUE_REPOST_CREATE = config.env + '_respost_create';

    private connection: amqp.Connection;
    private channel: amqp.Channel;
    private url = `amqp://${config.rabbit.user}:${config.rabbit.password}@${config.rabbit.host}:${config.rabbit.port}`;

    async sendMessage(message: any, queue: string = 'default') {
        await this.checkConnection();
        const stringified_message = JSON.stringify(message);
        const messageID = sha256(queue + stringified_message).toString();
        // log.debug(`Try send message to ${queue}. ID: ${messageID}; Data: ${stringified_message}`);

        if (await MessageService.isExistsMessage(messageID)) {
            return true;
        }
        if (!await MessageService.addMessage(messageID)) {
            return true;
        }
        const ch = await this.getChannel();
        await ch.assertQueue(queue, {
            durable: true
        });
        const result = ch.sendToQueue(queue, Buffer.from(stringified_message), {
            messageId: messageID,
            persistent: true
        });
        return result;
    }

    async recieveMessages(do_with_msg: (msg: amqp.Message) => Promise<string>, queue: string = 'default', prefetch: number = 3) {
        await this.checkConnection();
        const ch = await this.getChannel();
        ch.prefetch(prefetch);
        await ch.assertQueue(queue, {
            durable: true
        });

        await ch.consume(queue, async (msg) => {
            const action = await do_with_msg(msg);
            await MessageService.removeMessage(msg.properties.messageId);
            if (action === 'resend') {
                await this.sendMessage(JSON.parse(msg.content.toString()), queue);
            }
            ch.ack(msg);
            if (action === 'exit') {
                this.connection.close();
                process.exit(0);
            }
        }, {
            noAck: false
        });
    }

    async close() {
        if (this.connection) {
            await this.connection.close();
            this.connection = undefined;
        }
    }

    private async checkConnection() {
        if (!this.connection) {
            try {
                this.connection = await amqp.connect(this.url);
            } catch (err) {
                log.error('Error from amqp: ', err);
                process.exit(1);
            }
        }
    }

    private async getChannel() {
        if (!this.channel) {
            this.channel = await this.connection.createChannel();
        }
        return this.channel;
    }
}

export default new Queue();
