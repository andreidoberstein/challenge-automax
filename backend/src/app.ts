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

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // DI simples
  const prisma = new PrismaClient();
  const cartsRepo = new CartsRepository(prisma);
  const syncService = new SyncService(cartsRepo);
  const cartsService = new CartsService(cartsRepo);
  const cartsController = new CartsController(cartsService, syncService);

  // Swagger
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Routes
  app.use(healthRoutes);
  app.use("/carts", cartsRoutes(cartsController));
  app.use(syncRoutes(cartsController)); // /sync

  // Error handler (sempre por último)
  app.use(errorHandler);

  return { app, prisma, syncService };
}
