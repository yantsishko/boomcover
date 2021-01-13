'use strict';

import log from '@component/logger';
import config from '@config';
import {SocialGroup} from '@entity/SocialGroup';
import {User} from '@entity/User';
import { NextFunction, Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';

export interface RequestWithUser extends Request {
    user?: User;
    group?: SocialGroup;
}

export class Auth {

    static async checkAuth(req: RequestWithUser, res: Response, next: NextFunction) {
        try {

            const token = (req.get('Authorization') || '').replace('Bearer ', '') ;
            if (!token && !config.isTest) {
                res.sendStatus(401);
                return;
            }

            const userRepository = getRepository(User);

            let userQueryBuilder = userRepository
                .createQueryBuilder('user');

            if (!(config.env === 'development' && token === 'testusertoken') && !config.isTest) {
                userQueryBuilder = userQueryBuilder.where('user.token = :token', {token});
            }

            const user = await userQueryBuilder
                .leftJoinAndSelect('user.social_groups', 'social_groups')
                .leftJoinAndSelect('user.subscriptions', 'subscriptions')
                .leftJoinAndSelect('user.payments', 'payments')
                .getOne();

            if (!user) {
                res.sendStatus(401);
            } else {
                req.user = user;
                next();
            }
        } catch (error) {
            log.error(error);
            next(error);
        }
    }
}
