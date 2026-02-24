import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import { healthRoutes } from "./routes/health.routes";
import { cartsRoutes } from "./routes/carts.routes";
import { syncRoutes } from "./routes/sync.routes";
import { errorHandler } from "./middlewares/error.middleware";

import { PrismaClient } from "@prisma/client";
import { CartsRepository } from "./repositories/carts.repository";
import { SyncService } from "./services/sync.service";
import { CartsService } from "./services/carts.service";
import { CartsController } from "./controllers/carts.controller";

import { logger } from "./observability/logger";
import { requestContext } from "./observability/request-context";
import { metricsMiddleware, register } from "./observability/metrics";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(requestContext);
  app.use(metricsMiddleware);

  const prisma = new PrismaClient({
    log: [
      { emit: "event", level: "query" },
      { emit: "event", level: "error" },
      { emit: "event", level: "warn" }
    ]
  });
  const cartsRepo = new CartsRepository(prisma);
  const syncService = new SyncService(cartsRepo);
  const cartsService = new CartsService(cartsRepo);
  const cartsController = new CartsController(cartsService, syncService);

  app.get("/metrics", async (_, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  });

  prisma.$on("query", (e) => {
    logger.debug(
      {
        query: e.query,
        duration: e.duration,
      },
      "Prisma query"
    );
  });

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(healthRoutes);
  app.use("/carts", cartsRoutes(cartsController));
  app.use(syncRoutes(cartsController));

  app.use(errorHandler);

  return { app, prisma, syncService };
}
