'use strict';
import { CanvasComponent } from '@component/canvas';
import { Files } from '@component/files';
import log from '@component/logger';
import Queue from '@component/queue';
import config from '@config';
import { Cover } from '@entity/Cover';
import { SocialGroup } from '@entity/SocialGroup';
import { UserFile } from '@entity/UserFile';
import { GroupRoute } from '@route/groups';
import { CoverService } from '@service/cover';
import { GroupService } from '@service/group';
import { UserService } from '@service/user';
import { IVKCommentFromCallback, VK } from '@service/vk';
import sha256 = require('crypto-js/sha256');
import { NextFunction, Request, Response, Router } from 'express';
import * as fs from 'graceful-fs';
import { readFileSync } from 'graceful-fs';
import * as multer from 'multer';
import * as path from 'path';
import { getRepository } from 'typeorm';
import { Auth, RequestWithUser } from './auth';
import { BaseRoute } from './base_router';

const upload = multer({
    dest: path.join(__dirname, '..', 'uploads')
});

export class FileRoute extends BaseRoute {

    static create(router: Router) {
        log.info('[FileRoute::create] Creating file routes.');

        const file_route = new FileRoute();

        router.get('/api/v1/file/list', Auth.checkAuth, file_route.getFileList);
        router.post('/api/v1/file', Auth.checkAuth, upload.single('file'), file_route.setFile);
        router.get('/api/v1/file/:name', file_route.getFile);
        router.delete('/api/v1/file/:name', Auth.checkAuth, file_route.deleteFile);
    }

    constructor() {
        super();
    }

    async getFileList(req: RequestWithUser, res: Response, next: NextFunction) {
        const fileRepository = getRepository(UserFile);
        const files = await fileRepository.find({
            where: {
                userId: req.user.id
            }
        });
        res.json({
            success: true,
            data: files.map((file) => file.name)
        });
    }

    async setFile(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            if (!req.file) {
                throw new Error(`There no file in request.`);
            }
            const fileBuffer = readFileSync(req.file.path);
            const fileName = sha256(fileBuffer.toString()).toString();

            let file = await getRepository(UserFile).findOne({
                where: {
                    name: fileName,
                    userId: req.user.id
                }
            });
            if (!file) {
                file = new UserFile();
            }
            file.user = Promise.resolve(req.user);
            file.name = fileName;
            file.original_name = req.file.originalname;
            file.mimetype = req.file.mimetype;
            file.size = req.file.size;
            Files.mkDir(file.DIR_PATH);

            fs.writeFileSync(file.FILE_PATH, fileBuffer);
            fs.unlinkSync(req.file.path);

            await getRepository(UserFile).save(file);
            res.json({
                success: true,
                data: {
                    name: file.name
                }
            });

        } catch (error) {
            log.error(error);
            next(error);
        }
    }

    async getFile(req: Request, res: Response, next: NextFunction) {
        const fileRepository = getRepository(UserFile);
        const file = await fileRepository.findOne({
            where: {
                name: req.params.name
            }
        });
        if (file) {
            res.sendFile(file.FILE_PATH);
        } else {
            res.sendStatus(404);
        }
    }

    async deleteFile(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const fileRepository = getRepository(UserFile);
            const file = await fileRepository.findOne({
                where: {
                    userId: req.user.id,
                    name: req.params.name
                }
            });
            Files.rm(file.FILE_PATH);
            await fileRepository.deleteById(file.id);
            res.json({
                success: true
            });
        } catch (err) {
            next(err);
        }
    }
}
