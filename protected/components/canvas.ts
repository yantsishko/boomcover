import { Files } from '@component/files';
import * as Canvas from 'canvas';
import * as fs from 'fs';
import * as request from 'request';
import log from './logger';

type InputImage = string | Buffer | Canvas.Image;

interface Cors {
    x: number;
    y: number;
}

interface Size {
    width: number;
    height: number;
}

export class CanvasComponent {

    static getImageFromUrl(img_url: string): Promise<Canvas.Image> {
        return Files.getImageBufferFromUrl(img_url)
            .then((img_buffer) => this.getImage(img_buffer));
    }

    static getImage(input_img: InputImage): Promise<Canvas.Image> {
        if (input_img instanceof Canvas.Image) {
            return Promise.resolve(input_img as Canvas.Image);
        } else {
            return new Promise<Canvas.Image>((resolve, reject) => {
                const img = new Canvas.Image();
                img.onerror = (err) => {
                    err.message += 'input_img: ' + input_img.toString();
                    reject(err);
                };
                img.onload = () => {
                    resolve(img);
                };
                img.src = input_img;
            });
        }
    }

    static getCanvas(size: Size) {
        return new Canvas(size.width, size.height);
    }

    static async resizeImage(input_img: InputImage, size: Size): Promise<Buffer> {
        const canvas_instance = new Canvas(size.width, size.height);
        const ctx = canvas_instance.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(await this.getImage(input_img), 0, 0, size.width, size.height);
        return canvas_instance.toBuffer();
    }

    static async resizeAndRoundImage(input_img: InputImage, size: number): Promise<Buffer> {
        const resizedImg = await this.getImage(await this.resizeImage(input_img, {
            width: size,
            height: size
        }));
        const canvasInstance = new Canvas(size, size);
        const ctx = canvasInstance.getContext('2d');
        await this.drawRoundImage(ctx, resizedImg, {x: 0, y: 0}, size);
        return canvasInstance.toBuffer();
    }

    static async drawBorder(ctx, color: string, size: number): Promise<void> {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, size, size);
    }

    static async drawRoundBorder(ctx, color: string, size: number): Promise<void> {
        ctx.fillStyle = color;
        ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI, true);
        ctx.fill();
    }

    static async drawImage(ctx, input_img: InputImage, cors: Cors, size: Size): Promise<void> {
        ctx.drawImage(await this.getImage(input_img), cors.x, cors.y, size.width, size.height);
    }

    static async drawRoundImage(ctx, input_img: InputImage, cors: Cors, size: number): Promise<void> {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cors.x + size / 2, cors.y + size / 2, size / 2, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(await this.getImage(input_img), cors.x, cors.y, size, size);
        ctx.restore();
    }

    static writePNG(canvas: Canvas, dest: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const start = (new Date()).valueOf();
            const out = fs.createWriteStream(dest);
            canvas.pngStream()
                .pipe(out);
            out
                .on('finish', () => {
                    // log.debug('Saved in %dms', (new Date()).valueOf() - start);
                    resolve();
                })
                .on('error', (err) => {
                    reject(err);
                });
        });
    }
}
