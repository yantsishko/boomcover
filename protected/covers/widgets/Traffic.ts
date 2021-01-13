'use strict';

import { CanvasComponent } from '@component/canvas';
import log from '@component/logger';
import config from '@config';
import { Cover } from '@entity/Cover';
import { SocialGroup } from '@entity/SocialGroup';
import { ITrafficData, TrafficService } from '@service/traffic';
import { IWidget, Widget } from '@widget/Widget';
import * as Canvas from 'canvas';
import * as fs from 'graceful-fs';
import * as path from 'path';
import * as request from 'request';

export class TrafficWidget extends Widget {

    static async init(ctx: Canvas.Context2d, cover: Cover, widget: IWidgetTraffic, preview: boolean) {
        const widget_instance = new TrafficWidget(ctx, cover, widget, preview);
        await widget_instance.generate();
        return widget_instance;
    }

    static async getData(widget: IWidgetTraffic, group: SocialGroup) {
        if (config.isTest) {
            return {
                traffic_data: {
                    level: 3
                }
            };
        }
        if (!widget.region) {
            return null;
        }
        return {
            traffic_data: await TrafficService.getTraffic(widget.region)
        };
    }

    widget: IWidgetTraffic;

    async generate() {
        if (!this.widget.region) {
            log.warn('There no traffic region for cover ', this.cover.id);
            return;
        }
        if (!this.widget.isShown || !this.widget.widget_data || !this.widget.widget_data.traffic_data) {
            return;
        }

        if (!this.widget.iconHide) {
            const iconPath = path.join(__dirname, '..', 'imgs', 'traffic', this.widget.iconSize, this.getImgName() + '.png');
            const iconImg = await CanvasComponent.getImage(iconPath);

            CanvasComponent.drawImage(
                this.ctx,
                iconImg,
                {
                    x: this.widget.iconX,
                    y: this.widget.iconY
                },
                {
                    width: parseInt(this.widget.iconSize, 10) * 2,
                    height: parseInt(this.widget.iconSize, 10) * 2
                }
            );
        }

        await this.writeText(this.widget[`text${this.widget.widget_data.traffic_data.level}`], {
            x: this.widget.textX,
            y: this.widget.textY,
            show: !this.widget.textHide,
            size: this.widget.size,
            color: this.widget.color,
            font: this.widget.font,
            fontWeight: this.widget.fontWeight,
            italic: this.widget.italic,
            uppercase: this.widget.uppercase,
        });

        let markText = this.widget.widget_data.traffic_data.level.toString();
        if (!this.widget.markHideCounter) {
            markText += ` ${this.getCounterText()}`;
        }
        await this.writeText(markText, {
            x: this.widget.markX,
            y: this.widget.markY,
            show: !this.widget.markHide,
            size: this.widget.counterSize,
            color: this.widget.counterColor,
            font: this.widget.counterFont,
            fontWeight: this.widget.counterFontWeight,
            italic: this.widget.counterItalic,
            uppercase: this.widget.counterUppercase,
        });
    }

    scaleSettings() {
        this.widget.size *= 2;
        this.widget.iconX *= 2;
        this.widget.iconY *= 2;
        this.widget.textX *= 2;
        this.widget.textY *= 2;
        this.widget.markX *= 2;
        this.widget.markY *= 2;
        this.widget.counterSize *= 2;
    }

    private getCounterText() {
        switch (this.widget.widget_data.traffic_data.level) {
            case 1:
                return 'балл';
            case 2:
            case 3:
            case 4:
                return 'балла';
            default:
                return 'баллов';
        }
    }

    private getImgName() {
        switch (this.widget.widget_data.traffic_data.level) {
            case 0:
                return 'neutral';
            case 1:
            case 2:
            case 3:
                return 'green';
            case 4:
            case 5:
            case 6:
                return 'yellow';
            case 7:
            case 8:
            case 9:
                return 'red';
        }
        return 'neutral';
    }
}

export interface IWidgetTraffic extends IWidget {
    name: 'traffic';
    size: number;
    uppercase: boolean;
    fontWeight: string;
    italic: boolean;
    font: string;
    color: string;

    region: number;

    iconHide: boolean;
    iconX: number;
    iconY: number;
    iconSize: '20' | '40';

    textHide: boolean;
    textX: number;
    textY: number;

    markHide: boolean;
    markX: number;
    markY: number;
    markHideCounter: boolean;
    counterSize: number;
    counterUppercase: boolean;
    counterFontWeight: string;
    counterItalic: boolean;
    counterFont: string;
    counterColor: string;

    text1: string;
    text2: string;
    text3: string;
    text4: string;
    text5: string;
    text6: string;
    text7: string;
    text8: string;
    text9: string;
    text10: string;

    widget_data: {
        traffic_data: ITrafficData
    };
}
