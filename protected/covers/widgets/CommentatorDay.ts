'use strict';

import { CanvasComponent } from '@component/canvas';
import { Cover } from '@entity/Cover';
import { SocialGroup } from '@entity/SocialGroup';
import { IVKData, IWidgetWithImage, IWidgetWithNames, Widget } from '@widget/Widget';
import * as Canvas from 'canvas';
import * as fs from 'graceful-fs';
import * as moment from 'moment';
import * as path from 'path';

export class CommentatorDayWidget extends Widget {

    static async init(ctx: Canvas.Context2d, cover: Cover, widget: IWidgetCommentatorDay, preview: boolean) {
        const widget_instance = new CommentatorDayWidget(ctx, cover, widget, preview, {
            has_image: true,
            has_names: true
        });
        await widget_instance.generate();
        return widget_instance;
    }

    static async getData(widget: IWidgetCommentatorDay, group: SocialGroup): Promise<any> {
        return (await group.cache).data.commentatorDay;
    }

    widget: IWidgetCommentatorDay;

    async generate() {
        await super.generate();
        if (!this.widget.widget_data) {
            return;
        }

        if (this.widget.commentCountShow) {
            const icon_img = await CanvasComponent.getImage(path.join(__dirname, '..', 'imgs', 'icons', `message_icon_${this.widget.commentIconColor}.png`));
            CanvasComponent.drawImage(this.ctx, icon_img, {
                    x: this.widget.CommentCountX,
                    y: this.widget.CommentCountY
                }, {
                    width: 50,
                    height: 50
                });

            const comments_font_size = 28;

            await this.writeText(this.widget.widget_data.comments_count.toString(), {
                x: this.widget.CommentCountX + 55,
                y: this.widget.CommentCountY + ((50 - comments_font_size) / 2),
                show: this.widget.commentCountShow,
                size: comments_font_size,
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

        this.widget.CommentCountX *= 2;
        this.widget.CommentCountY *= 2;
    }

}

export interface IWidgetCommentatorDay extends IWidgetWithImage, IWidgetWithNames {
    commentCountShow: boolean;
    CommentCountX: number;
    CommentCountY: number;

    commentIconColor: string;

    widget_data: IVKData;
}
