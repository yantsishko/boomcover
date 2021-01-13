'use strict';

import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Discount {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'integer',
        default: 0
    })
    percent: number;

    @Column({
        type: 'date'
    })
    from: Date;

    @Column({
        type: 'date'
    })
    to: Date;

}
