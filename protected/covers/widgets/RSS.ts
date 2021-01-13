'use strict';

import { RSS, RSSEntry } from '@component/rss';
import {Cover} from '@entity/Cover';
import { SocialGroup } from '@entity/SocialGroup';
import {IWidget, Widget} from '@widget/Widget';
import * as Canvas from 'canvas';
import * as fs from 'graceful-fs';
import * as moment from 'moment';
import * as path from 'path';

export class RSSWidget extends Widget {

    static async init(ctx: Canvas.Context2d, cover: Cover, widget: IWidgetRSS, preview: boolean) {
        const widget_instance = new RSSWidget(ctx, cover, widget, preview);
        await widget_instance.generate();
        return widget_instance;
    }

    static async getData(widget: IWidgetRSS, group: SocialGroup) {
        let needShow: boolean = true;
        let rssData: RSSEntry[] = null;
        if (widget.showTextTime) {
            const start_date = moment(widget.textStart, 'YYYY-MM-DD HH:mm');
            const end_date = moment(widget.textEnd, 'YYYY-MM-DD HH:mm');
            const now = moment().utcOffset(widget.gmt);
            if (now.diff(start_date) < 0 || now.diff(end_date) > 0) {
                needShow = false;
            }
        }
        if (widget.rssLink) {
            rssData = (await RSS.parseURL(widget.rssLink)).feed.entries;
            const keywords: string[] = widget.keywords
                ? widget.keywords.split(',').map((el) => el.trim())
                : [];
            const stopwords: string[] = widget.stopwords
                ? widget.stopwords.split(',').map((el) => el.trim())
                : [];
            if (rssData && rssData.length && (keywords.length || stopwords.length)) {
                rssData = rssData.filter((rssEntry) => {
                    if (stopwords.length && (new RegExp('.*(' + stopwords.join('|') + ').*', 'i')).test(rssEntry.title)) {
                        return false;
                    }
                    if (keywords.length) {
                        return (new RegExp('.*(' + keywords.join('|') + ').*', 'i')).test(rssEntry.title);
                    }
                    return true;
                });
            }
        }
        return {
            needShow,
            rssData
        };
    }

    widget: IWidgetRSS;

    async generate() {
        if (!this.widget.widget_data.rssData || (!this.widget.widget_data.needShow && !this.preview)) {
            return;
        }
        const texts = this.widget.widget_data.rssData
            .map((el) => {
                if (el.title.length > this.widget.symbolsCount) {
                    return el.title.slice(0, this.widget.symbolsCount) + '...';
                }
                return el.title;
            })
            .filter((el, index) => index < this.widget.newsCount);
        for (const [index, text] of texts.entries()) {
            await this.writeText(text, {
                x: this.widget.textX,
                y: this.widget.textY + ((this.widget.indent + this.widget.size) * index),
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
        super.scaleSettings();
        this.widget.size *= 2;
        this.widget.textX *= 2;
        this.widget.textY *= 2;
        this.widget.indent *= 2;
    }

    validateSettings() {
        if (this.widget.newsCount < 1) {
            this.widget.newsCount = 1;
        }
        if (!this.widget.newsCount || this.widget.newsCount > 4) {
            this.widget.newsCount = 4;
        }
        if (!this.widget.symbolsCount) {
            this.widget.symbolsCount = 70;
        }
        if (!this.widget.indent) {
            this.widget.indent = 5;
        }
    }
}

export interface IWidgetRSS extends IWidget {
    size: number;
    uppercase: boolean;
    fontWeight: string;
    italic: boolean;
    font: string;
    color: string;
    textX: number;
    textY: number;

    rssLink: string;
    keywords: string; // ключевые слова
    stopwords: string; // стоп-слова
    newsCount: number; // количество новостей
    symbolsCount: number; // количество символов
    indent: number; // отступ между новостями

    showTextTime: boolean;
    textStart: string;
    textEnd: string;
    gmt: string;

    widget_data?: {
        needShow: boolean;
        rssData: RSSEntry[];
    };
}
