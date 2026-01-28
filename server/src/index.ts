import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

import { QuerySchema, NEOItemSchema } from "./schemas";
import { fetchNeosForDate } from "./nasa";
import { sortNeos } from "./sort";
import { SimpleTTLCache } from "./cache";
import type { NEOItem } from "./types";

/**
 * Bootstraps and starts Fastify server
 */
async function startServer() {

  // Create Fastify instance
  const app = Fastify({ logger: true });

  // Enable CORS for frontend
  await app.register(cors, { origin: true });

  // Register Swagger (OpenAPI)
  await app.register(swagger, {
    openapi: {
      info: {
        title: "NASA NEO Dashboard API",
        version: "1.0.0"
      }
    }
  });

  // Swagger UI
  await app.register(swaggerUI, {
    routePrefix: "/docs"
  });

  // In-memory cache (5 minutes)
  const cache = new SimpleTTLCache<NEOItem[]>(5 * 60 * 1000);

  // Health endpoint
  app.get("/health", async () => {
    return { ok: true };
  });

  // Main API
  app.get("/api/neos", async (req: any, reply) => {

    const parsed = QuerySchema.safeParse(req.query);

    if (!parsed.success) {
      return reply.status(400).send({
        error: parsed.error.issues.map(i => i.message).join(", ")
      });
    }

    const { date, sort, order } = parsed.data;

    const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";

    // Try cache first
    const cached = cache.get(date);

    const rawItems =
      cached ??
      await fetchNeosForDate({
        date,
        apiKey
      });

    if (!cached) {
      cache.set(date, rawItems);
    }

    const sorted = sortNeos(rawItems, sort, order);

    return {
      date,
      count: sorted.length,
      items: sorted
    };
  });

  // Start server
  const port = Number(process.env.PORT || 3001);

  await app.listen({ port, host: "0.0.0.0" });

  console.log(`🚀 Server running at http://localhost:${port}`);
}

// Start app
startServer();
