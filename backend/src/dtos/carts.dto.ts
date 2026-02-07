import { z } from "zod";

const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido. Use YYYY-MM-DD.");

export const GetCartsQueryDTO = z
  .object({
    userId: z
      .preprocess((v) => (v === undefined || v === "" ? undefined : Number(v)), z.number().int().positive().optional()),
    dateFrom: dateOnly.optional(),
    dateTo: dateOnly.optional()
  })
  .refine(
    (data) => {
      if (data.dateFrom && data.dateTo) return data.dateFrom <= data.dateTo;
      return true;
    },
    { message: "dateFrom não pode ser maior que dateTo", path: ["dateFrom"] }
  );

export type GetCartsQuery = z.infer<typeof GetCartsQueryDTO>;

export const GetCartByIdParamsDTO = z.object({
  id: z.preprocess((v) => Number(v), z.number().int().positive())
});

export type GetCartByIdParams = z.infer<typeof GetCartByIdParamsDTO>;
