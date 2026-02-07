import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

declare global {
  namespace Express {
    interface Request {
      validated?: {
        query?: unknown;
        params?: unknown;
        body?: unknown;
      };
    }
  }
}

type Source = "query" | "params" | "body";

export function validate(schema: ZodSchema, source: Source) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const data = req[source];
    const parsed = schema.parse(data);

    req.validated = req.validated ?? {};
    req.validated[source] = parsed;

    next();
  };
}
