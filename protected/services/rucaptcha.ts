'use strict';

import { Log } from '@component/logger';
import config from '@config';
import fetch from 'node-fetch';
import * as querystring from 'querystring';
import * as rp from 'request-promise';
import * as sleep from 'system-sleep';

export class RuCaptcha {
    static readonly IN_URI = 'http://rucaptcha.com/in.php';
    static readonly RES_URI = 'http://rucaptcha.com/res.php';

    static async getCaptcha(captcha_url: string) {
        const base64 = await this.getBase64FromImage(captcha_url);
        const res = JSON.parse(await rp.post({
            url: this.IN_URI,
            formData: {
                method: 'base64',
                key: config.rucaptcha.token,
                body: base64,
                numeric: 4,
                json: 1
            }
        }));
        let captcha: string = null;

        if (res.status === 1) {
            while (captcha === null) {
                sleep(5000);
                const check_res = JSON.parse(
                    await rp.get(this.RES_URI + '?' + querystring.stringify({
                        key: config.rucaptcha.token,
                        action: 'get',
                        id: res.request,
                        json: 1
                    }))
                );
                if (check_res.status === 1) {
                    captcha = check_res.request;
                } else if (check_res.request !== 'CAPCHA_NOT_READY') {
                    switch (check_res.request) {
                        case 'ERROR_NO_SLOT_AVAILABLE':
                            continue;
                    }
                    Log.CAPTCHA.error(check_res.request);
                    return null;
                }
            }
            return {
                captcha_id: res.request as string,
                captcha
            };
        } else {
            Log.CAPTCHA.error(res.request);
        }
        return null;
    }

    static async report(captcha_id: string) {
        const res = JSON.parse(
            await rp.get(this.RES_URI + '?' + querystring.stringify({
                key: config.rucaptcha.token,
                action: 'reportbad',
                id: captcha_id,
                json: 1
            }))
        );
        if (res.status !== 1) {
            Log.CAPTCHA.error('Captcha report errror: ', res.request);
        }
        return res.status === 1;
    }

    static async getBase64FromImage(captcha_url: string): Promise<string> {
        const res = await fetch(captcha_url);
        const buffer = await res.buffer();
        return buffer.toString('base64');
    }
}
