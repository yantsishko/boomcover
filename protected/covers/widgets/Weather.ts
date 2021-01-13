'use strict';

import { CanvasComponent } from '@component/canvas';
import log from '@component/logger';
import { Cover } from '@entity/Cover';
import { SocialGroup } from '@entity/SocialGroup';
import { IWeatherData, Weather, WeatherTime } from '@service/weather';
import { IWidget, Widget } from '@widget/Widget';
import * as Canvas from 'canvas';
import * as fs from 'graceful-fs';
import * as path from 'path';
import * as request from 'request';

export class WeatherWidget extends Widget {

    static async init(ctx: Canvas.Context2d, cover: Cover, widget: IWidgetWeather, preview: boolean) {
        const widget_instance = new WeatherWidget(ctx, cover, widget, preview);
        await widget_instance.generate();
        return widget_instance;
    }

    static async getData(widget: IWidgetWeather, group: SocialGroup) {
        if (!widget.city) {
            return null;
        }
        return {
            weather_data: await Weather.getWeather(widget.city, widget.weatherTime)
        };
    }

    widget: IWidgetWeather;

    async generate() {
        if (!this.widget.city) {
            log.warn('There no city for cover ', this.cover.id);
            return;
        }
        if (!this.widget.isShown || !this.widget.widget_data || !this.widget.widget_data.weather_data) {
            return;
        }

        const icon_img = await CanvasComponent.getImage(path.join(__dirname, '..', 'imgs', 'weather_templates', this.widget.weatherTemplate, this.widget.widget_data.weather_data.icon + '.png'));
        CanvasComponent.drawImage(this.ctx, icon_img, {
            x: this.widget.weatherX,
            y: this.widget.weatherY
        }, {
                width: 128,
                height: 128
            });

        let text = '';

        if (this.widget.showType) {
            text += this.widget.widget_data.weather_data.weather + ', ';
        }

        text += (this.widget.widget_data.weather_data.temp > 0 ? '+' : '') + this.widget.widget_data.weather_data.temp + this.widget.textAfter;
        await this.writeText(text, {
            x: this.widget.weatherTypeX,
            y: this.widget.weatherTypeY,
            show: this.widget.isShown,
            size: this.widget.size,
            color: this.widget.color,
            font: this.widget.font,
            fontWeight: this.widget.fontWeight,
            italic: this.widget.italic,
            uppercase: this.widget.uppercase,
        });

        if (this.widget.showWind) {
            text = `Ветер: ${this.widget.widget_data.weather_data.wind} м/с`;
            await this.writeText(text, {
                x: this.widget.weatherWindX,
                y: this.widget.weatherWindY,
                show: this.widget.isShown,
                size: this.widget.size,
                color: this.widget.color,
                font: this.widget.font,
                fontWeight: this.widget.fontWeight,
                italic: this.widget.italic,
                uppercase: this.widget.uppercase,
            });
        }
    }

    scaleSettings() {
        this.widget.size *= 2;
        this.widget.weatherX *= 2;
        this.widget.weatherY *= 2;
        this.widget.weatherTypeX *= 2;
        this.widget.weatherTypeY *= 2;
        this.widget.weatherWindX *= 2;
        this.widget.weatherWindY *= 2;
    }

}

export interface IWidgetWeather extends IWidget {
    city: string;
    textAfter: string;
    showWind: boolean;
    showType: boolean;
    size: number;
    uppercase: boolean;
    fontWeight: string;
    italic: boolean;
    font: string;
    color: string;
    weatherTemplate: string;

    weatherX: number;
    weatherY: number;
    weatherTypeX: number;
    weatherTypeY: number;
    weatherWindX: number;
    weatherWindY: number;

    weatherTime: WeatherTime;

    widget_data: {
        weather_data: IWeatherData
    };
}
