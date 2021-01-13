// Type definitions for canvas 1.6.6
// Project: https://github.com/Automattic/node-canvas
// Definitions by: Ilya Amelevich <https://github.com/BeeR13>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import stream = require('stream');

export as namespace Canvas;

declare class Canvas {
    constructor(width: number, height: number);
    static Image: Canvas.Image
    static Font: Canvas.Font

    width: number
    height: number

    getContext(context_type: "2d"): Canvas.Context2d
    toBuffer(): Buffer
    pngStream(): stream.Stream
}

declare namespace Canvas {
    export interface Font {
        new(name: string, path: string): Font
        
        addFace(path: string, weight: string, style?: string)
    }

    export interface Image extends Function {
        new(): Image

        width: number
        height: number
        src: string|Buffer
        
        onerror: (err) => void
        onload: () => void
    }

    export interface Context2d {
        imageSmoothingEnabled: boolean

        font: string
        fillStyle: string

        addFont(font: Font)
        fillText(text: string, x: number, y: number)
        drawImage(img: Image, x: number, y: number, width: number, height: number)
        strokeRect(x1: number, y1: number, x2: number, y2: number)
        beginPath()
        rect(x1: number, y1: number, x2: number, y2: number)
        fill()

        save(): void
        restore(): void
    }
}

export = Canvas;
