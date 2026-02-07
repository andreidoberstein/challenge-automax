"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCartByIdParamsDTO = exports.GetCartsQueryDTO = void 0;
const zod_1 = require("zod");
const dateOnly = zod_1.z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido. Use YYYY-MM-DD.");
exports.GetCartsQueryDTO = zod_1.z
    .object({
    userId: zod_1.z
        .preprocess((v) => (v === undefined || v === "" ? undefined : Number(v)), zod_1.z.number().int().positive().optional()),
    dateFrom: dateOnly.optional(),
    dateTo: dateOnly.optional()
})
    .refine((data) => {
    if (data.dateFrom && data.dateTo)
        return data.dateFrom <= data.dateTo;
    return true;
}, { message: "dateFrom não pode ser maior que dateTo", path: ["dateFrom"] });
exports.GetCartByIdParamsDTO = zod_1.z.object({
    id: zod_1.z.preprocess((v) => Number(v), zod_1.z.number().int().positive())
});
