import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import { GetCartByIdParamsDTO, GetCartsQueryDTO } from "../dtos/carts.dto";
import { CartsController } from "../controllers/carts.controller";

export function cartsRoutes(controller: CartsController) {
  const router = Router();

  /**
   * @openapi
   * /carts:
   *   get:
   *     tags: [Carts]
   *     summary: Lista carrinhos armazenados localmente
   *     parameters:
   *       - in: query
   *         name: userId
   *         schema: { type: integer }
   *       - in: query
   *         name: dateFrom
   *         schema: { type: string, example: "2020-01-01" }
   *       - in: query
   *         name: dateTo
   *         schema: { type: string, example: "2020-12-31" }
   *     responses:
   *       200: { description: OK }
   */
  router.get("/", validate(GetCartsQueryDTO, "query"), controller.list);

  /**
   * @openapi
   * /carts/{id}:
   *   get:
   *     tags: [Carts]
   *     summary: Retorna detalhes de um carrinho
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: integer }
   *     responses:
   *       200: { description: OK }
   *       404: { description: Not Found }
   */
  router.get("/:id", validate(GetCartByIdParamsDTO, "params"), controller.getById);

  return router;
}
