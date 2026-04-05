import type { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { env } from "../config/env";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  error?: unknown,
  stack?: string
): void => {
  res.status(statusCode).json({
    success: false,
    message,
    error,
    ...(env.NODE_ENV === "development" ? { stack } : {})
  });
};

export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.message, undefined, err.stack);
    return;
  }

  if (err instanceof ZodError) {
    sendError(res, 400, "Validation failed", err.flatten(), err.stack);
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map((e) => e.message);
    sendError(res, 400, "Mongoose validation failed", details, err.stack);
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    sendError(res, 400, `Invalid ${err.path}: ${err.value}`, undefined, err.stack);
    return;
  }

  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: number }).code === 11000
  ) {
    const duplicate = err as { keyValue?: Record<string, unknown> };
    const duplicateStack =
      "stack" in err && typeof (err as { stack?: unknown }).stack === "string"
        ? (err as { stack: string }).stack
        : undefined;
    sendError(res, 409, "Duplicate key error", duplicate.keyValue, duplicateStack);
    return;
  }

  if (err instanceof TokenExpiredError) {
    sendError(res, 401, "Token expired", undefined, err.stack);
    return;
  }

  if (err instanceof JsonWebTokenError) {
    sendError(res, 401, "Invalid token", undefined, err.stack);
    return;
  }

  const fallback = err instanceof Error ? err : new Error("Internal server error");
  sendError(res, 500, fallback.message, undefined, fallback.stack);
};
