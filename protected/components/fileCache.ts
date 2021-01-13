import sha256 = require('crypto-js/sha256');
import * as fs from 'fs';
import * as moment from 'moment';
import { Files } from './files';

export default class FileCache {
    static readonly CACHE_PATH = `${__dirname}/../runtime/cache`;

    static createKeyFromString(stringToMakeKey: string) {
        return sha256(stringToMakeKey).toString();
    }

    static getFilePathFromKey(key: string) {
        return this.getDirPathFromKey(key) + '/' + key + '.cache';
    }

    static getDirPathFromKey(key: string) {
        if (key.length > 4) {
            return `${this.CACHE_PATH}/${key.slice(0, 2)}/${key.slice(2, 4)}`;
        }
        return `${this.CACHE_PATH}`;
    }

    static get(key: string) {
        const filename = this.getFilePathFromKey(key);
        if (fs.existsSync(filename)) {
            try {
                const stringValue = fs.readFileSync(filename).toString();
                const value = JSON.parse(stringValue);
                if (value.expired >= moment().unix()) {
                    return value.value;
                }
            // tslint:disable-next-line:no-empty
            } catch (e) {}
            fs.unlinkSync(filename);
            return undefined;
        }
        return undefined;
    }

    static set(key: string, value: any, ttl: number = 3600) {
        Files.mkDir(this.getDirPathFromKey(key));
        const filename = this.getFilePathFromKey(key);
        const valueToCache = {
            expired: moment().unix() + ttl,
            value
        };
        fs.writeFileSync(filename, JSON.stringify(valueToCache));
    }
}
