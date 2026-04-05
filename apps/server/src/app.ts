import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { globalErrorHandler } from "./middleware/errorHandler";
import { authRateLimiter, globalRateLimiter } from "./middleware/rateLimiter";
import { apiRouter } from "./routes";

export const createApp = (): Express => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true
    })
  );
  app.use(morgan("dev"));
  app.use(cookieParser());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use(globalRateLimiter);
  app.use("/api/v1/auth", authRateLimiter);
  app.use("/api/v1", apiRouter);

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: "Route not found" });
  });

  app.use(globalErrorHandler);

  return app;
};
