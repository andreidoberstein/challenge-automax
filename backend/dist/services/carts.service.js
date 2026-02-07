"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartsService = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
const date_1 = require("../utils/date");
class CartsService {
    constructor(cartsRepo) {
        this.cartsRepo = cartsRepo;
    }
    async list(filters) {
        const dateFrom = filters.dateFrom ? (0, date_1.parseDateOnlyToStart)(filters.dateFrom) : undefined;
        const dateTo = filters.dateTo ? (0, date_1.parseDateOnlyToEnd)(filters.dateTo) : undefined;
        return this.cartsRepo.findMany({
            userId: filters.userId,
            dateFrom,
            dateTo
        });
    }
    async getById(id) {
        const cart = await this.cartsRepo.findById(id);
        if (!cart)
            throw new error_middleware_1.NotFoundError(`Carrinho ${id} não encontrado`);
        return cart;
    }
}
exports.CartsService = CartsService;
