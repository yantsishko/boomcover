'use strict';

import log from '@component/logger';
import { Cover } from '@entity/Cover';
import { SocialGroup } from '@entity/SocialGroup';
import { VK, VKStats } from '@service/vk';
import { IWidget, Widget } from '@widget/Widget';
import * as Canvas from 'canvas';
import * as fs from 'graceful-fs';
import * as moment from 'moment';
import * as path from 'path';

export class StatisticsWidget extends Widget {

    static async init(ctx: Canvas.Context2d, cover: Cover, widget: IWidgetStatistics, preview: boolean) {
        const widget_instance = new StatisticsWidget(ctx, cover, widget, preview);
        await widget_instance.generate();
        return widget_instance;
    }

    static async getData(widget: IWidgetStatistics, group: SocialGroup) {
        return await VK.getGroupStats(group);
    }

    widget: IWidgetStatistics;

    async generate() {
        let statsValue = null;
        switch (this.widget.type) {
            case 'subscribers_count':
                statsValue = this.widget.widget_data.members;
                break;
            case 'subscribers_count_today':
                statsValue = this.widget.widget_data.subscribed;
                break;
            case 'unique_visitors_today':
                statsValue = this.widget.widget_data.visitors;
                break;
            case 'visitors_today':
                statsValue = this.widget.widget_data.views;
                break;
        }
        if (statsValue === null) {
            return;
        }
        let text = statsValue.toString();
        if (this.widget.text) {
            text = this.widget.text + ' ' + text;
        }
        await this.writeText(text, {
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

export interface IWidgetStatistics extends IWidget {
    size: number;
    uppercase: boolean;
    fontWeight: string;
    italic: boolean;
    font: string;
    color: string;
    text: string;
    textX: number;
    textY: number;
    type: 'subscribers_count' | 'unique_visitors_today' | 'visitors_today' | 'subscribers_count_today';
    widget_data: VKStats;
}
