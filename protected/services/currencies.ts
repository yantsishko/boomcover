'use strict';

import cache from '@component/cache';
import log from '@component/logger';
import sha256 = require('crypto-js/sha256');
import * as rp from 'request-promise';

export interface Currency {
    currencyName: string;
    currencySymbol: string;
    id: string;
    value?: number;
}

export interface Currencies {
    [currencyKey: string]: Currency;
}

export class CurrencyService {

    static url: string = 'http://free.currencyconverterapi.com/api/v3/';

    static async getCurrencies(): Promise<Currencies> {
        const cache_key = 'currencies';
        let value: Currencies = cache.get(cache_key);
        if (value !== undefined) {
            return value;
        }
        const URI = `${this.url}currencies`;

        try {
            value = JSON.parse(await rp.get(URI)).results;

            const currencies_codes_top = [
                'USD',
                'EUR',
                'RUB',
                'BYR'
            ];
            let currencies_keys = Object.keys(value).filter((currency_name: string) => !['ALL'].includes(currency_name));
            // Sort by currencies_codes_top and then in alphabetic order
            currencies_keys = currencies_keys.sort((a, b) => {
                const indexOfA = currencies_codes_top.indexOf(a);
                const indexOfB = currencies_codes_top.indexOf(b);
                if (indexOfA >= 0 && indexOfB >= 0) {
                    return indexOfA > indexOfB ? 1 : -1;
                } else if (indexOfA >= 0) {
                    return -1;
                } else if (indexOfB >= 0) {
                    return 1;
                }
                if (a > b) {
                    return 1;
                } else if (b > a) {
                    return -1;
                }
                return 0;
            });

            const currencies: Currencies = {};
            currencies_keys.forEach((currency_key: string) => {
                if (currency_key === 'BYR') {
                    currencies.BYN = value.BYR;
                    currencies.BYN.id = 'BYN';
                } else {
                    currencies[currency_key] = value[currency_key];
                }
            });
            currencies.RUB.currencySymbol = '₽';
            cache.set(cache_key, currencies, 360000);

            return currencies;
        } catch (error) {
            if (error.name === 'StatusCodeError') {
                log.error('Currencies error: ', URI, error.message);
            } else {
                log.error('Currencies error: ', error);
            }
            return null;
        }
    }

    static async getCurrenciesCodes() {
        const currencies = await this.getCurrencies();
        return Object.keys(currencies);
    }

    static async getCurrency(code: string) {
        const currencies = await this.getCurrencies();
        return currencies[code];
    }

    static async convertCurrency(from: string, to: string): Promise<number> {
        const CUR_ID = `${from}_${to}`;
        let value: number = cache.get(CUR_ID);
        if (value !== undefined) {
            return value;
        }
        const URI = `${this.url}convert?q=${CUR_ID}`;
        try {
            value = JSON.parse(await rp.get(URI)).results[CUR_ID].val;
            cache.set(CUR_ID, value);
            return value;
        } catch (error) {
            if (error.name === 'StatusCodeError') {
                log.error('Currencies error: ', URI, error.message);
            } else {
                log.error('Currencies error: ', error);
            }
            return null;
        }
    }
}
