'use strict';

import { ReferralPayment } from '@entity/ReferralPayment';
import { User } from '@entity/User';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Payment {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => User, (user) => user.payments, {
        cascadeInsert: true,
        cascadeUpdate: true,
        eager: true
    })
    user: User;

    @Column('varchar')
    transaction_id: string;

    @Column('integer')
    amount: number;

    @Column('integer')
    groups_count: number;

    @Column('integer')
    months_count: number;

    @Column()
    approved: boolean;

    @CreateDateColumn({
        type: 'datetime'
    })
    create_date: Date;

    @OneToMany((type) => ReferralPayment, (refferal_payment) => refferal_payment.payment, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: true
    })
    referral_payments: Promise<ReferralPayment>;

    toObject() {
        return {
            id: this.id,
            transaction_id: this.id,
            amount: this.amount,
            create_date: this.create_date
        };
    }
}
