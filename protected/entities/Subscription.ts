'use strict';

import {User} from '@entity/User';
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';

import * as moment from 'moment';

export interface SubscriptionObject {
    id: number;
    amount: number;
    start_date: Date;
    end_date: Date;
}

@Entity()
export class Subscription {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => User, (user) => user.subscriptions, {
        cascadeInsert: true,
        cascadeUpdate: true,
        eager: true
    })
    user: User;

    @Column('integer')
    amount: number;

    @Column({
        type: 'datetime'
    })
    start_date: Date;

    @Column({
        type: 'datetime'
    })
    end_date: Date;

    @CreateDateColumn({
        type: 'datetime'
    })
    create_date: Date;

    isActive() {
        const now = moment().utcOffset(0);
        const start_date = moment(this.start_date);
        const end_date = moment(this.end_date);

        return now.isBetween(start_date, end_date, 'day', '[]');
    }

    toObject(): SubscriptionObject {
        return {
            id: this.id,
            amount: this.amount,
            start_date: this.start_date,
            end_date: this.end_date
        };
    }
}
