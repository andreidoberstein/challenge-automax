"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartsController = void 0;
class CartsController {
    constructor(cartsService, syncService) {
        this.cartsService = cartsService;
        this.syncService = syncService;
        this.list = async (req, res) => {
            const query = req.validated?.query; // tipado via DTO no route
            const carts = await this.cartsService.list(query);
            res.json(carts);
        };
        this.getById = async (req, res) => {
            const params = req.validated?.params;
            const cart = await this.cartsService.getById(params.id);
            res.json(cart);
        };
        this.sync = async (_req, res) => {
            const result = await this.syncService.syncCarts();
            res.json({ message: "Sync realizado com sucesso", ...result });
        };
    }
}
exports.CartsController = CartsController;
