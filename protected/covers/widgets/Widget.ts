'use strict';

import { CanvasComponent } from '@component/canvas';
import log from '@component/logger';
import {Cover} from '@entity/Cover';
import {SocialGroup} from '@entity/SocialGroup';
import * as Canvas from 'canvas';
import sha256 = require('crypto-js/sha256');
import * as fs from 'graceful-fs';
import * as moment from 'moment';
import * as path from 'path';

export interface ITextSettings {
    x: number;
    y: number;
    size: number;
    show: boolean;
    uppercase: boolean;
    fontWeight: string;
    italic: boolean;
    font: string;
    color: string;
}

export interface IWidget {
    name: string;
    title: string;
    isShown: boolean;
    widget_data?: any;
}

export interface IWidgetWithImage extends IWidget {
    imageSize: number;
    borderSize: number;
    borderColor: string;
    imageX: number;
    imageY: number;
    imageFigure: string;
}

export interface IWidgetWithNames extends IWidget {

    namePosition: 'nameFirst' | 'lastNameFirst' | 'separated';

    nameSize: number;
    nameX: number;
    nameY: number;
    nameShow: boolean;
    nameUppercase: boolean;
    nameFontWeight: string;
    nameItalic: boolean;
    nameTextAlign: string;
    nameFont: string;
    nameColor: string;

    lnameSize: number;
    lnameX: number;
    lnameY: number;
    lnameShow: boolean;
    lnameUppercase: false;
    lnameFontWeight: string;
    lnameItalic: false;
    lnameTextAlign: string;
    lnameFont: string;
    lnameColor: string;
}

export interface IWidgetWithVKData extends IWidget {
    widget_data: IVKData;
}

export interface IVKData extends IWidget {
    first_name: string;
    last_name: string;
    photo_max: string;
    likes?: number;
    comments_count?: number;
    reposts_count?: number;
    likes_count?: number;
}

export interface WidgetConfig {
    has_image: boolean;
    has_names: boolean;
}

export class Widget {

    static async init(ctx: Canvas.Context2d, cover: Cover, widget: any, preview: boolean): Promise<void|Widget> {
        return;
    }

    static async getData(widget: IWidget, group: SocialGroup): Promise<any> {
        return null;
    }

    constructor(
        public ctx: Canvas.Context2d,
        public cover: Cover,
        public widget: any,
        public preview: boolean,
        public config: WidgetConfig = {
            has_image: false,
            has_names: false
        }
    ) {
       this.scaleSettings();
       this.validateSettings();
    }

    validateSettings() {
        // empty
    }

    scaleSettings() {
        if (this.config.has_image) {
            (this.widget as IWidgetWithImage).imageSize *= 2;
            (this.widget as IWidgetWithImage).borderSize *= 2;
            (this.widget as IWidgetWithImage).imageX *= 2;
            (this.widget as IWidgetWithImage).imageY *= 2;
        }
        if (this.config.has_names) {
            (this.widget as IWidgetWithNames).nameSize *= 2;
            (this.widget as IWidgetWithNames).nameX *= 2;
            (this.widget as IWidgetWithNames).nameY *= 2;

            (this.widget as IWidgetWithNames).lnameSize *= 2;
            (this.widget as IWidgetWithNames).lnameX *= 2;
            (this.widget as IWidgetWithNames).lnameY *= 2;
        }
    }

