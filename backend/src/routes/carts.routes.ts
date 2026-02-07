import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import { GetCartByIdParamsDTO, GetCartsQueryDTO, UpdateCartBodyDTO } from "../dtos/carts.dto";
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
  
  /**
   * @openapi
   * /carts/{id}:
   *   patch:
   *     tags: [Carts]
   *     summary: Atualiza parcialmente um carrinho local
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: integer }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userId: { type: integer }
   *               date: { type: string, example: "2020-03-02" }
   *               items:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     productId: { type: integer }
   *                     quantity: { type: integer }
   *     responses:
   *       200: { description: OK }
   *       400: { description: Validation Error }
   *       404: { description: Not Found }
   */
  router.patch(
    "/:id",
    validate(GetCartByIdParamsDTO, "params"),
    validate(UpdateCartBodyDTO, "body"),
    controller.update
  );

  /**
   * @openapi
   * /carts/{id}:
   *   delete:
   *     tags: [Carts]
   *     summary: Remove um carrinho local
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: integer }
   *     responses:
   *       200: { description: OK }
   *       404: { description: Not Found }
   */
  router.delete(
    "/:id",
    validate(GetCartByIdParamsDTO, "params"),
    controller.remove
  );

  return router;
}
