"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncService = void 0;
const fakestore_client_1 = require("../clients/fakestore.client");
class SyncService {
    constructor(cartsRepo) {
        this.cartsRepo = cartsRepo;
    }
    async syncCarts() {
        const carts = await (0, fakestore_client_1.fetchFakeStoreCarts)();
        let upserted = 0;
        for (const c of carts) {
            await this.cartsRepo.upsertCartWithItems(c);
            upserted++;
        }
        return { upserted };
    }
}
exports.SyncService = SyncService;
