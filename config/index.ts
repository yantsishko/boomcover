'use strict';

import * as optimist from 'optimist';
import * as path from 'path';

export interface IConfig {
    db: {
        type: 'mysql',
        host: string,
        port: number,
        username: string,
        password: string,
        database: string,
        timezone: string
    };
    port: number;
    cookie_secret: string;
    vk: {
        group_id: string|number,
        group_access_token: string,
        client_id: string,
        service_key: string,
        secret_key: string,
        redirect_url: string,
        group_redirect_url: string
    };
    rucaptcha: {
        token: string
    };
    rabbit: {
        user: string
        password: string
        host: string
        port: number
    };
    payment: {
        shopId: string,
        scid: string,
        secret: string,
        demo: boolean
    };
    admin: {
        port: number;
        logs_path: string;
    };
    youtube: {
        api_key: string;
    };
    site_url: string;
    argv: any;
    env: string;
    isTest: boolean;
}

const site_url = (process.env.PROTOCOL || 'https') + '://' + (process.env.HOST || 'boomcover.com');
const ENV: string = optimist.argv.env || 'production';
const conf: IConfig = {
    db: {
        type: 'mysql',
        host: process.env.DB_HOST || 'db',
        port: parseInt(process.env.DB_PORT, 10) || 3306,
        username: process.env.DB_USERNAME || 'boomcover',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_DATABASE || 'boomcover',
        timezone: 'UTC'
    },
    site_url,
    port: parseInt(process.env.PORT, 10) || 3000,
    cookie_secret: process.env.COOKIE_SECRET || 'q4oeQF0q2ZwF1oATJu2657BmvK9P8n9j$$devengo94234ggq',
    vk: {
        group_id: process.env.VK_GROUP_ID,
        group_access_token: process.env.VK_GROUP_ACCESS_TOKEN,
        client_id: process.env.VK_CLIENT_ID,
        secret_key: process.env.VK_SECRET_KEY,
        service_key: process.env.VK_SERVICE_KEY,
        redirect_url: site_url + process.env.VK_REDIRECT_URL,
        group_redirect_url: site_url + process.env.VK_GROUP_REDIRECT_URL
    },
    rucaptcha: {
        token: process.env.RUCAPTCHA_TOKEN
    },
    rabbit: {
        user: process.env.RABBIT_USER || 'guest',
        password: process.env.RABBIT_PASSWORD || 'guest',
        host: process.env.RABBIT_HOST || 'rabbit',
        port: parseInt(process.env.RABBIT_PORT, 10) || 5672
    },
    payment: {
        shopId: process.env.PAYMENT_SHOP_ID,
        scid: process.env.PAYMENT_SCID,
        secret: process.env.PAYMENT_SECRET,
        demo: !!(process.env.PAYMENT_DEMO === 'true')
    },
    admin: {
        port: parseInt(process.env.ADMIN_PORT, 10) || 3001,
        logs_path: process.env.ADMIN_LOGS_PATH || path.join(__dirname, '..', 'protected', 'runtime', 'logs', 'json')
    },
    youtube: {
        api_key: process.env.YOUTUBE_API_KEY
    },
    argv: optimist.argv,
    env: ENV,
    isTest: process.env.TEST ? true : false
};

export default conf;
