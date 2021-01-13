'use strict';

import { SocialGroup } from '@entity/SocialGroup';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SocialGroupLike {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 100
    })
    post_id: string;

    @Column({
        type: 'varchar'
    })
    user_social_id: string;

    @Column({
        type: 'varchar'
    })
    user_photo: string;

    @Column({
        type: 'varchar'
    })
    user_first_name: string;

    @Column({
        type: 'varchar'
    })
    user_last_name: string;

    @CreateDateColumn({
        type: 'datetime',
        nullable: true
    })
    create_date: Date;

    @ManyToOne((type) => SocialGroup, (group) => group.likes, {
        cascadeInsert: true,
        cascadeUpdate: true,
        eager: true
    })
    group: SocialGroup;
}
