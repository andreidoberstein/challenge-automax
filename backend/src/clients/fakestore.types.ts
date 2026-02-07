export type FakeCart = {
  id: number;
  userId: number;
  date: string;
  products: Array<{ productId: number; quantity: number }>;
};
