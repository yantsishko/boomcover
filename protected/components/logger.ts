'use strict';

import config from '@config';
import * as log4js from 'log4js';
import * as path from 'path';

log4js.addLayout('json', (layoutConfig) => (logEvent) => {
    logEvent.data = logEvent.data.map((dataElement) => {
        if (typeof dataElement === 'string') {
            return dataElement.replace(/\n/g, '<br>');
        } else if (dataElement instanceof Error) {
            return {
                message: (dataElement.name + ' ' + dataElement.message),
                info: dataElement.stack.toString()
            };
        }
        return JSON.stringify(dataElement, null, 4);
    });
    return JSON.stringify(logEvent);
});

log4js.configure({
    appenders: {
        unconnect: {
            type: 'file',
            filename: path.join(__dirname, '..', 'runtime', 'logs', 'unconnect.log'),
            maxLogSize: 10458760, // 10MB
            backups: 3
        },
        unconnectJSON: {
            type: 'file',
            filename: path.join(__dirname, '..', 'runtime', 'logs', 'json', 'unconnect.json'),
            maxLogSize: 10458760, // 10MB
            backups: 0,
            layout: {
                type: 'json'
            }
        },
        captcha: {
            type: 'file',
            filename: path.join(__dirname, '..', 'runtime', 'logs', 'captcha.log'),
            maxLogSize: 10458760, // 10MB
            backups: 3
        },
        captchaJSON: {
            type: 'file',
            filename: path.join(__dirname, '..', 'runtime', 'logs', 'json', 'captcha.json'),
            maxLogSize: 10458760, // 10MB
            backups: 0,
            layout: {
                type: 'json'
            }
        },
        payment: {
            type: 'file',
            filename: path.join(__dirname, '..', 'runtime', 'logs', 'payment.log'),
            maxLogSize: 10458760, // 10MB
            backups: 3
        },
        paymentJSON: {
            type: 'file',
            filename: path.join(__dirname, '..', 'runtime', 'logs', 'json', 'payment.json'),
            maxLogSize: 10458760, // 10MB
            backups: 0,
            layout: {
                type: 'json'
            }
        },
        convert: {
            type: 'file',
            filename: path.join(__dirname, '..', 'runtime', 'logs', 'convert.log'),
            maxLogSize: 10458760, // 10MB
            backups: 3
        },
        convertJSON: {
            type: 'file',
            filename: path.join(__dirname, '..', 'runtime', 'logs', 'json', 'convert.json'),
            maxLogSize: 10458760, // 10MB
            backups: 0,
            layout: {
                type: 'json'
            }
        },
        test: {
            type: 'file',
            filename: path.join(__dirname, '..', 'runtime', 'logs', 'test.log'),
            maxLogSize: 10458760, // 10MB
            backups: 3
        },
        console: {
            type: 'console'
        },
        consoleJSON: {
            type: 'file',
            filename: path.join(__dirname, '..', 'runtime', 'logs', 'json', 'app.json'),
            maxLogSize: 10458760, // 10MB
            backups: 0,
            layout: {
                type: 'json'
            }
        }
    },
    categories: {
        default: {
            appenders: config.isTest ? ['test'] : ['console', 'consoleJSON'],
            level: 'debug'
        },
        admin: {
            appenders: config.isTest ? ['test'] : ['console'],
            level: 'debug'
        },
        captcha: {
            appenders: config.isTest ? ['test'] : ['captcha', 'captchaJSON'],
            level: 'debug'
        },
        unconnect: {
            appenders: config.isTest ? ['test'] : ['unconnect', 'unconnectJSON'],
            level: 'debug'
        },
        payment: {
            appenders: config.isTest ? ['test'] : ['payment', 'paymentJSON'],
            level: 'debug'
        },
        convert: {
            appenders: config.isTest ? ['test'] : ['console', 'convertJSON'],
            level: 'debug'
        },
    }
});

export default log4js.getLogger();

export namespace Log {
    export const ADMIN = log4js.getLogger('admin');
    export const CAPTCHA = log4js.getLogger('captcha');
    export const UNCONNECT = log4js.getLogger('unconnect');
    export const PAYMENT = log4js.getLogger('payment');
    export const CONVERT = log4js.getLogger('convert');
}
