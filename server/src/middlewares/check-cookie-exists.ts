import { FastifyReply, FastifyRequest } from "fastify";

export async function checkIfCookieExists(request: FastifyRequest, reply: FastifyReply){
    const cookieId = request.cookies.cookieId;
    
    if(!cookieId){
        return reply.status(401).send({ error: "unauthorized" });
    }
}