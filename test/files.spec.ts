import { UserFile } from '@entity/UserFile';
import { expect } from 'chai';
import { join } from 'path';
import * as supertest from 'supertest';
import { getRepository } from 'typeorm';
import app from '../app';

describe('Files', () => {
    it('Add file', async () => {
        const response = await supertest(app)
            .post('/api/v1/file')
            .attach('file', join(__dirname, 'resources', 'imgs', 'boroda_moroz.png'));
        expect(response.status).eq(200);
        expect(response.body).deep.eq({
            success: true,
            data: {
                name: 'c9966aae89a6fe0982cebf709f9177b229212c4e8c462ffbb2a19f4eb859a910'
            }
        });

        const file = await getRepository(UserFile).findOne();
        expect(file.name).eq('c9966aae89a6fe0982cebf709f9177b229212c4e8c462ffbb2a19f4eb859a910');
        expect(file.original_name).eq('boroda_moroz.png');
    });

    it('File list', async () => {
        const response = await supertest(app)
            .get('/api/v1/file/list');
        expect(response.status).eq(200);
        expect(response.body).deep.eq({
            success: true,
            data: [
                'c9966aae89a6fe0982cebf709f9177b229212c4e8c462ffbb2a19f4eb859a910'
            ]
        });
    });

    it('Delete file', async () => {
        const response = await supertest(app)
            .delete('/api/v1/file/c9966aae89a6fe0982cebf709f9177b229212c4e8c462ffbb2a19f4eb859a910');
        expect(response.status).eq(200);
        expect(response.body).deep.eq({
            success: true
        });

        expect(await getRepository(UserFile).count()).eq(0);
    });
});
