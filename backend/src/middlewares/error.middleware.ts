import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code: string = "APP_ERROR",
    public details?: unknown
  ) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Recurso não encontrado") {
    super(404, message, "NOT_FOUND");
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Requisição inválida", details?: unknown) {
    super(400, message, "BAD_REQUEST", details);
  }
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      code: "VALIDATION_ERROR",
      message: "Erro de validação",
      issues: err.issues
    });
  }

  // AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      details: err.details
    });
  }

  // fallback
  console.error("Unhandled error:", err);
  return res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Erro interno do servidor"
  });
}
