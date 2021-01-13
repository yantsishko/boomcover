'use strict';

import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({
        type: 'varchar',
        unique: true
    })
    message_key: string;

    @CreateDateColumn()
    create_date: Date;
}
