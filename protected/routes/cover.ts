'use strict';

import { CanvasComponent } from '@component/canvas';
import { Files } from '@component/files';
import log from '@component/logger';
import Queue from '@component/queue';
import config from '@config';
import { Cover } from '@entity/Cover';
import { SocialGroup } from '@entity/SocialGroup';
import { GroupRoute } from '@route/groups';
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

const upload = multer({
    dest: path.join(__dirname, '..', 'uploads')
});

export class CoverRoute extends BaseRoute {

    static create(router: Router) {
        log.info('[CoverRoute::create] Creating cover routes.');

        const cover_route = new CoverRoute();
        const group_route = new GroupRoute();

        router.post('/api/v1/group/:id/preview', Auth.checkAuth, group_route.checkGroupAuth, cover_route.getPreview);
        router.post('/api/v1/group/:id/cover', Auth.checkAuth, group_route.checkGroupAuth, cover_route.saveCover);
        router.get('/api/v1/group/:id/cover', Auth.checkAuth, group_route.checkGroupAuth, cover_route.getCover);

        router.get('/api/v1/random_cover', cover_route.getRandomPreview);

        router.post('/api/v1/group/:id/cover/background', Auth.checkAuth, group_route.checkGroupAuth, upload.single('file'), cover_route.setCoverBg);
        router.get('/api/v1/group/:id/cover/background', cover_route.getCoverBg);
    }

    constructor() {
        super();
    }

    async saveCover(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const groupRepository = getRepository(SocialGroup);

            let cover = await req.group.cover;
            if (!cover) {
                req.group = await GroupService.createCover(req.group, false);
            }

            cover = await req.group.cover;
            cover.settings = req.body;
            req.group.cover = Promise.resolve(cover);

            if (config.env === 'production') {
                await VK.setCallbackSettings(req.group);
            }
            req.group = await groupRepository.save(req.group);
            await Queue.sendMessage({
                group_id: req.group.id
            }, Queue.QUEUE_COVER_GENERATION);
            res.json({
                success: true
            });

        } catch (error) {
            log.error(error);
            next(error);
        }
    }

    async getCover(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const cover = await req.group.cover;
            if (!cover) {
                req.group = await GroupService.createCover(req.group);
            }

            res.json({
                success: true,
                data: (await req.group.cover).settings
            });

        } catch (error) {
            log.error(error);
            next(error);
        }
    }

    async setCoverBg(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const groupRepository = getRepository(SocialGroup);

            let cover = await req.group.cover;
            if (!cover) {
                req.group = await GroupService.createCover(req.group);
            }
            if (!req.file) {
                throw new Error(`There no file in request.`);
            }

            cover = await req.group.cover;
            if (cover.input_img !== '/protected/covers/default_cover.png'
                && cover.full_input_path
                && fs.existsSync(cover.full_input_path)) {

                fs.unlinkSync(cover.full_input_path);
            }
            const bg_filename = 'background' + path.extname(req.file.originalname);
            Files.mkDir(cover.pathes.DATA_DIR);
            Files.mkDir(cover.pathes.CURRENT_DIR);
            const bg_path = path.join(cover.pathes.CURRENT_DIR, bg_filename);

            const bgResizedData = await CanvasComponent.resizeImage(req.file.path, {
                height: 400,
                width: 1590
            });
            fs.writeFileSync(bg_path, bgResizedData);
            fs.unlinkSync(req.file.path);

            Files.rmDir(cover.pathes.TMP_DIR);

            cover.input_img = `/protected/covers/data/${cover.id}/${bg_filename}`;
            req.group.cover = Promise.resolve(cover);

            req.group = await groupRepository.save(req.group);
            res.json({
                success: true
            });

        } catch (error) {
            log.error(error);
            next(error);
        }
    }

    async getCoverBg(req: RequestWithUser, res: Response, next: NextFunction) {
        const bg = path.join(__dirname, '..', 'covers', 'default_cover.png');
        try {
            const groupRepository = getRepository(SocialGroup);

            const group = await groupRepository.findOneById(req.params.id);

            if (!group) {
                throw new Error('Group not found.');
            }

            const cover = await group.cover;
            if (!cover
                || !cover.full_input_path
                || !fs.existsSync(cover.full_input_path)) {

                log.warn('Can`t find bg file.');
                return res.sendFile(bg);
            }

            res.sendFile(cover.full_input_path);

        } catch (error) {
            log.error(error);
            res.sendFile(bg);
        }
    }

    async getPreview(req: RequestWithUser, res: Response, next: NextFunction) {
        const bg = path.join(__dirname, '..', 'covers', 'default_cover.png');
        try {
            const groupRepository = getRepository(SocialGroup);

            const group = await groupRepository.findOneById(req.params.id);

            if (!group) {
                throw new Error('Group not found.');
            }

            const cover = await group.cover;
            if (!cover
                || !req.body) {

                throw new Error('Something went wrong.');
            }

            cover.settings = req.body;

            if (['ok', 'exists'].includes(await CoverService.generate(cover, true))) {
                fs.readFile(path.join(cover.pathes.CURRENT_DIR, 'preview.png'), (err, data) => {
                    const b = new Buffer(data);
                    const s = b.toString('base64');
                    res.send(s);
                });
            } else {
                res.sendStatus(403);
            }

        } catch (error) {
            log.error(error);
            res.sendStatus(403);
        }
    }

    async getRandomPreview(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const coverRepository = getRepository(Cover);
            const cover = await coverRepository.createQueryBuilder('cover')
                .leftJoinAndSelect('cover.group', 'group')
                .where('NOT cover.output_img IS NULL')
                .andWhere('group.connected = :connected', {
                    connected: true
                })
                .orderBy('RAND()')
                .getOne();
            if (cover && cover.full_output_path && fs.existsSync(cover.full_output_path)) {
                res.sendFile(cover.full_output_path);
            } else {
                log.error(`Error getting random cover from cover ${cover.id}`);
                res.sendStatus(403);
            }
        } catch (error) {
            log.error(error);
            res.sendStatus(403);
        }
    }
}
