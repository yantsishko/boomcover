'use strict';

import logger from '@component/logger';
import config from '@config';
import 'reflect-metadata';
import {
    Connection,
    ConnectionOptions,
    createConnection
} from 'typeorm';

class DB {

    private _connection: Connection;
    private need_sync: boolean = false;

    private get config(): ConnectionOptions {
        const DBConfig: ConnectionOptions = {
            type: config.db.type,
            database: config.db.database + (config.isTest ? '_test' : ''),
            username: config.db.username,
            password: config.db.password,
            host: config.db.host,
            port: config.db.port,
            timezone: config.db.timezone,
            charset: 'utf8mb4',
            extra: {
                timezone: 'utc'
            },
            entities: [
                __dirname + '/../entities/*.ts'
            ],
            migrations: [
                __dirname + '/../migrations/*.ts'
            ],
            cli: {
                migrationsDir: __dirname + '/../migrations'
            },
            synchronize: this.need_sync,
            migrationsRun: this.need_sync,
            dropSchema: config.isTest
        };
        return DBConfig;
    }

    async getConnection(need_sync: boolean = false) {
        this.need_sync = need_sync;
        if (!this._connection || !this._connection.isConnected) {
            this._connection = await createConnection(this.config);
        }
        return this._connection;
    }

    async close() {
        if (this._connection) {
            await this._connection.close();
            this._connection = undefined;
        }
    }

}

const DBInstance = new DB();
export default DBInstance;
