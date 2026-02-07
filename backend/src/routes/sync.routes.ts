import { Router } from "express";
import { CartsController } from "../controllers/carts.controller";

export function syncRoutes(controller: CartsController) {
  const router = Router();

  /**
   * @openapi
   * /sync:
   *   post:
   *     tags: [Sync]
   *     summary: Sincroniza carrinhos da Fake Store API para o banco local
   *     responses:
   *       200: { description: OK }
   */
  router.post("/sync", controller.sync);

  return router;
}
