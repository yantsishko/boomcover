import sha256 = require('crypto-js/sha256');
import * as rp from 'request-promise';
import * as validUrl from 'valid-url';
import cache from './cache';

export class RequestHelper {
    static async get(url: string, ttl: number = 300) {
        if (!validUrl.isWebUri(url)) {
            return null;
        }
        const cacheKey = sha256(url).toString();
        let value = cache.get(cacheKey);
        if (value !== undefined) {
            return value;
        }
        try {
            const response = await rp.get(url);
            value = response.slice(0, 100);
            cache.set(cacheKey, value, ttl);
        // tslint:disable-next-line:no-empty
        } catch (e) {}
        return value;
    }
}