    async generate() {
        if (this.config.has_image) {
            let img = null;
            if (!(this.widget as IWidgetWithVKData).widget_data || this.preview) {
                img = await this.createImage(null);
            } else if (!this.preview) {
                img = await this.createImage((this.widget as IWidgetWithVKData).widget_data.photo_max);
            }

            if (img) {
                await CanvasComponent.drawImage(
                    this.ctx,
                    img,
                    {
                        x: (this.widget as IWidgetWithImage).imageX,
                        y: (this.widget as IWidgetWithImage).imageY
                    },
                    {
                        width: img.width,
                        height: img.height
                    }
                );
            }
        }
        if (this.config.has_names && this.widget.widget_data) {
            if ((this.widget as IWidgetWithNames).namePosition === 'nameFirst') {
                await this.writeText(this.widget.widget_data.first_name + ' ' + this.widget.widget_data.last_name, {
                    x: (this.widget as IWidgetWithNames).nameX,
                    y: (this.widget as IWidgetWithNames).nameY,
                    show: (this.widget as IWidgetWithNames).nameShow,
                    size: (this.widget as IWidgetWithNames).nameSize,
                    color: (this.widget as IWidgetWithNames).nameColor,
                    font: (this.widget as IWidgetWithNames).nameFont,
                    fontWeight: (this.widget as IWidgetWithNames).nameFontWeight,
                    italic: (this.widget as IWidgetWithNames).nameItalic,
                    uppercase: (this.widget as IWidgetWithNames).nameUppercase,
                });
            } else if ((this.widget as IWidgetWithNames).namePosition === 'lastNameFirst') {
                await this.writeText(this.widget.widget_data.last_name + ' ' + this.widget.widget_data.first_name, {
                    x: (this.widget as IWidgetWithNames).lnameX,
                    y: (this.widget as IWidgetWithNames).lnameY,
                    show: (this.widget as IWidgetWithNames).lnameShow,
                    size: (this.widget as IWidgetWithNames).lnameSize,
                    color: (this.widget as IWidgetWithNames).lnameColor,
                    font: (this.widget as IWidgetWithNames).lnameFont,
                    fontWeight: (this.widget as IWidgetWithNames).lnameFontWeight,
                    italic: (this.widget as IWidgetWithNames).lnameItalic,
                    uppercase: (this.widget as IWidgetWithNames).lnameUppercase,
                });
            } else {
                await this.writeText(this.widget.widget_data.first_name, {
                    x: (this.widget as IWidgetWithNames).nameX,
                    y: (this.widget as IWidgetWithNames).nameY,
                    show: (this.widget as IWidgetWithNames).nameShow,
                    size: (this.widget as IWidgetWithNames).nameSize,
                    color: (this.widget as IWidgetWithNames).nameColor,
                    font: (this.widget as IWidgetWithNames).nameFont,
                    fontWeight: (this.widget as IWidgetWithNames).nameFontWeight,
                    italic: (this.widget as IWidgetWithNames).nameItalic,
                    uppercase: (this.widget as IWidgetWithNames).nameUppercase,
                });

                await this.writeText(this.widget.widget_data.last_name, {
                    x: (this.widget as IWidgetWithNames).lnameX,
                    y: (this.widget as IWidgetWithNames).lnameY,
                    show: (this.widget as IWidgetWithNames).lnameShow,
                    size: (this.widget as IWidgetWithNames).lnameSize,
                    color: (this.widget as IWidgetWithNames).lnameColor,
                    font: (this.widget as IWidgetWithNames).lnameFont,
                    fontWeight: (this.widget as IWidgetWithNames).lnameFontWeight,
                    italic: (this.widget as IWidgetWithNames).lnameItalic,
                    uppercase: (this.widget as IWidgetWithNames).lnameUppercase,
                });
            }
        }
    }

