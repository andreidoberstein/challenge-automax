import { PrismaClient } from "@prisma/client";
import { FakeCart } from "../clients/fakestore.types";

type UpdateCartInput = {
  userId?: number;
  date?: Date;
  items?: Array<{ productId: number; quantity: number }>;
};

export class CartsRepository {
  constructor(private prisma: PrismaClient) {}

  async findMany(filters: { userId?: number; dateFrom?: Date; dateTo?: Date }) {
    const where: any = {};

    if (filters.userId) where.userId = filters.userId;

    if (filters.dateFrom || filters.dateTo) {
      where.date = {};
      if (filters.dateFrom) where.date.gte = filters.dateFrom;
      if (filters.dateTo) where.date.lte = filters.dateTo;
    }

    return this.prisma.cart.findMany({
      where,
      orderBy: { id: "asc" },
      select: { id: true, userId: true, date: true, totalQuantity: true }
    });
  }

  async findById(id: number) {
    return this.prisma.cart.findUnique({
      where: { id },
      include: {
        items: { select: { productId: true, quantity: true }, orderBy: { productId: "asc" } }
      }
    });
  }

  async upsertCartWithItems(fakeCart: FakeCart) {
    const totalQuantity = fakeCart.products.reduce((acc, p) => acc + p.quantity, 0);
    const date = new Date(fakeCart.date);

    return this.prisma.$transaction(async (tx) => {
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

  async updateCart(id: number, data: UpdateCartInput) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.cart.findUnique({
        where: { id },
        include: { items: true }
      });

      if (!existing) return null;

      const shouldUpdateItems = Array.isArray(data.items);

      const totalQuantity = shouldUpdateItems
        ? data.items!.reduce((acc, i) => acc + i.quantity, 0)
        : existing.totalQuantity;

      await tx.cart.update({
        where: { id },
        data: {
          userId: data.userId ?? existing.userId,
          date: data.date ?? existing.date,
          totalQuantity
        }
      });

      if (shouldUpdateItems) {
        await tx.cartItem.deleteMany({ where: { cartId: id } });

        await tx.cartItem.createMany({
          data: data.items!.map((i) => ({
            cartId: id,
            productId: i.productId,
            quantity: i.quantity
          }))
        });
      }

      return tx.cart.findUnique({
        where: { id },
        include: {
          items: { select: { productId: true, quantity: true }, orderBy: { productId: "asc" } }
        }
      });
    });
  }

  async deleteCart(id: number) {
    const existing = await this.prisma.cart.findUnique({ where: { id } });
    if (!existing) return null;

    await this.prisma.cart.delete({ where: { id } });
    return true;
  }
}
