'use strict';

import {Cover} from '@entity/Cover';
import { SocialGroup } from '@entity/SocialGroup';
import {IWidget, Widget} from '@widget/Widget';
import * as Canvas from 'canvas';
import * as fs from 'graceful-fs';
import * as moment from 'moment';
import * as path from 'path';

export class TextWidget extends Widget {

    static async init(ctx: Canvas.Context2d, cover: Cover, widget: IWidgetText, preview: boolean) {
        const widget_instance = new TextWidget(ctx, cover, widget, preview);
        await widget_instance.generate();
        return widget_instance;
    }

    static async getData(widget: IWidgetText, group: SocialGroup) {
        if (widget.showTextTime) {
            const start_date = moment(widget.textStart, 'YYYY-MM-DD HH:mm');
            const end_date = moment(widget.textEnd, 'YYYY-MM-DD HH:mm');
            const now = moment().utcOffset(widget.gmt);
            if (now.diff(start_date) < 0 || now.diff(end_date) > 0) {
                return {
                    needShowText: false
                };
            }
        }
        return {
            needShowText: true
        };
    }

    widget: IWidgetText;

    async generate() {
        if (!this.widget.widget_data.needShowText && !this.preview) {
            return;
        }
        await this.writeText(this.widget.text, {
            x: this.widget.textX,
            y: this.widget.textY,
            show: this.widget.isShown,
            size: this.widget.size,
            color: this.widget.color,
            font: this.widget.font,
            fontWeight: this.widget.fontWeight,
            italic: this.widget.italic,
            uppercase: this.widget.uppercase,
        });
    }

    scaleSettings() {
        this.widget.size *= 2;
        this.widget.textX *= 2;
        this.widget.textY *= 2;
    }

}

export interface IWidgetText extends IWidget {
    size: number;
    uppercase: boolean;
    fontWeight: string;
    italic: boolean;
    font: string;
    color: string;
    text: string;
    textX: number;
    textY: number;

    showTextTime: boolean;
    textStart: string;
    textEnd: string;
    gmt: string;

    widget_data: {
        needShowText: boolean;
    };
}
