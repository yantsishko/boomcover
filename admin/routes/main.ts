'use strict';

import config from '@config';
import { NextFunction, Request, Response, Router } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import log from '../components/logger';
import { LogItem } from '../defenitions';
import { BaseRoute } from './base_router';

export class MainRoute extends BaseRoute {

    static create(router: Router) {
        log.info('[MainRoute::create] Creating main routes.');

        const route = new MainRoute();

        router.get('/', MainRoute.main);
        router.get('/:name', MainRoute.log);
    }

    private static async main(req: Request, res: Response, next: NextFunction) {
        res.render('index', {
            files: MainRoute.logFiles
        });
    }

    private static async log(req: Request, res: Response, next: NextFunction) {
        try {
            const logPath = path.join(config.admin.logs_path, req.param('name', '') + '.json');
            if (!fs.existsSync(logPath)) {
                throw new Error('No log file found.');
            }
            const logData = (await MainRoute.getLogData(logPath)).reverse();

            res.render('log', {
                files: MainRoute.logFiles,
                name: req.param('name', ''),
                logData
            });
        } catch (err) {
            next(err);
        }
    }

    private static getLogData(logPath: string): Promise<LogItem[]> {
        return new Promise<LogItem[]>((resolve, reject) => {
            const rl = readline.createInterface({
                input: fs.createReadStream(logPath)
            });
            const logData: LogItem[] = [];

            rl.on('line', (line) => {
                if (!line) {
                    return;
                }
                const logDataItem: LogItem = JSON.parse(line);
                logDataItem.startTime = (new Date(logDataItem.startTime)).toLocaleString();
                logDataItem.data = logDataItem.data.map((dataItem) => {
                    if (typeof dataItem === 'string') {
                        return dataItem;
                    } else {
                        const info = this.escapeHtml(dataItem.info);
                        const message = this.escapeHtml(dataItem.message);
                        return `<a href="#" data-toggle="popover" data-html="true" title="Error" data-content="${info}">${message}</span>`;
                    }
                });
                switch (logDataItem.level.colour) {
                    case 'blue':
                        logDataItem.level.class = 'table-primary';
                        break;
                    case 'cyan':
                        logDataItem.level.class = 'table-info';
                        break;
                    case 'green':
                        logDataItem.level.class = 'table-success';
                        break;
                    case 'yellow':
                        logDataItem.level.class = 'table-warning';
                        break;
                    case 'red':
                        logDataItem.level.class = 'table-danger';
                        break;
                    case 'magenta':
                        logDataItem.level.class = 'table-dark';
                        break;
                }
                logData.push(logDataItem);
            });

            rl.on('close', () => {
                logData.splice(logData.length - 201, 200);
                resolve(logData);
            });
        });
    }
}
