'use strict';

import { CanvasComponent } from '@component/canvas';
import { Files } from '@component/files';
import { Log } from '@component/logger';
import config from '@config';
import { Cover } from '@entity/Cover';
import { SocialGroup } from '@entity/SocialGroup';
import AbstractService from '@service/abstract';
import { CommentService } from '@service/comment';
import { VK } from '@service/vk';
import * as Canvas from 'canvas';
import sha256 = require('crypto-js/sha256');
import * as fs from 'graceful-fs';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as path from 'path';
import { getRepository } from 'typeorm';

// Widgets
import { CommentatorDayWidget, IWidgetCommentatorDay } from '@widget/CommentatorDay';
import { CommentatorLastWidget, IWidgetCommentatorLast } from '@widget/CommentatorLast';
import { CommentatorLikesWidget, IWidgetCommentatorLikes } from '@widget/CommentatorLikes';
import { CurrencyWidget, IWidgetCurrency } from '@widget/Currency';
import { DateWidget, IWidgetDate } from '@widget/Date';
import { ImageWidget, IWidgetImage } from '@widget/Image';
import { IWidgetLikerDay, LikerDayWidget } from '@widget/LikerDay';
import { IWidgetReposterDay, ReposterDayWidget } from '@widget/ReposterDay';
import { IWidgetReposterLast, ReposterLastWidget } from '@widget/ReposterLast';
import { IWidgetRSS, RSSWidget } from '@widget/RSS';
import { IWidgetStatistics, StatisticsWidget } from '@widget/Statistics';
import { IWidgetSubscriber, SubscriberWidget } from '@widget/Subscriber';
import { IWidgetText, TextWidget } from '@widget/Text';
import { IWidgetTimer, TimerWidget } from '@widget/Timer';
import { IWidgetTraffic, TrafficWidget } from '@widget/Traffic';
import { IWidgetUrlText, UrlTextWidget } from '@widget/UrlText';
import { IWidgetWeather, WeatherWidget } from '@widget/Weather';
import { IWidget } from '@widget/Widget';
import { IWidgetWinner, WinnerWidget } from '@widget/Winner';

export class CoverService extends AbstractService {

    static async generateAndUploadCover(cover: Cover) {
        const group = await cover.group;
        if (!group.connected) {
            return false;
        }

        if ((await this.generate(cover)) !== 'ok') {
            return false;
        }

        return await this.uploadCover(cover);
    }

    static async uploadCover(cover: Cover) {
        const group = await cover.group;
        if (!group.connected || !cover.full_output_path) {
            Log.CONVERT.warn(`Can't upload image to unconnected group ${group.id}`);
            return false;
        }

        await VK.setCover(cover);
        return true;
    }

    static async generate(cover: Cover, preview: boolean = false): Promise<string> {
        const group = await cover.group;
        if (!group.connected) {
            Log.CONVERT.info(`Can't generatate image to unconnected group ${group.id}`);
            return 'connected';
        }
        if (!cover.settings || (!cover.settings.length && !preview)) {
            return 'invalid_settings';
        }

        const time_start = moment().valueOf();

        let bg_img = path.join(__dirname, '..', '..', cover.input_img);
        if (!fs.existsSync(bg_img)) {
            bg_img = path.join(__dirname, '..', 'covers', 'default_cover.png');
        }

        Files.mkDir(cover.pathes.DATA_DIR);
        Files.mkDir(cover.pathes.CURRENT_DIR);
        Files.mkDir(cover.pathes.TMP_DIR);

        let widgets = _.cloneDeep(cover.settings)
                .filter((widget) => widget.isShown);
        if (!preview) {
            for (let i = 0; i < widgets.length; i++) {
                widgets[i] = await this.getWidgetWithData(widgets[i], group);
            }
            if (!config.isTest) {
                widgets = await VK.getWidgetsWithData(widgets, group);
            }
        } else {
            for (let i = 0; i < widgets.length; i++) {
                widgets[i].widget_data = {
                    weather_data: {
                        temp: 17,
                        wind: 2,
                        weather: 'Ясно',
                        icon: '01d'
                    },
                    first_name: 'Иван',
                    last_name: 'Иванов',
                    likes: 15,
                    comments_count: 15,
                    reposts_count: 15,
                    likes_count: 15,
                    members: 22,
                    subscribed: 23,
                    visitors: 24,
                    views: 25
                };
                if (['url', 'currency', 'traffic', 'timer', 'image', 'rss', 'date'].includes(widgets[i].name)) {
                    widgets[i] = await this.getWidgetWithData(widgets[i], group);
                }
            }
        }
        if (!preview) {
            const currentConvertHash = sha256(JSON.stringify(widgets)).toString();
            if (cover.last_convert_hash === currentConvertHash) {
                return 'exists';
            }
            cover.last_convert_hash = currentConvertHash;
        }

        const bg_canvas_img = await CanvasComponent.getImage(bg_img);
        const cover_canvas = CanvasComponent.getCanvas({
            width: bg_canvas_img.width,
            height: bg_canvas_img.height
        });
        const ctx = cover_canvas.getContext('2d');
        await CanvasComponent.drawImage(ctx, bg_canvas_img, {x: 0, y: 0}, {width: cover_canvas.width, height: cover_canvas.height});
        for (const widget of widgets) {
            await CoverService.makeWidget(ctx, cover, widget, preview);
        }
        await CoverService.write(cover_canvas, cover, preview);

        const coverOutputImg = `/protected/covers/data/${cover.id}/result.png`;
        if (!preview) {
            const coverRepository = getRepository(Cover);
            cover.output_img = coverOutputImg;
            await coverRepository.save(cover);
        }
        Log.CONVERT.info(`Cover generating for group ${group.id}: ${moment().valueOf() - time_start}ms`);
        return 'ok';
    }

