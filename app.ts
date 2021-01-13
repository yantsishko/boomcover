'use strict';

import log from '@component/logger';
import config from '@config';
import * as bodyParser from 'body-parser';
import cookieSession = require('cookie-session');
import { Errback, Express, NextFunction, Request, Response } from 'express';
import * as express from 'express';
import * as log4js from 'log4js';
import * as moment from 'moment';
import * as path from 'path';
import * as favicon from 'serve-favicon';

import DB from '@db';
import { createConnection } from 'typeorm';

import { CoverRoute } from '@route/cover';
import { CurrenciesRoute } from '@route/currencies';
import { FileRoute } from '@route/file';
import { GroupRoute } from '@route/groups';
import { MainRoute } from '@route/main';
import { PaymentRoute } from '@route/payment';
import { TestRoute } from '@route/test';
import { WeatherRoute } from '@route/weather';

class Server {

    static bootstrap(): Server {
        return new Server();
    }

    app: Express;

    constructor() {
        // create expressjs application
        this.app = express();

        // configure application
        this.config();

        this.routes();
    }

    private config() {

        moment.locale('ru');

        this.app.set('views', path.join(__dirname, 'protected/views'));
        this.app.set('view engine', 'pug');
        this.app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
        this.app.get('/favicon.ico', (req, res) => {
            res.status(200).send();
        });
        this.app.use(express.static(path.join(__dirname, '/public')));

        this.app.use(cookieSession({
            name: 'boomcover',
            secret: config.cookie_secret,
            maxAge: Date.now() + 36000,
            httpOnly: true
        })
        );

        this.app.use(log4js.connectLogger(log4js.getLogger('http'), { level: 'auto' }));

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    private async routes() {

        if (!config.isTest) {
            await DB.getConnection(true);
        }

        let router: express.Router;
        router = express.Router();

        this.app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'authorization,X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            next();
        });

        MainRoute.create(router);
        GroupRoute.create(router);
        CurrenciesRoute.create(router);
        PaymentRoute.create(router);
        WeatherRoute.create(router);
        FileRoute.create(router);
        CoverRoute.create(router);

        if (config.env === 'development') {
            TestRoute.create(router);
        }

        this.app.use(router);

        this.app.use((err: Errback, req: Request, res: Response, next: NextFunction) => {
            log.error(JSON.stringify(err));
            res.sendStatus(500);
        });
    }
}

export default Server.bootstrap().app;
