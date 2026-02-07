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

  async update(id: number, body: { userId?: number; date?: string; items?: Array<{ productId: number; quantity: number }> }) {
    const updated = await this.cartsRepo.updateCart(id, {
      userId: body.userId,
      date: body.date ? new Date(body.date) : undefined,
      items: body.items
    });

    if (!updated) throw new NotFoundError(`Carrinho ${id} não encontrado`);
    return updated;
  }

  async remove(id: number) {
    const ok = await this.cartsRepo.deleteCart(id);
    if (!ok) throw new NotFoundError(`Carrinho ${id} não encontrado`);
    return true;
  }
}