    private static async getWidgetWithData(widget: IWidget, group: SocialGroup): Promise<IWidget> {
        switch (widget.name) {
            case 'subscriber':
                widget.widget_data = await SubscriberWidget.getData(widget as IWidgetSubscriber, group);
                break;
            case 'commentatorLast':
                widget.widget_data = await CommentatorLastWidget.getData(widget as IWidgetCommentatorLast, group);
                break;
            case 'commentatorDay':
                widget.widget_data = await CommentatorDayWidget.getData(widget as IWidgetCommentatorDay, group);
                break;
            case 'commentatorLikes':
                widget.widget_data = await CommentatorLikesWidget.getData(widget as IWidgetCommentatorLikes, group);
                break;
            case 'text':
                widget.widget_data = await TextWidget.getData(widget as IWidgetText, group);
                break;
            case 'date':
                widget.widget_data = await DateWidget.getData(widget as IWidgetDate, group);
                break;
            case 'timer':
                widget.widget_data = await TimerWidget.getData(widget as IWidgetTimer, group);
                break;
            case 'weather':
                widget.widget_data = await WeatherWidget.getData(widget as IWidgetWeather, group);
                break;
            case 'winner':
                widget.widget_data = await WinnerWidget.getData(widget as IWidgetWinner, group);
                break;
            case 'reposterDay':
                widget.widget_data = await ReposterDayWidget.getData(widget as IWidgetReposterDay, group);
                break;
            case 'reposterLast':
                widget.widget_data = await ReposterLastWidget.getData(widget as IWidgetReposterLast, group);
                break;
            case 'currency':
                widget.widget_data = await CurrencyWidget.getData(widget as IWidgetCurrency, group);
                break;
            case 'statistic':
                widget.widget_data = await StatisticsWidget.getData(widget as IWidgetStatistics, group);
                break;
            case 'url':
                widget.widget_data = await UrlTextWidget.getData(widget as IWidgetUrlText, group);
                break;
            case 'likerDay':
                widget.widget_data = await LikerDayWidget.getData(widget as IWidgetLikerDay, group);
                break;
            case 'traffic':
                widget.widget_data = await TrafficWidget.getData(widget as IWidgetTraffic, group);
                break;
            case 'image':
                widget.widget_data = await ImageWidget.getData(widget as IWidgetImage, group);
                break;
            case 'rss':
                widget.widget_data = await RSSWidget.getData(widget as IWidgetRSS, group);
                break;
        }
        return widget;
    }

    private static async makeWidget(ctx: Canvas.Context2d, cover: Cover, widget: IWidget, preview: boolean) {
        let widgetInstance;
        switch (widget.name) {
            case 'subscriber':
                widgetInstance = await SubscriberWidget.init(ctx, cover, widget as IWidgetSubscriber, preview);
                break;
            case 'commentatorLast':
                widgetInstance = await CommentatorLastWidget.init(ctx, cover, widget as IWidgetCommentatorLast, preview);
                break;
            case 'commentatorDay':
                widgetInstance = await CommentatorDayWidget.init(ctx, cover, widget as IWidgetCommentatorDay, preview);
                break;
            case 'commentatorLikes':
                widgetInstance = await CommentatorLikesWidget.init(ctx, cover, widget as IWidgetCommentatorLikes, preview);
                break;
            case 'text':
                widgetInstance = await TextWidget.init(ctx, cover, widget as IWidgetText, preview);
                break;
            case 'date':
                widgetInstance = await DateWidget.init(ctx, cover, widget as IWidgetDate, preview);
                break;
            case 'timer':
                widgetInstance = await TimerWidget.init(ctx, cover, widget as IWidgetTimer, preview);
                break;
            case 'weather':
                widgetInstance = await WeatherWidget.init(ctx, cover, widget as IWidgetWeather, preview);
                break;
            case 'winner':
                widgetInstance = await WinnerWidget.init(ctx, cover, widget as IWidgetWinner, preview);
                break;
            case 'reposterDay':
                widgetInstance = await ReposterDayWidget.init(ctx, cover, widget as IWidgetReposterDay, preview);
                break;
            case 'reposterLast':
                widgetInstance = await ReposterLastWidget.init(ctx, cover, widget as IWidgetReposterLast, preview);
                break;
            case 'currency':
                widgetInstance = await CurrencyWidget.init(ctx, cover, widget as IWidgetCurrency, preview);
                break;
            case 'statistic':
                widgetInstance = await StatisticsWidget.init(ctx, cover, widget as IWidgetStatistics, preview);
                break;
            case 'url':
                widgetInstance = await UrlTextWidget.init(ctx, cover, widget as IWidgetUrlText, preview);
                break;
            case 'likerDay':
                widgetInstance = await LikerDayWidget.init(ctx, cover, widget as IWidgetLikerDay, preview);
                break;
            case 'traffic':
                widgetInstance = await TrafficWidget.init(ctx, cover, widget as IWidgetTraffic, preview);
                break;
            case 'image':
                widgetInstance = await ImageWidget.init(ctx, cover, widget as IWidgetImage, preview);
                break;
            case 'rss':
                widgetInstance = await RSSWidget.init(ctx, cover, widget as IWidgetRSS, preview);
                break;
        }
        return widgetInstance;
    }

    private static write(cover_canvas: Canvas, cover: Cover, preview: boolean = false): Promise<void> {
        return CanvasComponent.writePNG(cover_canvas, path.join(cover.pathes.CURRENT_DIR, (preview ? 'preview' : 'result') + '.png'));
    }

}
