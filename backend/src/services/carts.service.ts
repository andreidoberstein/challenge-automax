import { CartsRepository } from "../repositories/carts.repository";
import { NotFoundError } from "../middlewares/error.middleware";
import { parseDateOnlyToEnd, parseDateOnlyToStart } from "../utils/date";

export class CartsService {
  constructor(private cartsRepo: CartsRepository) {}

  async list(filters: { userId?: number; dateFrom?: string; dateTo?: string }) {
    const dateFrom = filters.dateFrom ? parseDateOnlyToStart(filters.dateFrom) : undefined;
    const dateTo = filters.dateTo ? parseDateOnlyToEnd(filters.dateTo) : undefined;

    return this.cartsRepo.findMany({
      userId: filters.userId,
      dateFrom,
      dateTo
    });
  }

  async getById(id: number) {
    const cart = await this.cartsRepo.findById(id);
    if (!cart) throw new NotFoundError(`Carrinho ${id} não encontrado`);
    return cart;
  }
}
