'use strict';

import log from '@component/logger';
import { Log } from '@component/logger';
import config from '@config';
import { PaymentService } from '@service/payment';
import { NextFunction, Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import { BaseRoute } from './base_router';

export class PaymentRoute extends BaseRoute {

    static create(router: Router) {
        log.info('[PaymentRoute::create] Creating payment routes.');

        const route = new PaymentRoute();

        router.post('/api/v1/payment/check', route.check);
        router.post('/api/v1/payment/avisto', route.aviso);

        router.get('/api/v1/payment/price/:months/:count', route.price);
        router.get('/api/v1/payment/groups/:months/:sum', route.groups);
    }

    async check(req: Request, res: Response, next: NextFunction) {
        const checkResult = await PaymentService.checkOrder(req.body);
        let result = '<checkOrderResponse ';
        Object.keys(checkResult).forEach((key) => {
            if (checkResult[key] instanceof Date) {
                checkResult[key] = checkResult[key].toISOString();
            }
            result += `${key}="${checkResult[key]}" `;
        });
        result += '/>';
        res.setHeader('Content-Type', 'application/xml');
        if (config.payment.demo) {
            Log.PAYMENT.debug(`Check order result: ${result}`);
        }
        res.send(result);
    }

    async aviso(req: Request, res: Response, next: NextFunction) {
        const avisoResult = await PaymentService.avisoOrder(req.body);
        let result = '<paymentAvisoResponse ';
        Object.keys(avisoResult).forEach((key) => {
            if (avisoResult[key] instanceof Date) {
                avisoResult[key] = avisoResult[key].toISOString();
            }
            result += `${key}="${avisoResult[key]}" `;
        });
        result += '/>';
        res.setHeader('Content-Type', 'application/xml');
        if (config.payment.demo) {
            Log.PAYMENT.debug(`Aviso order result: ${result}`);
        }
        res.send(result);
    }

    async price(req: Request, res: Response, next: NextFunction) {
        res.json({
            original_price: await PaymentService.getOriginalSumFromGroupsCount(
                parseInt(req.params.count, 10),
                parseInt(req.params.months, 10)
            ),
            price: await PaymentService.getSumFromGroupsCount(
                parseInt(req.params.count, 10),
                parseInt(req.params.months, 10)
            )
        });
    }

    async groups(req: Request, res: Response, next: NextFunction) {
        res.json({
            groups: await PaymentService.getGroupsCountFromSum(
                parseInt(req.params.sum, 10),
                parseInt(req.params.months, 10)
            )
        });
    }
}
