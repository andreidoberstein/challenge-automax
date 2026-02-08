import { z } from "zod";

const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido. Use YYYY-MM-DD.");

const toOptionalNumber = (v: unknown) =>
  v === undefined || v === "" || v === null ? undefined : Number(v);

export const GetCartsQueryDTO = z
  .object({
    userId: z
      .preprocess((v) => (v === undefined || v === "" ? undefined : Number(v)), z.number().int().positive().optional()),
    dateFrom: dateOnly.optional(),
    dateTo: dateOnly.optional(),

    limit: z
      .preprocess(toOptionalNumber, z.literal(5).optional())
      .default(5),

    cursor: z.preprocess(toOptionalNumber, z.number().int().positive().optional())
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

const isoDateTime = z
  .string()
  .datetime({ message: "date deve ser ISO datetime (ex: 2020-03-02T00:00:00.000Z)" });

export const UpdateCartBodyDTO = z.object({
  userId: z.number().int().positive().optional(),
  date: isoDateTime.optional(),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive()
      })
    )
    .min(1, "items não pode ser vazio")
    .optional()
});

export type UpdateCartBody = z.infer<typeof UpdateCartBodyDTO>;