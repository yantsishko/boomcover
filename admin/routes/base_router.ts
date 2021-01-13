'use strict';

import config from '@config';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

export class BaseRoute {

    protected static get logFiles() {
        return fs.readdirSync(config.admin.logs_path)
            .filter((name) => /.*\.json$/.test(name))
            .map((name) => name.replace('.json', ''));
    }

    protected static escapeHtml(str) {
        return String(str).replace(/[&<>"'`=\/]/g, (s) => {
            return this.entityMap[s];
        });
    }

    private static entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
}
