'use strict';

import { Cover } from '@entity/Cover';
import { SocialGroup } from '@entity/SocialGroup';
import { IVKData, IWidgetWithImage, IWidgetWithNames, Widget } from '@widget/Widget';
import * as Canvas from 'canvas';
import * as fs from 'graceful-fs';
import * as moment from 'moment';
import * as path from 'path';

import { CanvasComponent } from '@component/canvas';

export class ReposterDayWidget extends Widget {

    static async init(ctx: Canvas.Context2d, cover: Cover, widget: IWidgetReposterDay, preview: boolean) {
        const widget_instance = new ReposterDayWidget(ctx, cover, widget, preview, {
            has_image: true,
            has_names: true
        });
        await widget_instance.generate();
        return widget_instance;
    }

    static async getData(widget: IWidgetReposterDay, group: SocialGroup): Promise<any> {
        return (await group.cache).data.reposterDay;
    }

    widget: IWidgetReposterDay;

    async generate() {
        await super.generate();
        if (!this.widget.widget_data) {
            return;
        }

        if (this.widget.repostsCountShow) {
            const icon_img = await CanvasComponent.getImage(path.join(__dirname, '..', 'imgs', 'icons', `repost_icon_${this.widget.reposterIconColor}.png`));
            CanvasComponent.drawImage(this.ctx, icon_img, {
                x: this.widget.repostsCountX,
                y: this.widget.repostsCountY
            }, {
                    width: 50,
                    height: 50
                });

            const reposts_font_size = 28;

            await this.writeText(this.widget.widget_data.reposts_count.toString(), {
                x: this.widget.repostsCountX + 55,
                y: this.widget.repostsCountY + ((50 - reposts_font_size) / 2),
                show: this.widget.repostsCountShow,
                size: reposts_font_size,
                color: '#fff',
                font: 'Arial',
                fontWeight: 'none',
                italic: false,
                uppercase: false,
            });
        }
    }

    scaleSettings() {
        super.scaleSettings();

        this.widget.repostsCountX *= 2;
        this.widget.repostsCountY *= 2;
    }

}

export interface IWidgetReposterDay extends IWidgetWithImage, IWidgetWithNames {
    minReposts: number;
    repostsCountShow: boolean;
    repostsCountX: number;
    repostsCountY: number;

    reposterIconColor: string;

    widget_data: IVKData;
}
