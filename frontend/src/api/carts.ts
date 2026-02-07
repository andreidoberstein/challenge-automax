import { apiClient } from './client';

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface Cart {
  id: number;
  userId: number;
  date: string;
  totalQuantity: number;
  products?: CartItem[];
}

export interface CartWithTotal extends Cart {
  totalQuantity: number;
}

export interface ListCartsParams {
  userId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export async function listCarts(params: ListCartsParams = {}): Promise<Cart[]> {
  const carts = await apiClient<Cart[]>('/carts', {
    params: {
      userId: params.userId,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
    },
  });

  return carts;
}

export async function getCartById(id: number): Promise<CartWithTotal> {
  const cart = await apiClient<Cart>(`/carts/${id}`);
  
  return {
    ...cart,
    totalQuantity: cart.products?.reduce((sum, item) => sum + item.quantity, 0) || 0,
  };
}

export async function syncCarts(): Promise<{ message: string }> {
  return apiClient<{ message: string }>('/sync', { method: 'POST' });
}
