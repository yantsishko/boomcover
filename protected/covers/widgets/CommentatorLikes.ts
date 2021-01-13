'use strict';

import { CanvasComponent } from '@component/canvas';
import { Cover } from '@entity/Cover';
import { SocialGroup } from '@entity/SocialGroup';
import { IVKData, IWidgetWithImage, IWidgetWithNames, Widget } from '@widget/Widget';
import * as Canvas from 'canvas';
import * as fs from 'graceful-fs';
import * as moment from 'moment';
import * as path from 'path';

export class CommentatorLikesWidget extends Widget {

    static async init(ctx: Canvas.Context2d, cover: Cover, widget: IWidgetCommentatorLikes, preview: boolean) {
        const widget_instance = new CommentatorLikesWidget(ctx, cover, widget, preview, {
            has_image: true,
            has_names: true
        });
        await widget_instance.generate();
        return widget_instance;
    }

    static async getData(widget: IWidgetCommentatorLikes, group: SocialGroup): Promise<any> {
        return (await group.cache).data.commentatorLikes;
    }

    widget: IWidgetCommentatorLikes;

    async generate() {
        await super.generate();
        if (!this.widget.widget_data) {
            return;
        }

        const icon_img = await CanvasComponent.getImage(path.join(__dirname, '..', 'imgs', 'icons', `like_vk_${this.widget.likeColor}.png`));
        CanvasComponent.drawImage(this.ctx, icon_img, {
                x: this.widget.likeX,
                y: this.widget.likeY
            }, {
                width: 50,
                height: 50
            });

        const like_font_size = 28;

        await this.writeText(this.widget.widget_data.likes.toString(), {
            x: this.widget.likeX + 55,
            y: this.widget.likeY + ((50 - like_font_size) / 2),
            show: true,
            size: like_font_size,
            color: '#fff',
            font: 'Arial',
            fontWeight: 'none',
            italic: false,
            uppercase: false,
        });
    }

    scaleSettings() {
        super.scaleSettings();

        this.widget.likeX *= 2;
        this.widget.likeY *= 2;
    }

}

export interface IWidgetCommentatorLikes extends IWidgetWithImage, IWidgetWithNames {
    likeX: number;
    likeY: number;
    minLikes: number;
    likeColor: string;

    widget_data: IVKData;
}
