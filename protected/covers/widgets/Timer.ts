'use strict';

import log from '@component/logger';
import { Cover } from '@entity/Cover';
import { SocialGroup } from '@entity/SocialGroup';
import { IWidget, Widget } from '@widget/Widget';
import * as Canvas from 'canvas';
import * as moment from 'moment';

const MS_IN_SECONDS = 1000;
const MS_IN_MINUTES = 60000;
const MS_IN_HOURS = 3600000;
const MS_IN_DAYS = 86400000;

export class TimerWidget extends Widget {

    static async init(ctx: Canvas.Context2d, cover: Cover, widget: IWidgetTimer, preview: boolean) {
        const widget_instance = new TimerWidget(ctx, cover, widget, preview);
        await widget_instance.generate();
        return widget_instance;
    }

    static async getData(widget: IWidgetTimer, group: SocialGroup) {
        if (!widget.endDate) {
            return;
        }

        const now = moment().utc().seconds(0).milliseconds(0);

        const GTM = parseInt(widget.gmt, 10);
        const GTMString = (GTM >= 0
            ? (GTM > 9 ? `+${GTM}` : `+0${GTM}`)
            : (GTM < -9 ? `${GTM}` : `-${Math.abs(GTM)}`)
        );
        const end_date = moment(`${widget.endDate}:00.000${GTMString}`).utc().seconds(0).milliseconds(0);
        let diff_ms = end_date.diff(now, 'ms', true);
        // log.debug(now.toISOString(), end_date.toISOString(), diff_ms);

        const days_num = (diff_ms - (diff_ms % MS_IN_DAYS)) / MS_IN_DAYS;
        if (widget.dayShow && ((!widget.dayZero && days_num === 0) || days_num > 0)) {
            diff_ms %= MS_IN_DAYS;
        }
        const hours_num = (diff_ms - (diff_ms % MS_IN_HOURS)) / MS_IN_HOURS;
        if (widget.hourShow && ((!widget.hourZero && hours_num === 0) || hours_num > 0)) {
            diff_ms %= MS_IN_HOURS;
        }
        const minutes_num = (diff_ms - (diff_ms % MS_IN_MINUTES)) / MS_IN_MINUTES;
        if (widget.minutesShow && ((!widget.minutesZero && minutes_num === 0) || minutes_num > 0)) {
            diff_ms %= MS_IN_MINUTES;
        }

        return {
            timer_data: {
                days_num,
                hours_num,
                minutes_num
            }
        };
    }

    widget: IWidgetTimer;

    async generate() {
        if (!this.widget.widget_data || !this.widget.widget_data.timer_data) {
            return;
        }
        let text = '';

        if (this.widget.dayShow && ((!this.widget.dayZero && this.widget.widget_data.timer_data.days_num === 0) || this.widget.widget_data.timer_data.days_num > 0)) {
            let days_str = this.widget.widget_data.timer_data.days_num.toString();
            if (this.widget.dayZeroShow && this.widget.widget_data.timer_data.days_num < 10) {
                days_str = `0${days_str}`;
            }

            switch (this.widget.dayPosition) {
                case 'right':
                    text += `${days_str} ${this.getText(this.widget.widget_data.timer_data.days_num, this.widget.day1, this.widget.day2, this.widget.day3)}`;
                    break;
                default:
                    text += `${days_str} ${this.getText(this.widget.widget_data.timer_data.days_num, this.widget.day1, this.widget.day2, this.widget.day3)}`;
                    break;
            }
        }

        if (this.widget.hourShow && ((!this.widget.hourZero && this.widget.widget_data.timer_data.hours_num === 0) || this.widget.widget_data.timer_data.hours_num > 0)) {
            let hours_str = this.widget.widget_data.timer_data.hours_num.toString();
            if (this.widget.hourZeroShow && this.widget.widget_data.timer_data.hours_num < 10) {
                hours_str = `0${hours_str}`;
            }

            switch (this.widget.hourPosition) {
                case 'right':
                    text += ` ${hours_str} ${this.getText(this.widget.widget_data.timer_data.hours_num, this.widget.hour1, this.widget.hour2, this.widget.hour3)}`;
                    break;
                default:
                    text += ` ${hours_str} ${this.getText(this.widget.widget_data.timer_data.hours_num, this.widget.hour1, this.widget.hour2, this.widget.hour3)}`;
                    break;
            }
        }

        if (this.widget.minutesShow && ((!this.widget.minutesZero && this.widget.widget_data.timer_data.minutes_num === 0) || this.widget.widget_data.timer_data.minutes_num > 0)) {
            let minutes_str = this.widget.widget_data.timer_data.minutes_num.toString();
            if (this.widget.minutesZeroShow && this.widget.widget_data.timer_data.minutes_num < 10) {
                minutes_str = `0${minutes_str}`;
            }

            switch (this.widget.minutesPosition) {
                case 'right':
                    text += ` ${minutes_str} ${this.getText(this.widget.widget_data.timer_data.minutes_num, this.widget.minutes1, this.widget.minutes2, this.widget.minutes3)}`;
                    break;
                default:
                    text += ` ${minutes_str} ${this.getText(this.widget.widget_data.timer_data.minutes_num, this.widget.minutes1, this.widget.minutes2, this.widget.minutes3)}`;
                    break;
            }
        }

        text = text.trim().toLocaleLowerCase();
        if (text) {
            text = this.widget.textBefore + text;
        }
        await this.writeText(text, {
            x: this.widget.timerX,
            y: this.widget.timerY,
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
        this.widget.timerX *= 2;
        this.widget.timerY *= 2;
    }

    private getText(num: number, text1: string, text2: string, text3: string): string {
        if (num >= 5 && num <= 20) {
            return text3;
        }
        const last_number = num % 10;
        if (last_number === 1) {
            return text1;
        } else if (1 < last_number && last_number < 5) {
            return text2;
        } else {
            return text3;
        }
    }

}

export interface IWidgetTimer extends IWidget {
    size: number;
    uppercase: boolean;
    fontWeight: string;
    italic: boolean;
    font: string;
    color: string;

    format: string;
    endDate: Date;
    textBefore: string;

    day1: string;
    day2: string;
    day3: string;
    dayShow: boolean;
    dayZeroShow: boolean;
    dayZero: boolean;
    dayPosition: 'right' | 'top' | 'down';

    hour1: string;
    hour2: string;
    hour3: string;
    hourShow: boolean;
    hourZeroShow: boolean;
    hourZero: boolean;
    hourPosition: 'right' | 'top' | 'down';

    minutes1: string;
    minutes2: string;
    minutes3: string;
    minutesShow: boolean;
    minutesZeroShow: boolean;
    minutesZero: boolean;
    minutesPosition: string;

    gmt: string;
    timerX: number;
    timerY: number;

    widget_data: {
        timer_data: {
            days_num: number,
            hours_num: number,
            minutes_num: number,
        }
    };
}
