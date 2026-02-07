"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartsRepository = void 0;
class CartsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany(filters) {
        const where = {};
        if (filters.userId)
            where.userId = filters.userId;
        if (filters.dateFrom || filters.dateTo) {
            where.date = {};
            if (filters.dateFrom)
                where.date.gte = filters.dateFrom;
            if (filters.dateTo)
                where.date.lte = filters.dateTo;
        }
        return this.prisma.cart.findMany({
            where,
            orderBy: { id: "asc" },
            select: { id: true, userId: true, date: true, totalQuantity: true }
        });
    }
    async findById(id) {
        return this.prisma.cart.findUnique({
            where: { id },
            include: {
                items: { select: { productId: true, quantity: true }, orderBy: { productId: "asc" } }
            }
        });
    }
    async upsertCartWithItems(fakeCart) {
        const totalQuantity = fakeCart.products.reduce((acc, p) => acc + p.quantity, 0);
        const date = new Date(fakeCart.date);
        return this.prisma.$transaction(async (tx) => {
            // Upsert do carrinho
            await tx.cart.upsert({
                where: { id: fakeCart.id },
                create: {
                    id: fakeCart.id,
                    userId: fakeCart.userId,
                    date,
                    totalQuantity
                },
                update: {
                    userId: fakeCart.userId,
                    date,
                    totalQuantity
                }
            });
            const productIds = fakeCart.products.map((p) => p.productId);
            // Remove itens antigos que não existem mais no carrinho externo
            await tx.cartItem.deleteMany({
                where: {
                    cartId: fakeCart.id,
                    productId: { notIn: productIds.length ? productIds : [-1] }
                }
            });
            // Upsert dos itens (cartId + productId é unique)
            for (const p of fakeCart.products) {
                await tx.cartItem.upsert({
                    where: {
                        cartId_productId: {
                            cartId: fakeCart.id,
                            productId: p.productId
                        }
                    },
                    create: {
                        cartId: fakeCart.id,
                        productId: p.productId,
                        quantity: p.quantity
                    },
                    update: {
                        quantity: p.quantity
                    }
                });
            }
            return tx.cart.findUnique({
                where: { id: fakeCart.id },
                include: { items: { select: { productId: true, quantity: true } } }
            });
        });
    }
}
exports.CartsRepository = CartsRepository;
