import { randomUUID } from "crypto";
import { Request, Response, NextFunction } from "express";

export function requestContext(req: Request, res: Response, next: NextFunction) {
  const requestId = randomUUID();
  (req as any).requestId = requestId;

  res.setHeader("x-request-id", requestId);
  next();
}