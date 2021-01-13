'use strict';

import { Cover } from '@entity/Cover';
import { SocialGroup } from '@entity/SocialGroup';
import { RepostService } from '@service/reposts';
import { IVKData, IWidgetWithImage, IWidgetWithNames, Widget } from '@widget/Widget';
import * as Canvas from 'canvas';
import * as fs from 'graceful-fs';
import * as moment from 'moment';
import * as path from 'path';

export class ReposterLastWidget extends Widget {

    static async init(ctx: Canvas.Context2d, cover: Cover, widget: IWidgetReposterLast, preview: boolean) {
        const widget_instance = new ReposterLastWidget(ctx, cover, widget, preview, {
            has_image: true,
            has_names: true
        });
        await widget_instance.generate();
        return widget_instance;
    }

    static async getData(widget: IWidgetReposterLast, group: SocialGroup): Promise<any> {
        return await RepostService.getLastRepostData(group, widget);
    }

    widget: IWidgetReposterLast;

}

export interface IWidgetReposterLast extends IWidgetWithImage, IWidgetWithNames {
    widget_data: IVKData;
}
