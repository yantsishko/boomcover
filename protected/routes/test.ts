'use strict';

import log from '@component/logger';
import { SocialGroup } from '@entity/SocialGroup';
import { CoverService } from '@service/cover';
import { UserService } from '@service/user';
import { VK } from '@service/vk';
import { NextFunction, Request, Response, Router } from 'express';
import * as moment from 'moment';
import { getConnection, getManager, getRepository } from 'typeorm';
import { Auth, RequestWithUser } from './auth';
import { BaseRoute } from './base_router';

import Queue from '@component/queue';

export class TestRoute extends BaseRoute {

    static create(router: Router) {
        log.info('[TestRoute::create] Creating test routes.');

        const test_route = new TestRoute();

        router.get('/test', test_route.test);
        router.get('/test/syncSchema', test_route.syncSchema);
        router.get('/test/generateCover/:group_id', Auth.checkAuth, test_route.generateCover);
        router.get('/test/generateCoverPreview/:group_id', Auth.checkAuth, test_route.generateCoverPreview);
        router.get('/test/generateAndUploadCover/:group_id', Auth.checkAuth, test_route.generateAndUploadCover);
        router.get('/test/checkReposterWidget/:group_id', Auth.checkAuth, test_route.checkReposterWidget);
    }

    constructor() {
        super();
    }

    async test(req: Request, res: Response, next: NextFunction) {
        res.send('Text to check UrlText');
    }

    async syncSchema(req: Request, res: Response, next: NextFunction) {
        try {
            await getConnection().synchronize();
            res.json({
                success: true
            });
        } catch (error) {
            res.json(error);
        }
    }

     async generateCover(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const groupRepository = getRepository(SocialGroup);

            const group = await groupRepository.findOneById(req.params.group_id);
            if (!group) {
                throw new Error(`Group with id ${req.params.group_id} not found.`);
            }

            const cover = await group.cover;
            if (!cover) {
                throw new Error(`Group with id ${req.params.group_id} hasn't got cover.`);
            }

            res.json({
                success: await CoverService.generate(cover) === 'ok'
            });

        } catch (error) {
            log.error(error);
            next(error);
        }
     }

     async generateCoverPreview(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const groupRepository = getRepository(SocialGroup);

            const group = await groupRepository.findOneById(req.params.group_id);
            if (!group) {
                throw new Error(`Group with id ${req.params.group_id} not found.`);
            }

            const cover = await group.cover;
            if (!cover) {
                throw new Error(`Group with id ${req.params.group_id} hasn't got cover.`);
            }

            res.json({
                success: await CoverService.generate(cover, true) === 'ok'
            });

        } catch (error) {
            log.error(error);
            next(error);
        }
     }

     async generateAndUploadCover(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const groupRepository = getRepository(SocialGroup);

            const group = await groupRepository.findOneById(req.params.group_id);
            if (!group) {
                throw new Error(`Group with id ${req.params.group_id} not found.`);
            }

            const cover = await group.cover;
            if (!cover) {
                throw new Error(`Group with id ${req.params.group_id} hasn't got cover.`);
            }

            res.json({
                success: await CoverService.generateAndUploadCover(cover)
            });

        } catch (error) {
            log.error(error);
            next(error);
        }
     }

     async checkReposterWidget(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const groupRepository = getRepository(SocialGroup);

            const group = await groupRepository.findOneById(req.params.group_id);
            if (!group) {
                throw new Error(`Group with id ${req.params.id} not found.`);
            }
            const cover = await group.cover;

            res.send(cover.hasWidget('reposterDay'));
        } catch (error) {
            log.error(error);
            next(error);
        }
     }
}
