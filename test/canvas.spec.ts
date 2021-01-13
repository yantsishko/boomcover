import { CanvasComponent } from '@component/canvas';
import * as Canvas from 'canvas';
import { expect } from 'chai';
import * as path from 'path';
import { getHashFromFile } from './helper';

describe('Canvas', () => {
    it('Fonts TTF', async () => {
        const canvas = CanvasComponent.getCanvas({
            width: 1024,
            height: 720
        });
        const ctx = canvas.getContext('2d');
        const fontBase = path.join(__dirname, 'resources', 'fonts', 'arial');
        const canvasFont = new Canvas.Font('arial', fontBase + '_regular.ttf');
        canvasFont.addFace(fontBase + '_bold.ttf', 'bold');
        canvasFont.addFace(fontBase + '_italic.ttf', 'normal', 'italic');
        canvasFont.addFace(fontBase + '_bold_italic.ttf', 'bold', 'italic');
        ctx.addFont(canvasFont);

        ctx.beginPath();
        ctx.rect(0, 0, 1024, 720);
        ctx.fillStyle = 'white';
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.font = 'normal 40px arial';
        ctx.fillText('Test text!', 50, 60);

        ctx.fillStyle = '#000';
        ctx.font = 'bold italic 40px arial';
        ctx.fillText('Test text!', 50, 120);

        ctx.fillStyle = '#000';
        ctx.font = 'bold 40px arial';
        ctx.fillText('Test text!', 50, 180);

        ctx.fillStyle = '#000';
        ctx.font = 'italic 40px arial';
        ctx.fillText('Test text!', 50, 240);

        const ttfFontPath = path.join(__dirname, '..', 'protected', 'runtime', 'tmp', 'ttfFont.png');

        await CanvasComponent.writePNG(canvas, ttfFontPath);

        const resultCache = getHashFromFile(ttfFontPath);
        expect(resultCache).to.be.eq('F776DE802EE23C88925FC39DC833C7AC8472C6EC428907E55E791CEA063D9459');
    });

    it('Fonts OTF', async () => {
        const canvas = CanvasComponent.getCanvas({
            width: 1024,
            height: 720
        });
        const ctx = canvas.getContext('2d');
        const fontBase = path.join(__dirname, 'resources', 'fonts', 'source_sans_pro');
        const canvasFont = new Canvas.Font('source_sans_pro', fontBase + '_regular.otf');
        canvasFont.addFace(fontBase + '_bold.otf', 'bold');
        canvasFont.addFace(fontBase + '_italic.otf', 'normal', 'italic');
        canvasFont.addFace(fontBase + '_bold_italic.otf', 'bold', 'italic');
        ctx.addFont(canvasFont);

        ctx.beginPath();
        ctx.rect(0, 0, 1024, 720);
        ctx.fillStyle = 'white';
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.font = 'normal 40px source_sans_pro';
        ctx.fillText('Test text!', 50, 60);

        ctx.fillStyle = '#000';
        ctx.font = 'bold italic 40px source_sans_pro';
        ctx.fillText('Test text!', 50, 120);

        ctx.fillStyle = '#000';
        ctx.font = 'bold 40px source_sans_pro';
        ctx.fillText('Test text!', 50, 180);

        ctx.fillStyle = '#000';
        ctx.font = 'italic 40px source_sans_pro';
        ctx.fillText('Test text!', 50, 240);

        const otfFontPath = path.join(__dirname, '..', 'protected', 'runtime', 'tmp', 'otfFont.png');

        await CanvasComponent.writePNG(canvas, otfFontPath);

        const resultCache = getHashFromFile(otfFontPath);
        expect(resultCache).to.be.eq('CE2100401D8E298D50410778F8016D4B847FA5ACED46B523B9E3F5DE7D39FD35');
    });
});
