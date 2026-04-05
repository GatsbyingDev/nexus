import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "@nexus/shared/schemas";
import { UserModel } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";

const REFRESH_COOKIE = "refreshToken";

const setRefreshCookie = (res: Response, token: string): void => {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export const register = asyncHandler(async (req, res) => {
  const input = registerSchema.parse(req.body);

  const existing = await UserModel.findOne({
    $or: [{ email: input.email }, { username: input.username }]
  });

  if (existing) {
    res.status(409).json({ message: "Email or username already in use" });
    return;
  }

  const user = await UserModel.create(input);
  const accessToken = signAccessToken({ userId: user._id.toString() });
  const refreshToken = signRefreshToken({ userId: user._id.toString() });

  setRefreshCookie(res, refreshToken);
  res.status(201).json({ accessToken, user });
});

export const login = asyncHandler(async (req, res) => {
  const input = loginSchema.parse(req.body);
  const user = await UserModel.findOne({ email: input.email });

  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(input.password, user.password);
  if (!valid) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const accessToken = signAccessToken({ userId: user._id.toString() });
  const refreshToken = signRefreshToken({ userId: user._id.toString() });
  setRefreshCookie(res, refreshToken);

  res.json({ accessToken, user });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies[REFRESH_COOKIE] as string | undefined;
  if (!token) {
    res.status(401).json({ message: "Missing refresh token" });
    return;
  }

  const payload = verifyRefreshToken(token);
  const user = await UserModel.findById(payload.userId);

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const accessToken = signAccessToken({ userId: user._id.toString() });
  const refreshToken = signRefreshToken({ userId: user._id.toString() });
  setRefreshCookie(res, refreshToken);

  res.json({ accessToken, user });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(REFRESH_COOKIE);
  res.status(204).send();
});
