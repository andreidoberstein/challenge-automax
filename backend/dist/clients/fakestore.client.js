"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFakeStoreCarts = fetchFakeStoreCarts;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const api = axios_1.default.create({
    baseURL: env_1.env.fakestoreBaseUrl,
    timeout: 10000
});
async function fetchFakeStoreCarts() {
    const { data } = await api.get("/carts");
    return data;
}
