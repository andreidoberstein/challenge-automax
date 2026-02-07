import { createApp } from "./app";
import { env } from "./config/env";

async function start() {
  const { app, prisma, syncService } = createApp();

  const server = app.listen(env.port, async () => {
    console.log(`API running on http://localhost:${env.port}`);
    console.log(`Swagger on http://localhost:${env.port}/docs`);

    // if (env.syncOnStartup) {
    //   try {
    //     const result = await syncService.syncCarts();
    //     console.log(`[SYNC] Startup sync ok:`, result);
    //   } catch (err) {
    //     console.error(`[SYNC] Startup sync failed:`, err);
    //   }
    // }

    // CRON OPCIONAL (se quiser habilitar)
    // npm i node-cron
    // if (env.syncCron) {
    //   const cron = await import("node-cron");
    //   cron.default.schedule(env.syncCron, async () => {
    //     try {
    //       const result = await syncService.syncCarts();
    //       console.log(`[SYNC] Cron sync ok:`, result);
    //     } catch (err) {
    //       console.error(`[SYNC] Cron sync failed:`, err);
    //     }
    //   });
    //   console.log(`[SYNC] Cron enabled: ${env.syncCron}`);
    // }
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
