import type { Request, Response } from "express";
import { z } from "zod";
import { UserModel } from "../models/User";
import { AppError } from "../middleware/errorHandler";
import { asyncHandler } from "../utils/asyncHandler";

type AuthedRequest = Request & { user?: { userId: string } };
type UploadRequest = Request & {
  uploadedFile?: {
    url: string;
    publicId: string;
    format: string;
    bytes: number;
    width?: number;
    height?: number;
  };
};

const updateMeSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  customStatus: z.string().max(120).optional(),
  status: z.enum(["online", "idle", "dnd", "invisible"]).optional(),
  banner: z.string().url().optional()
});

const respondFriendSchema = z.object({
  status: z.enum(["accepted", "blocked"])
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.params.id).select("-password");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json({ success: true, data: user });
});

export const updateMe = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const payload = updateMeSchema.parse(req.body);
  const user = await UserModel.findByIdAndUpdate(req.user.userId, payload, {
    new: true
  }).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json({ success: true, data: user });
});

export const uploadAvatar = asyncHandler(async (req: UploadRequest, res: Response) => {
  const authUser = (req as AuthedRequest).user;
  if (!authUser) {
    throw new AppError("Unauthorized", 401);
  }

  if (!req.uploadedFile) {
    throw new AppError("No uploaded file metadata found", 400);
  }

  const user = await UserModel.findByIdAndUpdate(
    authUser.userId,
    { avatar: req.uploadedFile.url },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json({ success: true, data: user });
});

export const deleteMe = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  await UserModel.findByIdAndDelete(req.user.userId);
  res.json({ success: true, message: "Account deleted" });
});

export const getFriends = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await UserModel.findById(req.user.userId)
    .select("friends")
    .populate("friends.userId", "username displayName avatar status");

  res.json({ success: true, data: user?.friends ?? [] });
});

export const sendFriendRequest = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const targetUserId = req.params.userId;
  if (targetUserId === req.user.userId) {
    throw new AppError("Cannot friend yourself", 400);
  }

  const [fromUser, toUser] = await Promise.all([
    UserModel.findById(req.user.userId),
    UserModel.findById(targetUserId)
  ]);

  if (!fromUser || !toUser) {
    throw new AppError("User not found", 404);
  }

  const alreadyRequested = fromUser.friends.some((f) => f.userId.toString() === targetUserId);
  if (!alreadyRequested) {
    fromUser.friends.push({ userId: toUser._id, status: "pending" });
    await fromUser.save();
  }

  const reciprocal = toUser.friends.some((f) => f.userId.toString() === req.user?.userId);
  if (!reciprocal) {
    toUser.friends.push({ userId: fromUser._id, status: "pending" });
    await toUser.save();
  }

  res.status(201).json({ success: true, message: "Friend request sent" });
});

export const respondToFriend = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const { status } = respondFriendSchema.parse(req.body);
  const targetUserId = req.params.userId;

  await Promise.all([
    UserModel.updateOne(
      { _id: req.user.userId, "friends.userId": targetUserId },
      { $set: { "friends.$.status": status } }
    ),
    UserModel.updateOne(
      { _id: targetUserId, "friends.userId": req.user.userId },
      { $set: { "friends.$.status": status } }
    )
  ]);

  res.json({ success: true, message: "Friend status updated" });
});

export const removeFriend = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const targetUserId = req.params.userId;

  await Promise.all([
    UserModel.updateOne(
      { _id: req.user.userId },
      { $pull: { friends: { userId: targetUserId } } }
    ),
    UserModel.updateOne(
      { _id: targetUserId },
      { $pull: { friends: { userId: req.user.userId } } }
    )
  ]);

  res.json({ success: true, message: "Friend removed" });
});
