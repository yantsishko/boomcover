'use strict';

import * as fs from 'graceful-fs';
import * as mime from 'mime';
import * as path from 'path';
import { get } from 'request';

export class Files {
    static rm(itemPath: string) {
        if (fs.existsSync(itemPath)) {
            if (fs.lstatSync(itemPath).isDirectory()) {
                Files.rmDir(itemPath);
            } else {
                fs.unlinkSync(itemPath);
            }
        }
    }

    static rmDir(dir_path: string) {
        if (fs.existsSync(dir_path)) {
            fs.readdirSync(dir_path).forEach((file, index) => {
                const curPath = path.join(dir_path, file);
                if (fs.lstatSync(curPath).isDirectory()) {
                    Files.rmDir(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(dir_path);
        }
    }

    static mkDir(dir_path: string) {
        if (!fs.existsSync(dir_path)) {
            this.mkDir(path.join(dir_path, '..'));
            fs.mkdirSync(dir_path);
        }
    }

    static async getImageBufferFromUrl(img_url: string) {
        return new Promise<Buffer>((resolve, reject) => {
            get(img_url)
                .on('response', (res) => {
                    const chunks = [];
                    res.on('data', (data) => {
                        chunks.push(data);
                    });
                    res.on('end', () => {
                        resolve(Buffer.concat(chunks));
                    });
                })
                .on('error', (err) => {
                    reject(err);
                });
        });
    }

    static async getImageWithExtFromUrl(img_url: string) {
        return new Promise<{extension: string, data: Buffer}>((resolve, reject) => {
            get(img_url)
                .on('response', (res) => {
                    const chunks = [];
                    res.on('data', (data) => {
                        chunks.push(data);
                    });
                    res.on('end', () => {
                        resolve({
                            extension: mime.getExtension(res.headers['content-type']),
                            data: Buffer.concat(chunks)
                        });
                    });
                })
                .on('error', (err) => {
                    reject(err);
                });
        });
    }
}
