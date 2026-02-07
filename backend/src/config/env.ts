import dotenv from "dotenv";
dotenv.config();

function mustGet(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: mustGet("DATABASE_URL"),
  fakestoreBaseUrl: process.env.FAKESTORE_BASE_URL ?? "https://fakestoreapi.com",
};
