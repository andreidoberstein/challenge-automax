import { fetchFakeStoreCarts } from "../clients/fakestore.client";
import { CartsRepository } from "../repositories/carts.repository";

export class SyncService {
  constructor(private cartsRepo: CartsRepository) {}

  async syncCarts() {
    const carts = await fetchFakeStoreCarts();

    let upserted = 0;
    for (const c of carts) {
      await this.cartsRepo.upsertCartWithItems(c);
      upserted++;
    }

    return { upserted };
  }
}
