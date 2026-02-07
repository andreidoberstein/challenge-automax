"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncRoutes = syncRoutes;
const express_1 = require("express");
function syncRoutes(controller) {
    const router = (0, express_1.Router)();
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
