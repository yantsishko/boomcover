'use strict';

import { Files } from '@component/files';
import {SocialGroup} from '@entity/SocialGroup';
import sha256 = require('crypto-js/sha256');
import * as path from 'path';
import {Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Cover {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne((type) => SocialGroup, (group) => group.cover, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: true
    })
    group: Promise<SocialGroup>;

    @Column({
        type: 'json'
    })
    settings: any;

    @Column({
        type: 'json'
    })
    cached_data: any;

    @Column({
        type: 'datetime',
        nullable: true
    })
    last_cache_update: Date;

    @Column({
        type: 'varchar',
        nullable: true
    })
    last_convert_hash: string;

    @Column({
        type: 'varchar',
        default: '/protected/covers/default_cover.png'
    })
    input_img: string;

    @Column({
        type: 'varchar',
        nullable: true
    })
    output_img: string;

    @CreateDateColumn({
        type: 'datetime',
        nullable: true
    })
    create_date: Date;

    get full_input_path() {
        if (this.input_img) {
            return path.join(__dirname, '..', '..', this.input_img);
        }
        return null;
    }

    get full_output_path() {
        if (this.output_img) {
            return path.join(__dirname, '..', '..', this.output_img);
        }
        return null;
    }

    get pathes() {
        const COVER_DIR = path.join(__dirname, '..', 'covers');
        const DATA_DIR = path.join(COVER_DIR, 'data');
        const CURRENT_DIR = path.join(DATA_DIR, this.id ? this.id.toString() : 'new');
        const TMP_DIR = path.join(__dirname, '..', 'runtime', 'tmp', 'covers');

        return {
            COVER_DIR,
            DATA_DIR,
            CURRENT_DIR,
            TMP_DIR
        };
    }

    hasWidget(widget_name: string): boolean {
        for (const widget of this.settings) {
            if (widget.name === widget_name) {
                return true;
            }
        }
        return false;
    }

    getImgTmpPath(data: string) {
        const image_name = sha256(data).toString();
        Files.mkDir(path.join(this.pathes.TMP_DIR, image_name.slice(0, 2), image_name.slice(2, 4)));
        return path.join(this.pathes.TMP_DIR, image_name.slice(0, 2), image_name.slice(2, 4), `${image_name}.png`);
    }
}
