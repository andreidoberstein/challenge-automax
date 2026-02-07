"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function mustGet(name) {
    const value = process.env[name];
    if (!value)
        throw new Error(`Missing env var: ${name}`);
    return value;
}
exports.env = {
    port: Number(process.env.PORT ?? 3000),
    databaseUrl: mustGet("DATABASE_URL"),
    fakestoreBaseUrl: process.env.FAKESTORE_BASE_URL ?? "https://fakestoreapi.com",
};
