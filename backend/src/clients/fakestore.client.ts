import axios from "axios";
import { env } from "../config/env";
import { FakeCart } from "./fakestore.types";

const api = axios.create({
  baseURL: env.fakestoreBaseUrl,
  timeout: 10000
});

export async function fetchFakeStoreCarts(): Promise<FakeCart[]> {
  const { data } = await api.get<FakeCart[]>("/carts");
  return data;
}
