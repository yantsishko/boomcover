'use strict';

import { User } from '@entity/User';
import { join } from 'path';
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class UserFile {

    static readonly UPLOADS_DIR = join(__dirname, '..', 'uploads');

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => User, (user) => user.social_groups, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: true
    })
    user: Promise<User>;

    @Column({
        type: 'varchar'
    })
    name: string;

    @Column({
        type: 'varchar'
    })
    original_name: string;

    @Column()
    mimetype: string;

    @Column()
    size: number;

    @CreateDateColumn()
    create_date: Date;

    get DIR_PATH() {
        if (this.name.length > 4) {
            return `${UserFile.UPLOADS_DIR}/${this.name.slice(0, 2)}/${this.name.slice(2, 4)}`;
        }
        return `${UserFile.UPLOADS_DIR}`;
    }

    get FILE_PATH(): string {
        return join(this.DIR_PATH, this.name);
    }
}
