import Fastify from "fastify";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import { registerRoutes } from "./router";

const start = async () => {
  const isDevelopment = process.env.NODE_ENV !== "production";

  const fastify = Fastify({
    logger: {
      level: "info",
      ...(isDevelopment && {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss Z",
            ignore: "pid,hostname",
          },
        },
      }),
    },
  });

  try {
    await fastify.register(helmet);

    await fastify.register(cors, {
      origin: true,
    });

    await registerRoutes(fastify);

    const port = Number(process.env.PORT) || 3000;
    const host = process.env.HOST || "0.0.0.0";

    await fastify.listen({ port, host });

    fastify.log.info(`Server listening on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
