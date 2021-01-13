'use strict';

import {Response} from 'express';
import * as fs from 'fs';
import * as path from 'path';

export class BaseRoute {

    static renderError(res: Response, message: string) {
        const style = fs.readFileSync(path.join(__dirname, '..', 'views', 'error.css'));

        res.render('error', {
            title: 'Something went wrong',
            style,
            message
        });
    }

}
