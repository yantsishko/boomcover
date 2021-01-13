'use strict';

import { Cover } from '@entity/Cover';
import { SocialGroupCache } from '@entity/SocialGroupCache';
import { SocialGroupComment } from '@entity/SocialGroupComment';
import { SocialGroupLike } from '@entity/SocialGroupLike';
import { SocialGroupRepost } from '@entity/SocialGroupRepost';
import { User } from '@entity/User';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

export interface SocialGroupObject {
    id: number;
    social_id: string;
    title: string;
    members: number;
    updates: number;
    img: string;
    is_closed: boolean;
    connected: boolean;
}

@Entity()
export class SocialGroup {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => User, (user) => user.social_groups, {
        cascadeInsert: true,
        cascadeUpdate: true,
        eager: true
    })
    user: User;

    @Column({
        type: 'varchar',
        length: 100
    })
    social_id: string;

    @Column({
        type: 'varchar',
        length: 150,
        nullable: true
    })
    access_token: string;

    @Column({
        type: 'varchar',
        nullable: true
    })
    social_server_id: string;

    @Column({
        type: 'datetime',
        nullable: true
    })
    expires_in: Date;

    @Column({
        type: 'varchar',
        length: 150
    })
    title: string;

    @Column({
        type: 'varchar'
    })
    img: string;

    @Column({
        type: 'integer',
        default: 0
    })
    members: number;

    @Column({
        default: false
    })
    is_closed: boolean;

    @Column({
        default: false
    })
    need_captcha: boolean;

    @Column({
        nullable: true,
    })
    set_captcha: number;

    @Column({
        type: 'varchar'
    })
    group_type: string;

    @Column({
        default: false
    })
    connected: boolean;

    @OneToOne((type) => Cover, (cover) => cover.group, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: true
    })
    @JoinColumn()
    cover: Promise<Cover>;

    @OneToMany((type) => SocialGroupComment, (comment) => comment.group, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: true
    })
    comments: Promise<SocialGroupComment[]>;

    @OneToMany((type) => SocialGroupRepost, (repost) => repost.group, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: true
    })
    reposts: Promise<SocialGroupRepost[]>;

    @OneToMany((type) => SocialGroupLike, (like) => like.group, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: true
    })
    likes: Promise<SocialGroupLike[]>;

    @OneToOne((type) => SocialGroupCache, (cache) => cache.group, {
        cascadeInsert: true,
        cascadeUpdate: false,
        lazy: true
    })
    cache: Promise<SocialGroupCache>;

    toObject(): SocialGroupObject {
        return {
            id: this.id,
            social_id: this.social_id,
            title: this.title,
            members: this.members,
            updates: 0,
            img: this.img,
            is_closed: this.is_closed,
            connected: this.connected
        };
    }
}
