'use strict';

import { RequestHelper } from '@component/request';
import config from '@config';
import { Cover } from '@entity/Cover';
import { SocialGroup } from '@entity/SocialGroup';
import { IWidget, Widget } from '@widget/Widget';
import * as Canvas from 'canvas';
import * as fs from 'graceful-fs';
import * as moment from 'moment';
import * as path from 'path';

export class UrlTextWidget extends Widget {

    static async init(ctx: Canvas.Context2d, cover: Cover, widget: IWidgetUrlText, preview: boolean) {
        const widget_instance = new UrlTextWidget(ctx, cover, widget, preview);
        await widget_instance.generate();
        return widget_instance;
    }

    static async getData(widget: IWidgetUrlText, group: SocialGroup) {
        if (config.isTest) {
            return {
                text: 'Text to check UrlText'
            };
        }
        return {
            text: await RequestHelper.get(widget.url, 60)
        };
    }

    widget: IWidgetUrlText;

    async generate() {
        if (!this.widget.widget_data || !this.widget.widget_data.text) {
            return;
        }
        if (this.widget.showUrlTextTime && !this.preview) {
            const start_date = moment(this.widget.textStart, 'YYYY-MM-DD HH:mm');
            const end_date = moment(this.widget.textEnd, 'YYYY-MM-DD HH:mm');
            const now = moment().utcOffset(this.widget.gmt);
            if (now.diff(start_date) < 0 || now.diff(end_date) > 0) {
                return;
            }
        }
        await this.writeText(this.widget.widget_data.text, {
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

export interface IWidgetUrlText extends IWidget {
    size: number;
    uppercase: boolean;
    fontWeight: string;
    italic: boolean;
    font: string;
    color: string;
    url: string;
    textX: number;
    textY: number;

    showUrlTextTime: boolean;
    textStart: string;
    textEnd: string;
    gmt: string;

    widget_data: {
        text: string
    };
}
