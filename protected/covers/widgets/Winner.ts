'use strict';

import { Cover } from '@entity/Cover';
import { IVKData, IWidgetWithImage, IWidgetWithNames, Widget } from '@widget/Widget';
import * as Canvas from 'canvas';
import * as fs from 'graceful-fs';
import * as moment from 'moment';
import * as path from 'path';

export class WinnerWidget extends Widget {

    static async init(ctx: Canvas.Context2d, cover: Cover, widget: IWidgetWinner, preview: boolean) {
        const widget_instance = new WinnerWidget(ctx, cover, widget, preview, {
            has_image: true,
            has_names: true
        });
        await widget_instance.generate();
        return widget_instance;
    }

    widget: IWidgetWinner;

}

export interface IWidgetWinner extends IWidgetWithImage, IWidgetWithNames {
    winnerId: string;

    widget_data: IVKData;
}
