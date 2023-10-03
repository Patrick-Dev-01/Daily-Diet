import { FastifyInstance } from "fastify";
import { checkIfCookieExists } from "../middlewares/check-cookie-exists";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from 'crypto';

export async function DietRoutes(app: FastifyInstance){
    app.post('/', { preHandler: [checkIfCookieExists]}, async (request, reply) => {
        const { cookieId } = request.cookies;
        
        const createDietSchema = z.object({
            name: z.string(),
            description: z.string().optional(),
            date: z.string(),
            isInDiet: z.boolean(), 
        });
        
        const diet = createDietSchema.parse(request.body);
        
        if(!diet.name || diet.name === ''){
            return reply.status(401).send({ error: "name can not be empty" });
        }

        if(!diet.date || diet.date === ''){
            return reply.status(401).send({ error: "date can not be empty" });
        }

        await knex('diets').insert({
            id: randomUUID(),
            name: diet.name,
            description: diet.description,
            date: diet.date,
            isInDiet: diet.isInDiet,
            user_id: cookieId
        });

        return reply.status(201).send();
    });

    app.get('/', { preHandler: [checkIfCookieExists] }, async (request, reply) => {
        const { cookieId } = request.cookies;

        const diets = await knex('diets').where({
            user_id: cookieId
        }).select('*');
        
        return reply.status(200).send(diets);
    });

    app.put('/:id', { preHandler: [checkIfCookieExists]}, async (request, reply) => {
        const { cookieId } = request.cookies;

        const updateDietSchema = z.object({
            name: z.string(),
            description: z.string().optional(),
            date: z.string(),
            isInDiet: z.boolean(), 
        });

        const diet = updateDietSchema.parse(request.body);

        if(!diet.name || diet.name === ''){
            return reply.status(401).send({ error: "name can not be empty" });
        }

        if(!diet.date || diet.date === ''){
            return reply.status(401).send({ error: "date can not be empty" });
        }

        await knex('diets').where({
            user_id: cookieId
        }).select('*');
        
        return reply.status(204).send();
    });
}