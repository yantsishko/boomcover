'use strict';

import cache from '@component/cache';
import log from '@component/logger';
import { XMLParser } from '@component/xml';
import sha256 = require('crypto-js/sha256');
import * as moment from 'moment';
import * as rp from 'request-promise';

export interface ITrafficData {
    level: number;
}

export class TrafficService {

    static async getTraffic(region: number): Promise<ITrafficData> {
        const cache_key = sha256(`traffic_${region}`).toString();
        let value = cache.get(cache_key);
        if (value !== undefined) {
            return value;
        }
        const URI = `${this.trafficURL}${region}`;

        try {
            const data = await XMLParser.parseFromUrl(URI);
            if (!data.info.traffic
                || !data.info.traffic[0].region
                || !data.info.traffic[0].region[0].level
                || !data.info.traffic[0].region[0].level[0]
            ) {
                log.warn(`No traffic data for region ${region}`);
                return null;
            }
            value = {
                level: parseInt(data.info.traffic[0].region[0].level[0], 10)
            };
            cache.set(cache_key, value, 300);
            return value;
        } catch (error) {
            if (error.name === 'StatusCodeError') {
                log.error('Traffic error: ', URI, error.message);
            } else {
                log.error('Traffic error: ', error);
            }
            return null;
        }
    }

    private static readonly regionsURL: string = 'https://yandex.ru/yaca/geo.c2n';

    private static readonly trafficURL: string = 'https://export.yandex.ru/bar/reginfo.xml?region=';
}
