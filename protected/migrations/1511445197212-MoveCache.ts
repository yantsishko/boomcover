import config from '@config';
import {
    MigrationInterface,
    QueryRunner
} from 'typeorm';

export class MoveCache1511445197212 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<any> {
        const cache: Array<{id: number, cached_data: any}> = await queryRunner.query('SELECT `social_group`.id, `cover`.cached_data FROM `cover` INNER JOIN `social_group` ON `social_group`.`coverId` = `cover`.`id`');
        for (const cacheData of cache) {
            await queryRunner.query(`INSERT INTO social_group_cache(\`groupId\`, \`data\`) VALUES (${cacheData.id}, ${JSON.stringify(cacheData.cached_data)})`);
        }
    }

    async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DELETE FROM social_group_cache`);
    }

}
