import { it, describe, expect, beforeAll, beforeEach, afterAll } from 'vitest'; 
import request from 'supertest';
import { app } from '../app';
import { knex } from '../database';

describe("diet routes test", () => {
    beforeAll(async () => {
        await app.ready();
    });

    beforeEach(() => {
        knex('diets').truncate();
        knex('users').truncate();
    });

    afterAll(async () => {
        await app.close();
    });
    
    it("Should return a error if 'name' is empty ", async () => {  
        const createUserResponse = await request(app.server).post('/user').send({
            user: 'usertest'
        });
        
        const cookies = createUserResponse.get('Set-Cookie');

        const createDietresponse = await request(app.server).post('/diet').set('Cookie', cookies).send({
            name: '',
            description: 'test descritption',
            date: '0000-00-00 00:00:00',
            isInDiet: true,
        });

        expect(createDietresponse.body).toEqual({ error: "name can not be empty" });
    });

    it("Should return a error if 'date' is empty ", async () => {
        const createUserResponse = await request(app.server).post('/user').send({
            user: 'usertest'
        });
        
        const cookies = createUserResponse.get('Set-Cookie');

        const createDietresponse = await request(app.server).post('/diet').set('Cookie', cookies).send({
            name: 'test name',
            description: 'test descritption',
            date: '',
            isInDiet: true,
        });

        expect(createDietresponse.body).toEqual({ error: "date can not be empty" });
    });

    it("Should return a error if 'name' is empty when user try update diet ", async () => {  
        const createUserResponse = await request(app.server).post('/user').send({
            user: 'usertest'
        });

        const cookies = createUserResponse.get('Set-Cookie');

        await request(app.server).post('/diet').set('Cookie', cookies).send({
            name: 'diet toUpdate',
            description: 'test descritption',
            date: '0000-00-00 00:00:00',
            isInDiet: true,
        });

        const dietResponse = await request(app.server).get('/diet').set('Cookie', cookies);
        
        const dietId = dietResponse.body[0].id;

        const dietUpdateResponse = await request(app.server).put(`/diet/${dietId}`).set('Cookie', cookies).send({
            name: '',
            description: 'test descritption',
            date: '0000-00-00 00:00:00',
            isInDiet: true,
        });

        expect(dietUpdateResponse.body).toEqual({ error: "name can not be empty" });
    });

    it("Should return a error if 'date' is empty when user try update diet ", async () => {  
        const createUserResponse = await request(app.server).post('/user').send({
            user: 'usertest'
        });

        const cookies = createUserResponse.get('Set-Cookie');

        await request(app.server).post('/diet').set('Cookie', cookies).send({
            name: 'diet toUpdate',
            description: 'test descritption',
            date: '0000-00-00 00:00:00',
            isInDiet: true,
        });

        const dietResponse = await request(app.server).get('/diet').set('Cookie', cookies);
        
        const dietId = dietResponse.body[0].id;

        const dietUpdateResponse = await request(app.server).put(`/diet/${dietId}`).set('Cookie', cookies).send({
            name: 'diet updated',
            description: 'test descritption',
            date: '',
            isInDiet: true,
        });

        expect(dietUpdateResponse.body).toEqual({ error: "date can not be empty" });
    });

    it("Should return diet updated ", async () => {  
        const createUserResponse = await request(app.server).post('/user').send({
            user: 'usertest'
        });

        const cookies = createUserResponse.get('Set-Cookie');

        await request(app.server).post('/diet').set('Cookie', cookies).send({
            name: 'diet toUpdate',
            description: 'test descritption',
            date: '0000-00-00 00:00:00',
            isInDiet: true,
        });

        const dietResponse = await request(app.server).get('/diet').set('Cookie', cookies);
        
        const dietId = dietResponse.body[0].id;

        const dietUpdateResponse = await request(app.server).put(`/diet/${dietId}`).set('Cookie', cookies).send({
            name: 'diet updated',
            description: 'test descritption',
            date: '0000-00-00 00:00:00',
            isInDiet: false,
        });

        expect(dietUpdateResponse.status).toBe(204);
    });

    // it('Should return a list of all user diets', async () => {
    //     const createUserResponse = await request(app.server).post('/user').send({
    //         user: 'usertest'
    //     });

    //     const cookies = createUserResponse.get('Set-Cookie');

    //     await request(app.server).post('/diet').set('Cookie', cookies).send({
    //         name: "dieta 1",
    //         description: 'test descritption',
    //         date: "0000-00-00 00:00:00",
    //         isInDiet: 0,
    //         user_id: 'test'
    //     });
            
    //     const listDietsResponse = await request(app.server).get('/diet').set('Cookie', cookies);

    //     expect(listDietsResponse.body).toEqual(expect.arrayContaining([
    //         expect.objectContaining({
    //             name: "dieta 1",
    //             description: '',
    //             date: "0000-00-00 00:00:00",
    //             isInDiet: 0,
    //         })
    //     ]));
    // });
});