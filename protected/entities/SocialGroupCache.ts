'use strict';

import { Files } from '@component/files';
import {SocialGroup} from '@entity/SocialGroup';
import sha256 = require('crypto-js/sha256');
import * as path from 'path';
import {Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class SocialGroupCache {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne((type) => SocialGroup, (group) => group.cache, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: true
    })
    @JoinColumn()
    group: Promise<SocialGroup>;

    @Column({
        type: 'json'
    })
    data: any;

    @Column({
        type: 'datetime',
        nullable: true
    })
    last_cache_update: Date;

    @CreateDateColumn({
        type: 'datetime',
        nullable: true
    })
    create_date: Date;
}
