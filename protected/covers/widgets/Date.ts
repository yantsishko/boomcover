'use strict';

import {Cover} from '@entity/Cover';
import { SocialGroup } from '@entity/SocialGroup';
import {IWidget, Widget} from '@widget/Widget';
import * as Canvas from 'canvas';
import * as moment from 'moment';
import 'moment/locale/ru';

export class DateWidget extends Widget {

    static async init(ctx: Canvas.Context2d, cover: Cover, widget: IWidgetDate, preview: boolean) {
        const widget_instance = new DateWidget(ctx, cover, widget, preview);
        await widget_instance.generate();
        return widget_instance;
    }

    static async getData(widget: IWidgetDate, group: SocialGroup) {
        moment.locale('ru');
        return {
            date: moment()
                .utcOffset(parseInt(widget.gmt, 10) * 60)
                .format(widget.format)
        };
    }

    widget: IWidgetDate;

    async generate() {
        const text = `${this.widget.textBefore} ${this.widget.widget_data.date} ${this.widget.textAfter}`.trim();
        await this.writeText(text, {
            x: this.widget.dateX,
            y: this.widget.dateY,
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
        this.widget.dateX *= 2;
        this.widget.dateY *= 2;
    }

}

export interface IWidgetDate extends IWidget {
    size: number;
    uppercase: boolean;
    fontWeight: string;
    italic: boolean;
    font: string;
    color: string;
    textBefore: string;
    textAfter: string;
    gmt: string;
    format: string;
    isShown: boolean;
    dateX: number;
    dateY: number;

    widget_data: {
        date: string
    };
}
