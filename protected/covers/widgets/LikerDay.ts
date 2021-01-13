'use strict';

import {Cover} from '@entity/Cover';
import {SocialGroup} from '@entity/SocialGroup';
import {IVKData, IWidgetWithImage, IWidgetWithNames, Widget} from '@widget/Widget';
import * as Canvas from 'canvas';
import * as fs from 'graceful-fs';
import * as moment from 'moment';
import * as path from 'path';

import { CanvasComponent } from '@component/canvas';

export class LikerDayWidget extends Widget {

    static async init(ctx: Canvas.Context2d, cover: Cover, widget: IWidgetLikerDay, preview: boolean) {
        const widget_instance = new LikerDayWidget(ctx, cover, widget, preview, {
            has_image: true,
            has_names: true
        });
        await widget_instance.generate();
        return widget_instance;
    }

    static async getData(widget: IWidgetLikerDay, group: SocialGroup): Promise<any> {
        return (await group.cache).data.likerDay;
    }

    widget: IWidgetLikerDay;

    async generate() {
        await super.generate();
        if (!this.widget.widget_data) {
            return;
        }

        if (this.widget.likesCountShow) {
            const icon_img = await CanvasComponent.getImage(path.join(__dirname, '..', 'imgs', 'icons', `like_vk_${this.widget.likerIconColor}.png`));
            CanvasComponent.drawImage(this.ctx, icon_img, {
                    x: this.widget.likesCountX,
                    y: this.widget.likesCountY
                }, {
                    width: 50,
                    height: 50
                });

            const reposts_font_size = 28;

            await this.writeText(this.widget.widget_data.likes_count.toString(), {
                x: this.widget.likesCountX + 55,
                y: this.widget.likesCountY + ((50 - reposts_font_size) / 2),
                show: this.widget.likesCountShow,
                size: reposts_font_size,
                color: '#fff',
                font: 'Arial',
                fontWeight: 'none',
                italic: false,
                uppercase: false,
            });
        }
    }

    scaleSettings() {
        super.scaleSettings();

        this.widget.likesCountX *= 2;
        this.widget.likesCountY *= 2;
    }

}

export interface IWidgetLikerDay extends IWidgetWithImage, IWidgetWithNames {
    minLikes: number;
    likesCountShow: boolean;
    likesCountX: number;
    likesCountY: number;

    likerIconColor: string;

    widget_data: IVKData;
}
