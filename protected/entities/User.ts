'use strict';

import { Payment } from '@entity/Payment';
import { ReferralPayment } from '@entity/ReferralPayment';
import { SocialGroup, SocialGroupObject } from '@entity/SocialGroup';
import { Subscription, SubscriptionObject } from '@entity/Subscription';
import { VK, VKPermissions } from '@service/vk';
import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    getRepository,
    Index,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';

export interface UserObject {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    img: string;
    email: string;
    groups_count: number;
    connected_groups_count: number;
    available_group_count: number;
    social_groups?: SocialGroupObject[];
    transactions?: SubscriptionObject[];
    permissions: VKPermissions;
    referral_code: string;
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        nullable: true
    })
    firstName: string;

    @Column({
        type: 'varchar',
        nullable: true
    })
    lastName: string;

    @Column({
        type: 'varchar',
        nullable: true
    })
    img: string;

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    @Column({
        type: 'varchar',
        length: 150,
        nullable: true
    })
    email: string;

    @Column({
        type: 'integer',
        default: 0
    })
    free_groups: number;

    @Column('varchar')
    vk_id: string;

    @Column({
        type: 'varchar',
        unique: true
    })
    vk_token: string;

    @Column({
        type: 'varchar',
        length: 100
    })
    token: string;

    @OneToMany((type) => SocialGroup, (social_group) => social_group.user, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: true
    })
    social_groups: Promise<SocialGroup[]>;

    @OneToMany((type) => Subscription, (subscription) => subscription.user, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: true
    })
    subscriptions: Promise<Subscription[]>;

    @OneToMany((type) => Payment, (payment) => payment.user, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: true
    })
    payments: Promise<Payment[]>;

    @OneToMany((type) => ReferralPayment, (refferal_payment) => refferal_payment.user, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: true
    })
    referral_payments: Promise<ReferralPayment>;

    @CreateDateColumn({
        type: 'datetime',
        nullable: true
    })
    registration_date: Date;

    @ManyToOne((type) => User, (user) => user.referral_user, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: true
    })
    referral_parent: Promise<User>;

    @OneToMany((type) => User, (user) => user.referral_parent, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: true
    })
    referral_user: Promise<User>;

    @Column({
        type: 'varchar',
        nullable: true
    })
    @Index({
        unique: true
    })
    referral_code: string;

    @BeforeInsert()
    genReferralCode() {
        this.referral_code = `ref${this.vk_id}`.replace(/\s/g, '');
    }

    async connectedGroupsCount(): Promise<number> {
        return (await this.social_groups)
            .filter((social_group) => social_group.connected)
            .length;
    }

    /**
     * Returns percent of user refferal payment
     */
    async getReferralPercent(): Promise<number> {
        const payments = await this.payments;
        let payedMonthsCount = 0;
        for (const payment of payments) {
            if (payment.approved) {
                payedMonthsCount += payment.months_count;
            }
        }
        if (payedMonthsCount === 0) {
            return 5;
        } else if (payedMonthsCount <= 4) {
            return 10;
        }
        return 15;
    }

    async getReferralStats() {
        const userRepository = getRepository(User);
        const referralPaymentRepository = getRepository(ReferralPayment);
        const registrations = await userRepository.count({
            where: {
                referral_parent: this.id
            }
        });
        const referralPayments = await referralPaymentRepository.find({
            where: {
                user: this.id
            }
        });
        let sum = 0;
        let unpayedSum = 0;
        for (const referralPayment of referralPayments) {
            sum += referralPayment.amount;
            if (!referralPayment.payed) {
                unpayedSum += referralPayment.amount;
            }
        }
        return {
            percent: await this.getReferralPercent(),
            registrations,
            payments: referralPayments.length,
            sum,
            unpayedSum
        };
    }

    async availableActiveGroupsCount(): Promise<number> {
        return (await this.subscriptions)
            .filter((subscription) => subscription.isActive())
            .map((item) => item.amount)
            .reduce((prev, curr) => {
                return prev + curr;
            }, this.free_groups);
    }

    async toObject(with_relations: boolean = false): Promise<UserObject> {
        const data: UserObject = {
            id: this.id,
            first_name: this.firstName,
            last_name: this.lastName,
            full_name: this.fullName,
            img: this.img,
            email: this.email,
            groups_count: (await this.social_groups).length,
            connected_groups_count: await this.connectedGroupsCount(),
            available_group_count: await this.availableActiveGroupsCount(),
            permissions: await VK.getAppPermissions(this),
            referral_code: this.referral_code
        };
        data.transactions = (await this.subscriptions)
            .filter((subscription) => subscription.isActive())
            .map((subscription) => subscription.toObject());
        if (with_relations) {
            data.social_groups = (await this.social_groups).map((social_group) => social_group.toObject());
        }
        return data;
    }
}
