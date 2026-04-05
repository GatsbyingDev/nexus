import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject } from "zod";

export const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        error: parsed.error.flatten()
      });
      return;
    }

    req.body = parsed.data;
    next();
  };
};
