import fastify from 'fastify';
import cookie from '@fastify/cookie';
import { UserRoutes } from './routes/user';
import { DietRoutes } from './routes/diet';

export const app = fastify();

app.register(cookie);

app.register(DietRoutes, { prefix: 'diet' });
app.register(UserRoutes, { prefix: 'user' });



