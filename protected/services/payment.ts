'use strict';

import log from '@component/logger';
import { Log } from '@component/logger';
import config from '@config';
import { Discount } from '@entity/Discount';
import { Payment } from '@entity/Payment';
import { ReferralPayment } from '@entity/ReferralPayment';
import { Subscription } from '@entity/Subscription';
import { DiscountRepository } from '@repository/DiscountRepository';
import { UserService } from '@service/user';
import * as crypto from 'crypto';
import * as moment from 'moment';
import { getCustomRepository, getRepository } from 'typeorm';

export interface KassaParams {
    requestDatetime: string;
    action: 'checkOrder'|'paymentAviso';
    md5: string;
    shopId: string;
    shopArticleId?: string;
    invoiceId: string;
    orderNumber?: string;
    customerNumber: string;
    orderCreatedDatetime?: string;
    orderSumAmount: string;
    orderSumCurrencyPaycash: string;
    orderSumBankPaycash: string;
    paymentPayerCode?: string;
    paymentType?: string;

    groupsCount?: string;
    monthsCount?: string;

    scid: string;
    cdd_pan_mask: string;
    shopSumAmount: string;
    cdd_exp_date: string;
    cdd_rrn: string;
    external_id: string;
    depositNumber: string;
    cps_user_country_code: string;
    sk: string;
    shopSumBankPaycash: string;
    shopSumCurrencyPaycash: string;
    rebillingOn: string;
    cps_region_id: string;
    merchant_order_id: string;
    unilabel: string;
    yandexPaymentId: string;
}

export interface KassaCheckResponse {
    performedDatetime: Date;
    code: number;
    shopId: string;
    invoiceId: string;
    orderSumAmount: string;
    message?: string;
    techMessage?: string;
}

export class PaymentService {

    static async getGroupsCountFromSum(sum: number, monthsCount: number = 1, date?: Date) {
        const activeDiscount: Discount = await getCustomRepository<DiscountRepository>(DiscountRepository).findActive(date ? moment(date) : moment());
        const sumPerMonth: number = (activeDiscount ? sum / (1 - (activeDiscount.percent / 100)) : sum) / monthsCount;
        let price: number = 180;
        if (340 <= sumPerMonth && sumPerMonth <= 680) {
            price = 170;
        } else if (sumPerMonth === 1300 || sumPerMonth > 1350) {
            price = 130;
        } else if (750 <= sumPerMonth && sumPerMonth <= 1350) {
            price = 150;
        }
        return ~~(sumPerMonth / price);
    }

    static async getOriginalSumFromGroupsCount(groupsCount: number, monthsCount: number = 1) {
        let monthSum: number = 0;
        if (groupsCount === 1) {
            monthSum = 180;
        } else if (2 <= groupsCount && groupsCount <= 4) {
            monthSum = groupsCount * 170;
        } else if (5 <= groupsCount && groupsCount <= 9) {
            monthSum = groupsCount * 150;
        } else if (groupsCount >= 10) {
            monthSum = groupsCount * 130;
        }
        return monthSum * monthsCount;
    }

    static async getSumFromGroupsCount(groupsCount: number, monthsCount: number = 1, date?: Date) {
        const totalPrice: number = await this.getOriginalSumFromGroupsCount(groupsCount, monthsCount);
        const activeDiscount: Discount = await getCustomRepository<DiscountRepository>(DiscountRepository).findActive(date ? moment(date) : moment());
        return activeDiscount
            ? totalPrice - (totalPrice * activeDiscount.percent / 100)
            : totalPrice;
    }

    static checkMD5(data: KassaParams) {
        const hash_string = `${data.action};${data.orderSumAmount};${data.orderSumCurrencyPaycash};${data.orderSumBankPaycash};${config.payment.shopId};${data.invoiceId};${data.customerNumber};${config.payment.secret}`;
        const hash = crypto.createHash('md5').update(hash_string).digest('hex').toString().toUpperCase();
        return hash === data.md5;
    }

    static async checkOrder(orderData: KassaParams): Promise<KassaCheckResponse> {
        if (config.payment.demo) {
            Log.PAYMENT.debug(`Check order data: ${JSON.stringify(orderData)}`);
        }
        const response: KassaCheckResponse = {
            performedDatetime: new Date(),
            code: 0,
            shopId: orderData.shopId,
            invoiceId: orderData.invoiceId,
            orderSumAmount: orderData.orderSumAmount
        };
        try {
            if (!this.checkMD5(orderData)) {
                response.code = 1;
                return response;
            }
            const user = await UserService.getUserById(orderData.customerNumber);
            if (!user) {
                response.code = 100;
                response.message = 'Invalid customer ID';
                return response;
            }

            const paymentRepository = getRepository(Payment);
            let payment = await paymentRepository.findOne({
                transaction_id: orderData.invoiceId.toString()
            });
            if (!payment) {
                payment = new Payment();
            }
            payment.approved = false;
            payment.user = user;
            payment.amount = parseInt(orderData.orderSumAmount, 10);
            payment.months_count = parseInt(orderData.monthsCount, 10) || 1;
            payment.groups_count = await this.getGroupsCountFromSum(
                payment.amount,
                payment.months_count,
                moment(orderData.orderCreatedDatetime.replace(/\s/, '+')).toDate()
            );
            payment.transaction_id = orderData.invoiceId.toString();
            await paymentRepository.save(payment);
        } catch (err) {
            Log.PAYMENT.error(`Received error in payment check:\nOrder data: ${JSON.stringify(orderData)}\n${err}`);
            response.code = 100;
        }
        if (config.payment.demo) {
            Log.PAYMENT.debug(`Check order response: ${JSON.stringify(response)}`);
        }
        return response;
    }

    static async avisoOrder(orderData: KassaParams): Promise<KassaCheckResponse> {
        if (config.payment.demo) {
            Log.PAYMENT.debug(`Aviso order data: ${JSON.stringify(orderData)}`);
        }
        const response: KassaCheckResponse = {
            performedDatetime: new Date(),
            code: 0,
            shopId: orderData.shopId,
            invoiceId: orderData.invoiceId,
            orderSumAmount: orderData.orderSumAmount
        };

        try {
            if (!this.checkMD5(orderData)) {
                response.code = 1;
                return response;
            }
            const paymentRepository = getRepository(Payment);
            const payment = await paymentRepository.findOne({
                where: {
                    transaction_id: orderData.invoiceId.toString()
                }
            });
            if (!payment) {
                response.code = 200;
                response.message = 'Invalid invoiceId';
                return response;
            }
            payment.approved = true;

            await UserService.subscribe(payment.user, payment.groups_count, payment.months_count * 30);

            await paymentRepository.save(payment);

            const referralParent = await payment.user.referral_parent;
            if (referralParent) {
                const referralPayment = new ReferralPayment();
                referralPayment.user = referralParent;
                referralPayment.payed = false;
                referralPayment.payment = payment;
                referralPayment.amount = payment.amount * (await referralParent.getReferralPercent()) / 100;
                await getRepository(ReferralPayment).save(referralPayment);
            }

        } catch (err) {
            Log.PAYMENT.error(`Received error in payment aviso:\nOrder data: ${JSON.stringify(orderData)}\n${err}`);
            response.code = 100;
        }
        if (config.payment.demo) {
            Log.PAYMENT.debug(`Aviso order response: ${JSON.stringify(response)}`);
        }
        return response;
    }
}
