import type { RouteConfig } from "../../router.ts";

export const exampleRoutes: RouteConfig[] = [
  {
    method: "GET",
    url: "/api/example",
    handler: async (_request, reply) => {
      return reply.send({
        message: "Example endpoint",
        data: { example: true },
      });
    },
  },
  {
    method: "POST",
    url: "/api/example",
    handler: async (request, reply) => {
      const body = request.body;
      return reply.status(201).send({
        message: "Example created",
        data: body,
      });
    },
  },
];
