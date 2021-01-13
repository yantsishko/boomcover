'use strict';

import config from '@config';
import { Cover } from '@entity/Cover';
import { SocialGroup } from '@entity/SocialGroup';
import { IVKData, IWidgetWithImage, IWidgetWithNames, Widget } from '@widget/Widget';
import * as Canvas from 'canvas';
import * as fs from 'graceful-fs';
import * as moment from 'moment';
import * as path from 'path';

export class SubscriberWidget extends Widget {

    static async init(ctx: Canvas.Context2d, cover: Cover, widget: IWidgetSubscriber, preview: boolean) {
        const widget_instance = new SubscriberWidget(ctx, cover, widget, preview, {
            has_image: true,
            has_names: true
        });
        await widget_instance.generate();
        return widget_instance;
    }

    static async getData(widget: IWidgetSubscriber, group: SocialGroup): Promise<any> {
        if (config.isTest) {
            return {
                first_name: 'Иван',
                last_name: 'Иванов'
            };
        }
        return null;
    }

    widget: IWidgetSubscriber;

}

export interface IWidgetSubscriber extends IWidgetWithImage, IWidgetWithNames {
    widget_data: IVKData;
}
