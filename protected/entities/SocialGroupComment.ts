'use strict';

import {SocialGroup} from '@entity/SocialGroup';
import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class SocialGroupComment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 100
    })
    post_id: string;

    @Column({
        type: 'varchar',
        length: 100
    })
    comment_id: string;

    @Column({
        type: 'text'
    })
    comment_text: string;

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

    @Column({
        type: 'integer'
    })
    likes: number;

    @Column({
        type: 'datetime'
    })
    date: Date;

    @ManyToOne((type) => SocialGroup, (group) => group.comments, {
        cascadeInsert: true,
        cascadeUpdate: true,
        eager: true
    })
    group: SocialGroup;
}
