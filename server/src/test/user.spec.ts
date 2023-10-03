import { afterAll, beforeAll, describe, expect, it, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { knex } from '../database';
import { execSync } from 'child_process';

describe('Users Route tests', () => {
    beforeAll(async () => {
        await app.ready();
        execSync('pnpm knex migrate:rollback --all');
        execSync('pnpm knex migrate:latest');
    });

    beforeEach(() => {
        knex('users').truncate();
    });
    
    afterAll(async () => {
        await app.close();
    });
    
    it('Should return a error when "name" is empty', async () => {
        const response = await request(app.server).post('/user').send({
            user: '',
        });

        expect(response.body).toEqual({ error: "User can not be empty" });
    });

    it('Should return 401 status code', async () => {
        const response = await request(app.server).post('/user').send({
            user: '',
        });

        expect(response.status).toEqual(401);
    });

    it('Should return the user Id after insert new user in database', async () => {
        const response = await request(app.server).post('/user').send({
            user: 'usertest',
        });

        expect(response.body).toEqual({ id: response.body.id });
    });
});
