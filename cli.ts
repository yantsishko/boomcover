'use strict';

import log from '@component/logger';
import Queue from '@component/queue';
import DB from '@db';
import { Cover } from '@entity/Cover';
import { User } from '@entity/User';
import { GroupService } from '@service/group';
import { MessageService } from '@service/message';
import { RuCaptcha } from '@service/rucaptcha';
import { UserService } from '@service/user';
import { VK } from '@service/vk';
import { Weather } from '@service/weather';
import * as cli from 'cli';
import {
    Connection,
    createConnection,
    getManager,
    getRepository
} from 'typeorm';

const args = cli.parse({
    id: [false, 'An ID', 'string', false]
}, [
    'sync_schema',
    'migrate',
    'load_cities',
    'generate_all_covers',
    'gen_and_upload',
    'unconnect_groups',
    'update_all_comments',
    'update_all_cache',
    'update_group_cache',
    'update_only_group_cache',
    'remove_all_messages',
    'remove_old_messages',
    'generate_images',
    'generate_masks',
    'get_captcha',
    'send_notifications',
    'update_cover_settings',
    'subscribe_all'
]);

async function run_command(connection: Connection) {
    switch (cli.command) {
        case 'sync_schema':
            await connection.synchronize();
            break;
        case 'migrate':
            await connection.runMigrations();
            break;
        case 'generate_all_covers':
            log.info('Generate all covers.');
            await GroupService.generateAllCoversWithoutUpload();
            break;
        case 'gen_and_upload':
            log.info('Generate all covers.');
            await GroupService.generateAllCoversWithoutUpload();
            break;
        case 'unconnect_groups':
            log.info('Unconnect unpayed groups.');
            await UserService.unconnectUnpayedGroups();
            break;
        case 'update_all_comments':
            log.info('Updating all comments.');
            await GroupService.updateCommentsInAllGroups();
            break;
        case 'update_all_cache':
            log.info('Updating all cache.');
            await GroupService.updateCacheInAllGroups();
            break;
        case 'update_group_cache':
            if (args.id) {
                log.info(`Updating group ${args.id} cache.`);
                await Queue.sendMessage({
                    group_id: args.id,
                    update_cache: true,
                    update_likes: true
                }, Queue.QUEUE_COMMENTS_UPDATE);
            } else {
                log.warn('You should specify --id param.');
            }
            break;
        case 'update_only_group_cache':
            if (args.id) {
                log.info(`Updating group ${args.id} cache.`);
                await Queue.sendMessage({
                    group_id: args.id
                }, Queue.QUEUE_CACHE_UPDATE);
            } else {
                log.warn('You should specify --id param.');
            }
            break;
        case 'remove_old_messages':
            log.info('Removing old messages.');
            await MessageService.clearOld();
            break;
        case 'remove_all_messages':
            log.info('Removing all messages.');
            await MessageService.clearAll();
            break;
        case 'get_captcha':
            await RuCaptcha.getCaptcha('http://api.vk.com//captcha.php?sid=239633676097&s=1');
            break;
        case 'send_notifications':
            await UserService.sendSubscriptionNotfications();
            break;
        case 'load_cities':
            await Weather.reloadCities();
            break;
        case 'update_cover_settings':
            const coverRepository = getRepository(Cover);
            const covers = await coverRepository.find();
            for (const cover of covers) {
                let needSave = false;
                for (const widget of cover.settings) {
                    if (widget.name === 'traffic' && widget.text10) {
                        for (let i = 1; i <= 10; i++) {
                            widget[`text${i - 1}`] = widget[`text${i}`];
                        }
                        delete widget.text10;
                        needSave = true;
                        break;
                    }
                }
                if (needSave) {
                    await coverRepository.save(cover);
                }
            }
            break;
        case 'subscribe_all':
            const users = await getRepository(User).find();
            for (const user of users) {
                await UserService.subscribe(user, 5, 5);
            }
    }
}
DB.getConnection()
    .then(async (connection) => {
        await run_command(connection);
        await DB.close();
        await Queue.close();
        cli.ok('Finished!');
        cli.exit(0);
    })
    .catch(async (error) => {
        await DB.close();
        await Queue.close();
        cli.error(error);
        cli.exit(1);
    });
