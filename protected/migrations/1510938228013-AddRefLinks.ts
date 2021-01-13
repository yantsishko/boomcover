import config from '@config';
import {
    MigrationInterface,
    QueryRunner
} from 'typeorm';

export class AddRefLinks1510938228013 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<any> {
        const users = await queryRunner.query('SELECT id, vk_id FROM user WHERE referral_code IS NULL');
        for (const userData of users) {
            await queryRunner.query(`UPDATE user SET referral_code='ref${userData.vk_id.replace(/\s/g, '')}' WHERE id=${userData.id}`);
        }
    }

    async down(queryRunner: QueryRunner): Promise<any> {
        return;
    }

}
