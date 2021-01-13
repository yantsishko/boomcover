import config from '@config';
import {
    Connection,
    EntityManager,
    MigrationInterface,
    QueryRunner
} from 'typeorm';

export class FixCharset1507746850423 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER DATABASE ${config.db.database} DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`);
        await queryRunner.query(`SELECT concat('alter table ', table_name, ' CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;') FROM information_schema.tables WHERE table_schema='${config.db.database}' and table_collation != 'utf8mb4_general_ci' GROUP BY table_name;`);
    }

    async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER DATABASE ${config.db.database} DEFAULT CHARACTER SET utf8;`);
        await queryRunner.query(`SELECT concat('alter table ', table_name, ' CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;') FROM information_schema.tables WHERE table_schema='${config.db.database}' and table_collation != 'utf8_general_ci' GROUP BY table_name;`);
    }

}
