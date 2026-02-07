"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartsRoutes = cartsRoutes;
const express_1 = require("express");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const carts_dto_1 = require("../dtos/carts.dto");
function cartsRoutes(controller) {
    const router = (0, express_1.Router)();
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
    router.get("/", (0, validate_middleware_1.validate)(carts_dto_1.GetCartsQueryDTO, "query"), controller.list);
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
    router.get("/:id", (0, validate_middleware_1.validate)(carts_dto_1.GetCartByIdParamsDTO, "params"), controller.getById);
    return router;
}
