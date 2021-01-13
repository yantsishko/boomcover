'use strict';

import log from '@component/logger';
import {Cover} from '@entity/Cover';
import {SocialGroup} from '@entity/SocialGroup';
import { Currency, CurrencyService } from '@service/currencies';
import {IWidget, Widget} from '@widget/Widget';
import * as Canvas from 'canvas';
import * as fs from 'graceful-fs';
import * as path from 'path';

export class CurrencyWidget extends Widget {

    static async init(ctx: Canvas.Context2d, cover: Cover, widget: IWidgetCurrency, preview: boolean) {
        const widget_instance = new CurrencyWidget(ctx, cover, widget, preview);
        await widget_instance.generate();
        return widget_instance;
    }

    static async getData(widget: IWidgetCurrency, group: SocialGroup) {
        if (!widget.currencyFrom || !widget.currencyTo) {
            return null;
        }
        const from = await CurrencyService.getCurrency(widget.currencyFrom);
        if (!from) {
            log.warn('Can`t find currency ' + widget.currencyFrom);
            return;
        }
        from.value = 1;

        const to = await CurrencyService.getCurrency(widget.currencyTo);
        if (!from) {
            log.warn('Can`t find currency ' + widget.currencyTo);
            return;
        }
        to.value = await CurrencyService.convertCurrency(widget.currencyFrom, widget.currencyTo);

        return {
            currency_data: {
                from,
                to
            }
        };
    }

    widget: IWidgetCurrency;

    async generate() {
        if (!this.widget.currencyFrom || !this.widget.currencyTo) {
            log.warn('Invalid currencies settings ', this.cover.id);
            return;
        }
        if (!this.widget.isShown || !this.widget.widget_data || !this.widget.widget_data.currency_data) {
            return;
        }

        if (this.widget.currencyFromShow) {
            let text_from = this.widget.widget_data.currency_data.from.value.toFixed(0);
            const text_from_sign = (this.widget.currencyFromShowType === 'sign')
                ? (this.widget.widget_data.currency_data.from.currencySymbol || this.widget.widget_data.currency_data.from.id)
                : this.widget.widget_data.currency_data.from.id;
            if (this.widget.currencyFromShowTypePosition === 'before') {
                text_from = text_from_sign + ' ' + text_from;
            } else {
                text_from += ' ' + text_from_sign;
            }

            await this.writeText(text_from, {
                x: this.widget.currencyFromX,
                y: this.widget.currencyFromY,
                show: this.widget.isShown,
                size: this.widget.size,
                color: this.widget.color,
                font: this.widget.font,
                fontWeight: this.widget.fontWeight,
                italic: this.widget.italic,
                uppercase: this.widget.uppercase,
            });
        }

        let text_to = this.widget.widget_data.currency_data.to.value.toFixed(this.widget.currencyToPrecision || 2);
        const text_to_sign = (this.widget.currencyToShowType === 'sign')
            ? (this.widget.widget_data.currency_data.to.currencySymbol || this.widget.widget_data.currency_data.to.id)
            : this.widget.widget_data.currency_data.to.id;
        if (this.widget.currencyToShowTypePosition === 'before') {
            text_to = text_to_sign + ' ' + text_to;
        } else {
            text_to += ' ' + text_to_sign;
        }
        await this.writeText(text_to, {
            x: this.widget.currencyToX,
            y: this.widget.currencyToY,
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
        this.widget.currencyFromX *= 2;
        this.widget.currencyFromY *= 2;
        this.widget.currencyToX *= 2;
        this.widget.currencyToY *= 2;
    }

}

export interface IWidgetCurrency extends IWidget {
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

    currencyFromShow: boolean;
    currencyFrom: string;
    currencyFromShowTypePosition: 'before' | 'after';
    currencyFromShowType: 'sign' | 'code';
    currencyFromX: number;
    currencyFromY: number;

    currencyTo: string;
    currencyToShowTypePosition: 'before' | 'after';
    currencyToShowType: 'sign' | 'code';
    currencyToPrecision: number;
    currencyToX: number;
    currencyToY: number;

    widget_data: {
        currency_data: {
            from: Currency,
            to: Currency
        }
    };
}
