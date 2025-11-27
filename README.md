# Tick Proxy API

A Node.js-based API service built with Fastify, TypeScript, and tsx runner, following the features pattern.

## Features

- **Fastify** - Fast and low overhead web framework
- **TypeScript** - Type-safe development with tsx runner
- **Pino Logger** - High-performance logging with pino-pretty for development
- **Helmet** - Security middleware
- **CORS** - Cross-Origin Resource Sharing support
- **Features Pattern** - Organized endpoint structure

## Project Structure

```
tick-proxy/
├── src/
│   ├── index.ts          # Main entry point
│   ├── router.ts         # Route registration
│   └── features/         # Feature-based endpoints
│       └── example/
│           └── routes.ts # Example feature routes
├── Dockerfile            # Docker image configuration
├── docker-compose.yml    # Docker Compose configuration
├── .dockerignore         # Docker ignore file
├── package.json          # Node.js dependencies
├── tsconfig.json         # TypeScript configuration
└── .env.example          # Environment variables template
```

## Getting Started

### Running Locally with Node.js

1. Install dependencies:
```bash
npm install
```

2. Copy the environment variables:
```bash
cp .env.example .env
```

3. Run the development server:
```bash
npm run dev
```

4. Or run in production mode:
```bash
npm start
```

The server will start on `http://0.0.0.0:3000` by default.

### Running with Docker

1. Using Docker Compose (recommended):
```bash
docker-compose up -d
```

2. Or build and run with Docker directly:
```bash
# Build the image
docker build -t tick-proxy-api .

# Run the container
docker run -d -p 3000:3000 --name tick-proxy tick-proxy-api
```

3. View logs:
```bash
docker-compose logs -f
```

4. Stop the service:
```bash
docker-compose down
```

## Adding New Features

To add a new feature/endpoint:

1. Create a new folder in `src/features/`:
```
src/features/your-feature/
```

2. Create a `routes.ts` file with your route configurations:
```typescript
import type { RouteConfig } from "../../router.ts";

export const yourFeatureRoutes: RouteConfig[] = [
  {
    method: "GET",
    url: "/api/your-feature",
    handler: async (_request, reply) => {
      return reply.send({ message: "Your feature endpoint" });
    },
  },
];
```

3. Register the routes in `src/router.ts`:
```typescript
import { yourFeatureRoutes } from "./features/your-feature/routes.ts";
// In registerRoutes function:
registerFeatureRoutes(fastify, yourFeatureRoutes);
```

## Available Endpoints

- `GET /health` - Health check endpoint

### Example Feature
- `GET /api/example` - Get example data
- `POST /api/example` - Create example data

## Environment Variables

- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: 0.0.0.0)
- `NODE_ENV` - Environment mode (development | production)
