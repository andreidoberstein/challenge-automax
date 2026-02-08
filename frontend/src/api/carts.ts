import { apiClient } from "./client";

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface Cart {
  id: number;
  userId: number;
  date: string;
  totalQuantity: number;
  items?: CartItem[];
}

export interface CartWithTotal extends Cart {
  totalQuantity: number;
}

export type ListCartsResponse = {
  rows: Cart[];
  nextCursor: number | null;
  pageSize: number;
  cursor: number | null;
  hasNextPage: boolean;
  count: number;
};

export interface ListCartsParams {
  userId?: number;
  dateFrom?: string;
  dateTo?: string;
  cursor?: number;
}

export async function listCarts(
  params: ListCartsParams = {},
): Promise<ListCartsResponse> {
  const carts = await apiClient<ListCartsResponse>("/carts", {
    params: {
      userId: params.userId,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      cursor: params.cursor,
    },
  });
  console.log(carts);

  return carts;
}

export async function getCartById(id: number): Promise<CartWithTotal> {
  const cart = await apiClient<Cart>(`/carts/${id}`);

  return {
    ...cart,
    totalQuantity:
      cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
  };
}

export async function syncCarts(): Promise<{ message: string }> {
  return apiClient<{ message: string }>("/sync", { method: "POST" });
}
