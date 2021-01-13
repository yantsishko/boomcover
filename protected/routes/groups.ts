'use strict';

import { CanvasComponent } from '@component/canvas';
import { Files } from '@component/files';
import log from '@component/logger';
import Queue from '@component/queue';
import config from '@config';
import { Cover } from '@entity/Cover';
import { SocialGroup } from '@entity/SocialGroup';
import { CoverService } from '@service/cover';
import { GroupService } from '@service/group';
import { UserService } from '@service/user';
import { IVKCommentFromCallback, VK } from '@service/vk';
import { NextFunction, Request, Response, Router } from 'express';
import * as fs from 'graceful-fs';
import * as multer from 'multer';
import * as path from 'path';
import { getRepository } from 'typeorm';
import { Auth, RequestWithUser } from './auth';
import { BaseRoute } from './base_router';

export class GroupRoute extends BaseRoute {

    static create(router: Router) {
        log.info('[GroupRoute::create] Creating group routes.');

        const group_route = new GroupRoute();

        router.get('/api/v1/groups', Auth.checkAuth, group_route.getUserGroups);
        router.get('/api/v1/group/authorize/:id', Auth.checkAuth, group_route.checkGroupAuth, group_route.authorize);

        router.get('/api/v1/group/:id', Auth.checkAuth, group_route.checkGroupAuth, group_route.getGroup);
        router.post('/api/v1/group/:id/unconnect', Auth.checkAuth, group_route.checkGroupAuth, group_route.unconnectGroup);

        router.get('/vk/group_verify', group_route.vk_group_verify);
        router.post('/vk/group_callback/:id', group_route.vk_group_callback);
    }

    constructor() {
        super();
    }

    async checkGroupAuth(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            let has_group = false;
            for (const social_group of await req.user.social_groups) {
                if (social_group.id.toString() === req.params.id.toString()) {
                    has_group = true;
                    break;
                }
            }
            if (!has_group) {
                res.sendStatus(403);
                return;
            }

            const groupRepository = getRepository(SocialGroup);
            const group = await groupRepository.findOneById(req.params.id);
            if (!group) {
                throw new Error(`Group with id ${req.params.id} not found.`);
            }
            req.group = group;
            next();
        } catch (error) {
            log.error(error);
            next(error);
        }
    }

    async authorize(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            if (await req.group.user.availableActiveGroupsCount() <= await req.group.user.connectedGroupsCount()) {
                res.status(403);
                res.send('У Вас подключено максимальное количество групп для данного тарифа.');
                return;
            }
            req.group = await GroupService.checkSameGroup(req.group);
            if (!req.group.access_token) {
                res.send(VK.getGroupLoginUrl(req.group));
            } else {
                req.group = await GroupService.setGroupConnected(req.group);
                res.send(`/constructor/${req.group.id}`);
            }
        } catch (error) {
            log.error(error);
            next(error);
        }
    }

    async getUserGroups(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            req.user = await UserService.updateGroups(req.user, await VK.getUserGroups(req.user.vk_token));
            res.json((await req.user.social_groups).map((social_group) => social_group.toObject()));
        } catch (error) {
            log.error(error);
            next(error);
        }
    }

    async getGroup(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            res.json({
                success: true,
                data: req.group.toObject()
            });

        } catch (error) {
            log.error(error);
            next(error);
        }
    }

    async unconnectGroup(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            req.group = await GroupService.unconnectGroup(req.group);

            res.json({
                success: true,
                data: req.group.toObject()
            });

        } catch (error) {
            log.error(error);
            next(error);
        }
    }

    async vk_group_callback(req: RequestWithUser, res: Response, next: NextFunction) {
        // log.debug('VK callback message: ', req.body);
        try {
            const groupRepository = getRepository(SocialGroup);

            const group = await groupRepository.findOne({
                where: {
                    social_id: req.body.group_id
                },
                order: {
                    connected: 'DESC'
                }
            });
            if (!group) {
                log.warn(`Group with social id ${req.body.group_id} not found.`);
                res.statusCode = 500;
                res.send('Group not found');
                return;
            }
            if (req.body.type === 'confirmation') {
                const vk_response = await VK.confirmCallbackUrl(group);
                res.send(vk_response.code);
                return;
            }
            const cover = await group.cover;
            if (!group.connected) {
                log.debug(`Group with social id ${req.body.group_id} not connected.`);
                res.send('ok');
                return;
            }
            if (!await group.cover) {
                log.debug(`Group with social id ${req.body.group_id} has no cover.`);
                res.send('ok');
                return;
            }
            switch (req.body.type) {
                case 'group_join':
                case 'group_leave':
                    await Queue.sendMessage({
                        group_id: group.id
                    }, Queue.QUEUE_COVER_GENERATION);
                    break;
                case 'wall_reply_new':
                    const data: IVKCommentFromCallback = req.body.object;
                    if (data.from_id > 0 && !group.is_closed) {
                        await Queue.sendMessage({
                            group_id: group.id,
                            callback_data: data
                        }, Queue.QUEUE_COMMENT_CREATE);
                    }
                    break;
                case 'wall_repost':
                    const repost_data: IVKCommentFromCallback = req.body.object;
                    if (repost_data.from_id > 0 && (cover.hasWidget('reposterDay') || cover.hasWidget('reposterLast'))) {
                        await Queue.sendMessage({
                            group_id: group.id,
                            callback_data: repost_data
                        }, Queue.QUEUE_REPOST_CREATE);
                    }
                    break;
                default:
                    log.debug(req.body);
            }
            res.send('ok');
        } catch (error) {
            log.error(error);
            res.statusCode = 500;
            res.send('Error');
        }
    }

    async vk_group_verify(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            if (req.query.code) {
                const state = req.query.state ? JSON.parse(req.query.state) : {};
                const vk_response = await VK.getGroupAccessToken(req.query.code);
                if (vk_response[`access_token_${state.social_id}`]) {
                    const group = await GroupService.connectGroup(
                        vk_response[`access_token_${state.social_id}`],
                        state.group_id,
                        vk_response.expires_in
                    );
                    try {
                        res.redirect(`/constructor/${group.id}`);
                    } catch (error) {
                        log.error(error);
                        BaseRoute.renderError(res, 'Something went wrong');
                    }
                } else if (vk_response[`access_token_${state.social_id}`] === false) {
                    BaseRoute.renderError(res, 'Ошибка при получении токена. Попробуйте еще раз. Периодически возникает при подключении только что созданных групп.');
                } else {
                    log.error('Error from vk: ', vk_response);
                    BaseRoute.renderError(res, vk_response.error_description);
                }
            } else if (req.query.error && req.query.error === 'access_denied') {
                res.redirect('/');
            } else {
                BaseRoute.renderError(res, 'There no code in GET params');
            }
        } catch (error) {
            log.error(error);
            BaseRoute.renderError(res, 'Something went wrong');
        }
    }
}
