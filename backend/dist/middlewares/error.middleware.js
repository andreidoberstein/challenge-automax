"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = exports.NotFoundError = exports.AppError = void 0;
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
class AppError extends Error {
    constructor(statusCode, message, code = "APP_ERROR", details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}
exports.AppError = AppError;
class NotFoundError extends AppError {
    constructor(message = "Recurso não encontrado") {
        super(404, message, "NOT_FOUND");
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends AppError {
    constructor(message = "Requisição inválida", details) {
        super(400, message, "BAD_REQUEST", details);
    }
}
exports.BadRequestError = BadRequestError;
function errorHandler(err, _req, res, _next) {
    // Zod
    if (err instanceof zod_1.ZodError) {
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
