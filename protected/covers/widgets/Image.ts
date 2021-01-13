'use strict';

import cache from '@component/cache';
import { CanvasComponent } from '@component/canvas';
import { Files } from '@component/files';
import {Cover} from '@entity/Cover';
import { SocialGroup } from '@entity/SocialGroup';
import { UserFile } from '@entity/UserFile';
import {IWidget, Widget} from '@widget/Widget';
import * as Canvas from 'canvas';
import * as fs from 'graceful-fs';
import { readFileSync } from 'graceful-fs';
import * as moment from 'moment';
import * as path from 'path';
import { join } from 'path';
import { getRepository } from 'typeorm';

export class ImageWidget extends Widget {

    static async init(ctx: Canvas.Context2d, cover: Cover, widget: IWidgetImage, preview: boolean) {
        const widget_instance = new ImageWidget(ctx, cover, widget, preview);
        await widget_instance.generate();
        return widget_instance;
    }

    static async getData(widget: IWidgetImage, group: SocialGroup) {
        if (widget.file_name) {
            const file = await getRepository(UserFile).findOne({
                name: widget.file_name
            });
            if (file) {
                return {
                    image_data: readFileSync(file.FILE_PATH)
                };
            }
        } else if (widget.file_url) {
            const cache_key: string = cache.createKeyFromString(widget.file_url);
            let value: {extension: string, data: Buffer} = cache.get(cache_key);
            if (value === undefined) {
                value = await Files.getImageWithExtFromUrl(widget.file_url);
                cache.set(cache_key, value, 60);
            }
            return {
                image_data: value.data
            };
        } else if (widget.predifined_file) {
            return {
                image_data: readFileSync(join(__dirname, '..', 'imgs', 'img', `${widget.predifined_file}.png`))
            };
        }
    }

    widget: IWidgetImage;

    async generate() {
        if (!this.widget.widget_data || !this.widget.widget_data.image_data) {
            return;
        }
        const image = await CanvasComponent.getImage(this.widget.widget_data.image_data);
        const ratio = image.height / this.widget.size;
        await CanvasComponent.drawImage(
            this.ctx,
            image,
            {
                x: this.widget.imageX,
                y: this.widget.imageY
            },
            {
                width: image.width / ratio,
                height: this.widget.size
            }
        );
    }

    scaleSettings() {
        this.widget.size *= 2;
        this.widget.imageX *= 2;
        this.widget.imageY *= 2;
    }

}

export interface IWidgetImage extends IWidget {
    size: number;
    imageX: number;
    imageY: number;

    file_name?: string;
    file_url?: string;
    predifined_file?: string;

    widget_data: {
        image_data?: Buffer;
    };
}
