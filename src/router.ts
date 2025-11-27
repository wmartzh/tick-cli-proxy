import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authRoutes } from "./features/auth/routes";

export interface RouteConfig {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  handler: (request: FastifyRequest<any>, reply: FastifyReply) => Promise<void>;
}

export async function registerRoutes(fastify: FastifyInstance) {
  // Health check endpoint
  fastify.get("/health", async (_request, reply) => {
    return reply.send({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Register feature routes
  registerFeatureRoutes(fastify, authRoutes);
}

export function registerFeatureRoutes(
  fastify: FastifyInstance,
  routes: RouteConfig[],
) {
  routes.forEach((route) => {
    fastify.route({
      method: route.method,
      url: route.url,
      handler: route.handler,
    });
  });
}
