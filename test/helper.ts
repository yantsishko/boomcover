import config from '@config';
import { KassaParams } from '@service/payment';
import * as crypto from 'crypto';
import { createHash } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

export function saveCoverToTMP(name: string, filePath: string): void {
    fs.writeFileSync(path.join(__dirname, '..', 'protected', 'runtime', 'tmp', name), fs.readFileSync(filePath));
}

export function getHashFromFile(filePath: string): string {
    return crypto
        .createHash('sha256')
        .update(fs.readFileSync(filePath).toString('base64'))
        .digest('hex')
        .toString()
        .toUpperCase();
}

export function createPaymentMD5(data: KassaParams): string {
    const hash_string = `${data.action};${data.orderSumAmount};${data.orderSumCurrencyPaycash};${data.orderSumBankPaycash};${config.payment.shopId};${data.invoiceId};${data.customerNumber};${config.payment.secret}`;
    return createHash('md5').update(hash_string).digest('hex').toString().toUpperCase();
}

export function getTestKassaParams(
    invoiceId: string,
    action: 'checkOrder'|'paymentAviso',
    userId: string,
    sum: number
): KassaParams {
    const data: KassaParams = {
        action,
        shopId: config.payment.shopId,
        scid: config.payment.scid,
        customerNumber: userId,
        cdd_pan_mask: '444444|4448',
        orderNumber: '38',
        paymentType: 'AC',
        invoiceId,
        shopSumAmount: '750.00',
        md5: 'Invalid',
        orderSumAmount: sum.toFixed(2),
        cdd_exp_date: '1217',
        paymentPayerCode: '4100322062290',
        cdd_rrn: '',
        external_id: 'deposit',
        requestDatetime: '2016-07-11T15:29:35.438 03:00',
        depositNumber: 'tNGTnJmP7sPdWnPiSeOXLUFLB5MZ.001f.201607',
        cps_user_country_code: 'PL',
        orderCreatedDatetime: '2016-07-11T15:29:35.360 03:00',
        sk: 'yed009c9df4e4f0a47d15e20d4af3231e',
        shopSumBankPaycash: '1003',
        shopSumCurrencyPaycash: '10643',
        rebillingOn: 'false',
        orderSumBankPaycash: '1003',
        cps_region_id: '213',
        orderSumCurrencyPaycash: '10643',
        merchant_order_id: '38_110716152918_00000_64759',
        unilabel: '1f15a4dd-0009-5000-8000-0000116d476c',
        yandexPaymentId: '2570052456918'
    };
    data.md5 = createPaymentMD5(data);
    return data;
}
