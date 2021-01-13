import config from '@config';
import DB from '@db';
import { Discount } from '@entity/Discount';
import { Payment } from '@entity/Payment';
import { ReferralPayment } from '@entity/ReferralPayment';
import { SocialGroup } from '@entity/SocialGroup';
import { Subscription } from '@entity/Subscription';
import { DiscountRepository } from '@repository/DiscountRepository';
import { KassaParams, PaymentService } from '@service/payment';
import { UserService } from '@service/user';
import { expect, use } from 'chai';
import chaiDateTime = require('chai-datetime');
import * as moment from 'moment';
import * as supertest from 'supertest';
import { getCustomRepository, getRepository } from 'typeorm';
import app from '../app';
import { getTestKassaParams } from './helper';

use(chaiDateTime);

describe('Payment', () => {

    describe('Price', () => {
        it('Get groups count from sum', async () => {
            let response = await supertest(app)
                .get('/api/v1/payment/groups/1/1300');
            expect(response.status).eq(200);
            expect(response.body).deep.eq({
                groups: 10
            });

            response = await supertest(app)
                .get('/api/v1/payment/groups/1/1350');
            expect(response.status).eq(200);
            expect(response.body).deep.eq({
                groups: 9
            });

            response = await supertest(app)
                .get('/api/v1/payment/groups/1/340');
            expect(response.status).eq(200);
            expect(response.body).deep.eq({
                groups: 2
            });

            response = await supertest(app)
                .get('/api/v1/payment/groups/2/360');
            expect(response.status).eq(200);
            expect(response.body).deep.eq({
                groups: 1
            });
        });
        it('Get groups count from sum with discount', async () => {
            const discountRepository: DiscountRepository = getCustomRepository<DiscountRepository>(DiscountRepository);

            const discount: Discount = new Discount();
            discount.from = moment().subtract(5, 'days').toDate();
            discount.to = moment().add(5, 'days').toDate();
            discount.percent = 10;
            await discountRepository.save(discount);

            let response = await supertest(app)
                .get('/api/v1/payment/groups/1/1170');
            expect(response.status).eq(200);
            expect(response.body).deep.eq({
                groups: 10
            });

            response = await supertest(app)
                .get('/api/v1/payment/groups/1/1215');
            expect(response.status).eq(200);
            expect(response.body).deep.eq({
                groups: 9
            });

            response = await supertest(app)
                .get('/api/v1/payment/groups/1/306');
            expect(response.status).eq(200);
            expect(response.body).deep.eq({
                groups: 2
            });

            response = await supertest(app)
                .get('/api/v1/payment/groups/2/324');
            expect(response.status).eq(200);
            expect(response.body).deep.eq({
                groups: 1
            });

            await discountRepository.delete({});
        });
        it('Get price from groups count', async () => {
            let response = await supertest(app)
                .get('/api/v1/payment/price/1/10');
            expect(response.status).eq(200);
            expect(response.body).deep.eq({
                original_price: 1300,
                price: 1300
            });

            response = await supertest(app)
                .get('/api/v1/payment/price/1/9');
            expect(response.status).eq(200);
            expect(response.body).deep.eq({
                original_price: 1350,
                price: 1350
            });

            response = await supertest(app)
                .get('/api/v1/payment/price/3/5');
            expect(response.status).eq(200);
            expect(response.body).deep.eq({
                original_price: 2250,
                price: 2250
            });

            response = await supertest(app)
                .get('/api/v1/payment/price/7/10');
            expect(response.status).eq(200);
            expect(response.body).deep.eq({
                original_price: 9100,
                price: 9100
            });
        });
        it('Get price from groups count with discount', async () => {
            const discountRepository: DiscountRepository = getCustomRepository<DiscountRepository>(DiscountRepository);

            const fakeDiscount: Discount = new Discount();
            fakeDiscount.from = moment().subtract(10, 'days').toDate();
            fakeDiscount.to = moment().subtract(2, 'days').toDate();
            fakeDiscount.percent = 30;
            await discountRepository.save(fakeDiscount);

            const discount: Discount = new Discount();
            discount.from = moment().subtract(5, 'days').toDate();
            discount.to = moment().add(5, 'days').toDate();
            discount.percent = 10;
            await discountRepository.save(discount);

            let response = await supertest(app)
                .get('/api/v1/payment/price/1/10');
            expect(response.status).eq(200);
            expect(response.body).deep.eq({
                original_price: 1300,
                price: 1170
            });

            const secondDiscount: Discount = new Discount();
            secondDiscount.from = moment().subtract(2, 'days').toDate();
            secondDiscount.to = moment().add(2, 'days').toDate();
            secondDiscount.percent = 15;
            await discountRepository.save(secondDiscount);

            response = await supertest(app)
                .get('/api/v1/payment/price/1/10');
            expect(response.status).eq(200);
            expect(response.body).deep.eq({
                original_price: 1300,
                price: 1105
            });

            const lastDayDiscount: Discount = new Discount();
            lastDayDiscount.from = moment().subtract(2, 'days').toDate();
            lastDayDiscount.to = moment().toDate();
            lastDayDiscount.percent = 20;
            await discountRepository.save(lastDayDiscount);

            response = await supertest(app)
                .get('/api/v1/payment/price/1/10');
            expect(response.status).eq(200);
            expect(response.body).deep.eq({
                original_price: 1300,
                price: 1040
            });

            await discountRepository.delete({});
        });
    });

    describe('Check Order', () => {
        it('Invalid MD5', async () => {
            const orderData: KassaParams = {
                action: 'checkOrder',
                shopId: config.payment.shopId,
                scid: config.payment.scid,
                customerNumber: '1',
                cdd_pan_mask: '444444|4448',
                orderNumber: '38',
                paymentType: 'AC',
                invoiceId: '2000000833650',
                shopSumAmount: '750.00',
                md5: 'Invalid',
                orderSumAmount: '3200.00',
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
            const orderResponse = await PaymentService.checkOrder(orderData);
            expect(orderResponse.code).to.be.eq(1);
        });
        it('Invalid customer ID', async () => {
            const orderData: KassaParams = {
                action: 'checkOrder',
                shopId: config.payment.shopId,
                scid: config.payment.scid,
                customerNumber: '22',
                cdd_pan_mask: '444444|4448',
                orderNumber: '38',
                paymentType: 'AC',
                invoiceId: '2000000833650',
                shopSumAmount: '750.00',
                md5: 'C876B9A1CEEC3B13606B5D55A836F938',
                orderSumAmount: '3200.00',
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
            const orderResponse = await PaymentService.checkOrder(orderData);
            expect(orderResponse.code).to.be.eq(100);
            expect(orderResponse.message).to.be.eq('Invalid customer ID');
        });
        it('With discount', async () => {
            const discountRepository: DiscountRepository = getCustomRepository<DiscountRepository>(DiscountRepository);

            const discount: Discount = new Discount();
            discount.from = new Date(2016, 5, 1);
            discount.to = new Date(2016, 12, 31);
            discount.percent = 10;
            await discountRepository.save(discount);

            const orderResponse = await PaymentService.checkOrder(getTestKassaParams('2000000833651', 'checkOrder', '2', 2880));
            expect(orderResponse.code).to.be.eq(0);
            expect(orderResponse.shopId).to.be.eq(config.payment.shopId);
            expect(orderResponse.invoiceId).to.be.eq('2000000833651');
            expect(orderResponse.orderSumAmount).to.be.eq('2880.00');

            const paymentRepository = getRepository(Payment);
            expect(await paymentRepository.count()).to.be.eq(1);
            const payment = await paymentRepository.findOne();
            expect(payment.groups_count).to.be.eq(24);
            expect(payment.approved).to.be.eq(false);
            expect(payment.months_count).to.be.eq(1);
            expect(payment.amount).to.be.eq(2880);

            await discountRepository.delete({});
            await paymentRepository.delete({});
        });
        it('Without discount', async () => {
            const orderResponse = await PaymentService.checkOrder(getTestKassaParams('2000000833650', 'checkOrder', '1', 3200));
            expect(orderResponse.code).to.be.eq(0);
            expect(orderResponse.shopId).to.be.eq(config.payment.shopId);
            expect(orderResponse.invoiceId).to.be.eq('2000000833650');
            expect(orderResponse.orderSumAmount).to.be.eq('3200.00');

            const paymentRepository = getRepository(Payment);
            expect(await paymentRepository.count()).to.be.eq(1);
            const payment = await paymentRepository.findOne();
            expect(payment.groups_count).to.be.eq(24);
            expect(payment.approved).to.be.eq(false);
            expect(payment.months_count).to.be.eq(1);
            expect(payment.amount).to.be.eq(3200);
        });
    });

    describe('Aviso', () => {
        it('Invalid', async () => {
            const orderData: KassaParams = {
                action: 'paymentAviso',
                shopId: config.payment.shopId,
                scid: config.payment.scid,
                customerNumber: '1',
                cdd_pan_mask: '444444|4448',
                orderNumber: '38',
                paymentType: 'AC',
                invoiceId: '2000000833650',
                shopSumAmount: '750.00',
                md5: 'Invalid',
                orderSumAmount: '3200.00',
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
            const orderResponse = await PaymentService.avisoOrder(orderData);
            expect(orderResponse.code).to.be.eq(1);
        });
        it('Valid', async () => {
            const orderResponse = await PaymentService.avisoOrder(getTestKassaParams('2000000833650', 'paymentAviso', '1', 3200));
            expect(orderResponse.code).to.be.eq(0);
            expect(orderResponse.shopId).to.be.eq(config.payment.shopId);
            expect(orderResponse.invoiceId).to.be.eq('2000000833650');
            expect(orderResponse.orderSumAmount).to.be.eq('3200.00');

            const paymentRepository = getRepository(Payment);
            expect(await paymentRepository.count()).to.be.eq(1);
            const payment = await paymentRepository.findOne();
            expect(payment.groups_count).to.be.eq(24);
            expect(payment.approved).to.be.eq(true);
            expect(payment.months_count).to.be.eq(1);
            expect(payment.amount).to.be.eq(3200);

            const subscriptionRepository = getRepository(Subscription);
            expect(await subscriptionRepository.count()).to.be.eq(6);
            const now = moment().utcOffset(0).startOf('day');
            const subscription = await subscriptionRepository.findOneById(6);
            expect(subscription.amount).to.be.eq(24);
            expect(subscription.user.id).to.be.eq(1);
            expect(subscription.isActive()).to.be.eq(true);
            expect(subscription.start_date).to.be.equalDate(now.toDate());
            expect(subscription.end_date).to.be.equalDate(now.clone().add(30, 'days').toDate());
        });
    });

    describe('After payment checks', () => {
        it('Upayed groups unconnecting', async () => {
            const groupRepository = getRepository(SocialGroup);
            await  UserService.unconnectUnpayedGroups();

            expect(await groupRepository.count({where: {connected: true, user: 1}})).to.be.eq(5);
            expect(await groupRepository.count({where: {connected: true, user: 3}})).to.be.eq(1);
            expect(await groupRepository.count({where: {connected: false, user: 3}})).to.be.eq(9);

            const thirdUserGroups = await groupRepository.find({
                where: {
                    user: 3
                },
                order: {
                    members: 'DESC'
                }
            });
            expect(thirdUserGroups[0].connected).to.be.eq(true);
            expect(thirdUserGroups[1].connected).to.be.eq(false);
        });

        it('Create referral payment', async () => {
            await PaymentService.checkOrder(getTestKassaParams('2000000833651', 'checkOrder', '5', 3200));
            await PaymentService.avisoOrder(getTestKassaParams('2000000833651', 'paymentAviso', '5', 3200));

            const referralPaymentRepository = getRepository(ReferralPayment);
            expect(await referralPaymentRepository.count()).to.be.eq(1);
            const referralPayment = await referralPaymentRepository.findOneById(1);
            expect(referralPayment.amount).to.be.eq(320);
            expect(referralPayment.user.id).to.be.eq(1);
            expect(referralPayment.payment.id).to.be.eq(3);
            expect(referralPayment.payed).to.be.eq(false);
            expect(await referralPayment.user.getReferralStats()).to.be.deep.eq({
                payments: 1,
                percent: 10,
                registrations: 1,
                sum: 320,
                unpayedSum: 320
            });
        });
    });
});
