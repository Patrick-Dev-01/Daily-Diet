import { config } from 'dotenv';
import { z } from 'zod';

if(process.env.NODE_ENV === 'test'){
    config({ path: '.env.test' });
}

else{
    config();
}

const envSchema = z.object({
    NODE_ENV: z.enum(['production', 'test', 'development']).default('production'),
    DATABASE_CLIENT: z.enum(['sqlite', 'pg']), 
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

if(_env.success === false){
    console.error("Missing .env file", _env.error.format());
    throw new Error('Missing .env file');
}

export const env = _env.data;