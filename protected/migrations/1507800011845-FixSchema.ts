import config from '@config';
import {
    MigrationInterface,
    QueryRunner
} from 'typeorm';

export class FixSchema1507800011845 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER DATABASE \`${config.db.database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`);
        const tables = [
            'cover',
            'message',
            'migrations',
            'payment',
            'social_group',
            'social_group_comment',
            'social_group_repost',
            'subscription',
            'user'
        ];
        for (const table of tables) {
            await queryRunner.query(`ALTER TABLE \`${table}\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`);
        }
    }

    async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER DATABASE ${config.db.database} DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`);
    }

}
