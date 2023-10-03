import { FastifyInstance } from 'fastify';
import { knex } from '../database';
import { z } from 'zod';
import { randomUUID } from 'crypto';

export async function UserRoutes(app: FastifyInstance){
    app.get('/all', async (request, reply) => {
        const users = await knex('users').select('*');

        reply.status(200).send(users);
    });

    app.post('/', async (request, reply) => {
        const createUserSchema = z.object({
            user: z.string(),
        });

        const { user } = createUserSchema.parse(request.body);

        if(!user || user === ''){
            return reply.status(401).send({ error: "User can not be empty" });
        }

        const id = randomUUID(); 

        await knex('users').insert({
            id: id,
            user: user
        });

        reply.cookie('cookieId', id, {
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
        });
    
        return reply.status(201).send({ id });
    });
}