    async createImage(image_url: string) {
        const imgData = {
            size: (this.widget as IWidgetWithImage).imageSize,
            borderSize: (this.widget as IWidgetWithImage).borderSize,
            borderColor: (this.widget as IWidgetWithImage).borderColor,
            figure: (this.widget as IWidgetWithImage).imageFigure,
            url: image_url
        };
        const imgPath = this.cover.getImgTmpPath(JSON.stringify(imgData));
        if (!fs.existsSync(imgPath)) {
            const canvas = CanvasComponent.getCanvas({
                width: imgData.size + imgData.borderSize * 2,
                height: imgData.size + imgData.borderSize * 2
            });
            const ctx = canvas.getContext('2d');
            if (imgData.borderSize) {
                if (imgData.figure === 'round') {
                    await CanvasComponent.drawRoundBorder(ctx, imgData.borderColor, canvas.width);
                } else {
                    await CanvasComponent.drawBorder(ctx, imgData.borderColor, canvas.width);
                }
            }
            if (image_url) {
                const origImg: Buffer|Canvas.Image = await CanvasComponent.resizeImage(
                    await CanvasComponent.getImageFromUrl(image_url),
                    {
                        width: imgData.size,
                        height: imgData.size
                    }
                );
                if (imgData.figure === 'round') {
                    await CanvasComponent.drawRoundImage(
                        ctx,
                        origImg,
                        {
                            x: imgData.borderSize,
                            y: imgData.borderSize
                        },
                        imgData.size
                    );
                } else {
                    await CanvasComponent.drawImage(
                        ctx,
                        origImg,
                        {
                            x: imgData.borderSize,
                            y: imgData.borderSize
                        },
                        {
                            width: imgData.size,
                            height: imgData.size
                        }
                    );
                }
            } else {
                const noAvatarImg = await CanvasComponent.getImage(path.join(
                    this.cover.pathes.COVER_DIR,
                    'imgs',
                    'no_avatar',
                    imgData.figure === 'round' ? 'round' : 'square',
                    `${imgData.size}.png`
                ));
                await CanvasComponent.drawImage(
                    ctx,
                    noAvatarImg,
                    {
                        x: imgData.borderSize,
                        y: imgData.borderSize
                    },
                    {
                        width: imgData.size,
                        height: imgData.size
                    }
                );
            }
            await CanvasComponent.writePNG(canvas, imgPath);
        }

        return await CanvasComponent.getImage(imgPath);
    }

    async writeText(text: string, settings: ITextSettings): Promise<void> {
        if (settings.show && text) {
            if (settings.uppercase) {
                text = text.toUpperCase();
            }
            const fontName = settings.font.toLowerCase().replace(/\s/g, '_');
            const fontBase = path.join(__dirname, '..', 'fonts', fontName);
            const font = fontBase + '_regular.ttf';
            if (fs.existsSync(font)) {
                const canvasFont = new Canvas.Font(fontName, font);
                if (fs.existsSync(fontBase + '_bold.ttf')) {
                    canvasFont.addFace(fontBase + '_bold.ttf', 'bold');
                }
                if (fs.existsSync(fontBase + '_italic.ttf')) {
                    canvasFont.addFace(fontBase + '_italic.ttf', 'normal', 'italic');
                }
                if (fs.existsSync(fontBase + '_bold_italic.ttf')) {
                    canvasFont.addFace(fontBase + '_bold_italic.ttf', 'bold', 'italic');
                }
                this.ctx.addFont(canvasFont);
            }
            if (fontName !== 'arial') {
                const arialFontBase = path.join(__dirname, '..', 'fonts', 'arial');
                const canvasFont = new Canvas.Font(fontName, arialFontBase + '_regular.ttf');
                if (fs.existsSync(arialFontBase + '_bold.ttf')) {
                    canvasFont.addFace(arialFontBase + '_bold.ttf', 'bold');
                }
                if (fs.existsSync(arialFontBase + '_italic.ttf')) {
                    canvasFont.addFace(arialFontBase + '_italic.ttf', 'normal', 'italic');
                }
                if (fs.existsSync(arialFontBase + '_bold_italic.ttf')) {
                    canvasFont.addFace(arialFontBase + '_bold_italic.ttf', 'bold', 'italic');
                }
                this.ctx.addFont(canvasFont);
            }

            this.ctx.save();
            let fontCanvasString = 'normal ';
            if (settings.fontWeight !== 'none' && settings.italic) {
                fontCanvasString += 'bold italic ';
            } else if (settings.fontWeight !== 'none') {
                fontCanvasString += 'bold ';
            } else if (settings.italic) {
                fontCanvasString += 'italic ';
            }
            fontCanvasString += `${settings.size}px ${fontName}` + (fontName !== 'arial' ? ', arial' : '');
            this.ctx.font = fontCanvasString;
            this.ctx.fillStyle = settings.color;
            this.ctx.fillText(text, settings.x, settings.y + settings.size);
            this.ctx.restore();
        }
    }
}
