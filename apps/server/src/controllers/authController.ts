import type { Request, Response } from "express";
import { z } from "zod";
import { UserModel } from "../models/User";
import { AppError } from "../middleware/errorHandler";
import { asyncHandler } from "../utils/asyncHandler";
import {
  clearRefreshTokenCookie,
  setRefreshTokenCookie,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../utils/jwt";

const registerSchema = z.object({
  username: z.string().min(3).max(32),
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(1).max(100)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const payload = registerSchema.parse(req.body);

  const existing = await UserModel.findOne({
    $or: [{ email: payload.email }, { username: payload.username }]
  });

  if (existing) {
    throw new AppError("User with that email or username already exists", 409);
  }

  const user = await UserModel.create(payload);

  const accessToken = signAccessToken({
    userId: user._id.toString(),
    username: user.username,
    email: user.email
  });
  const refreshToken = signRefreshToken({ userId: user._id.toString() });

  setRefreshTokenCookie(res, refreshToken);

  res.status(201).json({
    success: true,
    data: {
      accessToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        banner: user.banner,
        status: user.status,
        customStatus: user.customStatus,
        friends: user.friends,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const payload = loginSchema.parse(req.body);

  const user = await UserModel.findOne({ email: payload.email });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const validPassword = await user.comparePassword(payload.password);
  if (!validPassword) {
    throw new AppError("Invalid credentials", 401);
  }

  const accessToken = signAccessToken({
    userId: user._id.toString(),
    username: user.username,
    email: user.email
  });
  const refreshToken = signRefreshToken({ userId: user._id.toString() });

  setRefreshTokenCookie(res, refreshToken);

  res.json({
    success: true,
    data: {
      accessToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        banner: user.banner,
        status: user.status,
        customStatus: user.customStatus,
        friends: user.friends,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  clearRefreshTokenCookie(res);
  res.json({ success: true, message: "Logged out" });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) {
    throw new AppError("Refresh token missing", 401);
  }

  const decoded = verifyRefreshToken(token);
  const user = await UserModel.findById(decoded.userId);
  if (!user) {
    throw new AppError("Invalid refresh token", 401);
  }

  const accessToken = signAccessToken({
    userId: user._id.toString(),
    username: user.username,
    email: user.email
  });
  const refreshToken = signRefreshToken({ userId: user._id.toString() });

  setRefreshTokenCookie(res, refreshToken);

  res.json({
    success: true,
    data: { accessToken }
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const authUser = (req as Request & { user?: { userId: string } }).user;
  if (!authUser) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await UserModel.findById(authUser.userId).select("-password");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json({ success: true, data: user });
});
