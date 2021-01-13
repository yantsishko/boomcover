'use strict';

import log from '@component/logger';
import { CurrencyService } from '@service/currencies';
import { NextFunction, Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import { BaseRoute } from './base_router';

export class CurrenciesRoute extends BaseRoute {

    static create(router: Router) {
        log.info('[CurrenciesRoute::create] Creating currencies routes.');

        const route = new CurrenciesRoute();

        router.get('/api/v1/currencies', route.currencies);
        router.get('/api/v1/currencies/codes', route.currenciesCodes);
    }

    constructor() {
        super();
    }

    async currencies(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await CurrencyService.getCurrencies());
        } catch (err) {
            log.error(err);
            res.sendStatus(500);
        }
    }

    async currenciesCodes(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await CurrencyService.getCurrenciesCodes());
        } catch (err) {
            log.error(err);
            res.sendStatus(500);
        }
    }
}
