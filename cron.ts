'use strict';

import log from '@component/logger';
import Queue from '@component/queue';
import config from '@config';
import DB from '@db';
import { CommentService } from '@service/comment';
import { GroupService } from '@service/group';
import { LikeService } from '@service/like';
import { MessageService } from '@service/message';
import { RepostService } from '@service/reposts';
import { UserService } from '@service/user';
import * as cron from 'cron';
import { createConnection } from 'typeorm';

const CronJob = cron.CronJob;

const generateCoversJob = new CronJob({
    cronTime: '00 * * * * *',
    onTick: async () => {
        try {
            log.info('Start job to generate date and time covers.');
            await GroupService.generateAllCovers(['date', 'timer', 'weather']);
        } catch (error) {
            log.error(error);
        }
    }
});

const generateCoversEveryHourJob = new CronJob({
    cronTime: '00 00 * * * *',
    onTick: async () => {
        try {
            log.info('Start job to generate all covers.');
            await GroupService.generateAllCovers();
        } catch (error) {
            log.error(error);
        }
    }
});

const cacheUpdateJob = new CronJob({
    cronTime: '00 00 00 * * *',
    onTick: async () => {
        try {
            log.info('Start job to update cache in all covers.');
            await GroupService.updateCacheInAllGroups();
        } catch (error) {
            log.error(error);
        }
    },
    timeZone: 'Europe/Minsk'
});

const clearMessageJob = new CronJob({
    cronTime: '00 00 * * * *',
    onTick: async () => {
        try {
            log.info('Start job to clear all messages.');
            await MessageService.clearOld();
        } catch (error) {
            log.error(error);
        }
    }
});

const clearOldDataJob = new CronJob({
    cronTime: '00 00 */2 * * *',
    onTick: async () => {
        try {
            log.info('Start job to clear old data.');
            await CommentService.clearOld();
            await RepostService.clearOld();
            await LikeService.clearOld();
        } catch (error) {
            log.error(error);
        }
    }
});

const removeNeedCaptchaJob = new CronJob({
    cronTime: '00 */6 * * * *',
    onTick: async () => {
        try {
            log.info('Start job to clear need captcha.');
            await GroupService.removeNeedCaptcha();
        } catch (error) {
            log.error(error);
        }
    }
});

const unconnectUnpayedGroupsJob = new CronJob({
    cronTime: '00 00 00 * * *',
    onTick: async () => {
        try {
            if (config.payment.demo) {
                return;
            }
            log.info('Start job to unconnect all unpayed groups.');
            await UserService.unconnectUnpayedGroups();
        } catch (error) {
            log.error(error);
        }
    }
});

const sendPaymentNotificationsJob = new CronJob({
    cronTime: '00 00 00 * * *',
    onTick: async () => {
        try {
            if (config.payment.demo) {
                return;
            }
            log.info('Start job to send notifications to subscriptions.');
            await UserService.sendSubscriptionNotfications();
        } catch (error) {
            log.error(error);
        }
    },
    timeZone: 'Europe/Minsk'
});

DB.getConnection()
    .then((connection) => {
        cacheUpdateJob.start();
        generateCoversJob.start();
        generateCoversEveryHourJob.start();
        clearMessageJob.start();
        unconnectUnpayedGroupsJob.start();
        sendPaymentNotificationsJob.start();
        clearOldDataJob.start();
    })
    .catch(async (err) => {
        log.error(err);
        await DB.close();
        await Queue.close();
        process.exit(1);
    });
