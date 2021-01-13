'use strict';

import log from '@component/logger';
import { SocialGroup } from '@entity/SocialGroup';
import { User } from '@entity/User';
import { UserService } from '@service/user';
import { VK } from '@service/vk';
import { NextFunction, Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import { Auth, RequestWithUser } from './auth';
import { BaseRoute } from './base_router';

export class MainRoute extends BaseRoute {

    static create(router: Router) {
        log.info('[MainRoute::create] Creating main routes.');

        const route = new MainRoute();

        router.get('/partner/:code', route.partner);
        router.get('/ref/:promocode', route.referal);

        router.get('/login', route.login);
        router.get('/logout', Auth.checkAuth, route.logout);

        router.get('/vk/verify', route.verifyVk);

        router.get('/api/v1/referral/stats', Auth.checkAuth, route.referalStats);
        router.get('/api/v1/current_user', Auth.checkAuth, route.currentUser);
        router.get('/api/v1/statistic', route.statistic);
        router.get('/api/v1/statistic/users', route.statisticUsers);
        router.get('/api/v1/statistic/groups', route.statisticGroups);
    }

    constructor() {
        super();
    }

    async currentUser(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            return res.json(await req.user.toObject());
        } catch (err) {
            res.send(401);
        }
    }

    async statistic(req: Request, res: Response, next: NextFunction) {
        try {
            const usersCount = await getRepository(User).count();
            const groupsCount = await getRepository(SocialGroup)
                .count({
                    where: {
                        connected: true
                    }
                });

            res.json({
                usersCount,
                groupsCount
            });
        } catch (err) {
            log.error(err);
            res.sendStatus(500);
        }
    }

    async statisticUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const usersCount = await getRepository(User).count();
            res.send(usersCount.toString());
        } catch (err) {
            log.error(err);
            res.sendStatus(500);
        }
    }

    async statisticGroups(req: Request, res: Response, next: NextFunction) {
        try {
            const groupsCount = await getRepository(SocialGroup)
                .count({
                    where: {
                        connected: true
                    }
                });

            res.send(groupsCount.toString());
        } catch (err) {
            log.error(err);
            res.sendStatus(500);
        }
    }

    login(req: Request, res: Response, next: NextFunction) {
        res.redirect(VK.getLoginUri());
    }

    partner(req: Request, res: Response, next: NextFunction) {
        res.redirect(VK.getLoginUri({
            type: 'partner',
            code: req.param('code', '')
        }));
    }

    referal(req: Request, res: Response, next: NextFunction) {
        res.redirect(VK.getLoginUri({
            type: 'referral',
            promocode: req.param('promocode', '')
        }));
    }

    async referalStats(req: RequestWithUser, res: Response, next: NextFunction) {
        res.json(await req.user.getReferralStats());
    }

    async logout(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            await UserService.logout(req.user);
            res.json({
                success: true
            });
        } catch (error) {
            log.error(error);
            res.send({
                success: false,
                message: error.message
            });
        }
    }

    async verifyVk(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.query.code) {
                const vk_response = await VK.getAccessToken(req.query.code);
                if (vk_response.access_token) {
                    try {
                        const token = await UserService.authorizeUser(
                            vk_response.access_token,
                            vk_response.user_id,
                            vk_response.email,
                            JSON.parse(req.query.state)
                        );
                        res.render('verify', {
                            token
                        });
                    } catch (error) {
                        log.error(error);
                        BaseRoute.renderError(res, 'Something went wrong');
                    }
                } else {
                    BaseRoute.renderError(res, vk_response.error_description);
                }
            } else if (req.query.error && req.query.error === 'access_denied') {
                BaseRoute.renderError(res, req.query.error_description);
            } else {
                BaseRoute.renderError(res, 'There no code in GET params');
            }
        } catch (error) {
            log.error(error);
            BaseRoute.renderError(res, 'Something went wrong');
        }
    }
}
