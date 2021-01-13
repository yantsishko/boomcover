'use strict';

import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Partner {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    code: string;

    @Column({
        type: 'integer',
        default: 5
    })
    days_count: number;

}
