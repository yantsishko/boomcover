'use strict';

import { Payment } from '@entity/Payment';
import { User } from '@entity/User';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class ReferralPayment {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => User, (user) => user.referral_payments, {
        cascadeInsert: true,
        cascadeUpdate: true,
        eager: true
    })
    user: User;

    @ManyToOne((type) => Payment, (payment) => payment.referral_payments, {
        cascadeInsert: true,
        cascadeUpdate: true,
        eager: true
    })
    payment: Payment;

    @Column('integer')
    amount: number;

    @Column({
        default: false
    })
    payed: boolean;

    @CreateDateColumn({
        type: 'datetime'
    })
    create_date: Date;
}
