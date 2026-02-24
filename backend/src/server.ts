import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./observability/logger";

async function start() {
  const { app, prisma, syncService } = createApp();

  const server = app.listen(env.port, async () => {
    logger.info(`API running on http://localhost:${env.port}`);
    logger.info(`Swagger on http://localhost:${env.port}/docs`);
    logger.info(`Observability on http://localhost:${env.port}/metrics`)
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log("Shutting down...");
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
