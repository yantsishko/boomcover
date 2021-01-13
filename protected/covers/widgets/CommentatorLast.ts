'use strict';

import { Cover } from '@entity/Cover';
import { SocialGroup } from '@entity/SocialGroup';
import { CommentService } from '@service/comment';
import { IVKData, IWidgetWithImage, IWidgetWithNames, Widget } from '@widget/Widget';
import * as Canvas from 'canvas';
import * as fs from 'graceful-fs';
import * as moment from 'moment';
import * as path from 'path';

export class CommentatorLastWidget extends Widget {

    static async init(ctx: Canvas.Context2d, cover: Cover, widget: IWidgetCommentatorLast, preview: boolean) {
        const widget_instance = new CommentatorLastWidget(ctx, cover, widget, preview, {
            has_image: true,
            has_names: true
        });
        await widget_instance.generate();
        return widget_instance;
    }

    static async getData(widget: IWidgetCommentatorLast, group: SocialGroup): Promise<any> {
        return await CommentService.getLastCommentData(group, widget);
    }

    widget: IWidgetCommentatorLast;

}

export interface IWidgetCommentatorLast extends IWidgetWithImage, IWidgetWithNames {
    widget_data: IVKData;
}
