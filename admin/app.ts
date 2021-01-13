'use strict';

import config from '@config';
import DB from '@db';
import * as bodyParser from 'body-parser';
import cookieSession = require('cookie-session');
import { Errback, Express, NextFunction, Request, Response } from 'express';
import * as express from 'express';
import * as fs from 'fs';
import * as log4js from 'log4js';
import * as moment from 'moment';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import log from './components/logger';

// Routes
import { MainRoute } from './routes/main';

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

        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'pug');
        this.app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
        this.app.get('/favicon.ico', (req, res) => {
            res.status(200).send();
        });
        this.app.use(express.static(path.join(__dirname, '/public')));

        this.app.use(cookieSession({
            name: 'boomcover_admin',
            secret: config.cookie_secret,
            maxAge: Date.now() + 36000,
            httpOnly: true
        })
        );

        this.app.use(log4js.connectLogger(log4js.getLogger('admin'), { level: 'auto' }));

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    private async routes() {

        await DB.getConnection();

        const router: express.Router = express.Router();

        this.app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'authorization,X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            next();
        });

        MainRoute.create(router);

        this.app.use(router);

        this.app.use((err: Errback, req: Request, res: Response, next: NextFunction) => {
            log.error(JSON.stringify(err));
            res.sendStatus(500);
        });
    }
}

export default Server.bootstrap().app;
