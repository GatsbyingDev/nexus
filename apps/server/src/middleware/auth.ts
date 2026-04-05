import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthUser {
  userId: string;
  username: string;
  email: string;
}

type AuthenticatedRequest = Request & { user?: AuthUser };

const parseBearerToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.slice(7).trim();
};

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = parseBearerToken(req.headers.authorization);

  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const decoded = verifyAccessToken(token);
    (req as AuthenticatedRequest).user = {
      userId: decoded.userId,
      username: decoded.username,
      email: decoded.email
    };
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const token = parseBearerToken(req.headers.authorization);

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = verifyAccessToken(token);
    (req as AuthenticatedRequest).user = {
      userId: decoded.userId,
      username: decoded.username,
      email: decoded.email
    };
  } catch {
    // no-op for optional auth
  }

  next();
};
