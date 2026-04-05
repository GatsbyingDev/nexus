import type { Request, Response } from "express";
import { updateMeSchema } from "@nexus/shared/schemas";
import { UserModel } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadBufferToCloudinary } from "../utils/upload.js";

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.params.id).select("-password");
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json(user);
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const payload = updateMeSchema.parse(req.body);
  const user = await UserModel.findByIdAndUpdate(req.user?._id, payload, { new: true }).select("-password");
  res.json(user);
});

export const uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  const upload = await uploadBufferToCloudinary(req.file.buffer, "nexus/avatars");
  const user = await UserModel.findByIdAndUpdate(
    req.user?._id,
    { avatar: upload.secure_url },
    { new: true }
  ).select("-password");

  res.json(user);
});

export const deleteMe = asyncHandler(async (req: Request, res: Response) => {
  await UserModel.findByIdAndDelete(req.user?._id);
  res.status(204).send();
});

export const getFriends = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.user?._id).populate("friends.userId", "username displayName avatar");
  res.json(user?.friends ?? []);
});

export const addFriend = asyncHandler(async (req: Request, res: Response) => {
  await UserModel.findByIdAndUpdate(req.user?._id, {
    $addToSet: { friends: { userId: req.params.userId, status: "pending" } }
  });
  res.status(201).json({ message: "Friend request sent" });
});

export const updateFriend = asyncHandler(async (req: Request, res: Response) => {
  await UserModel.updateOne(
    { _id: req.user?._id, "friends.userId": req.params.userId },
    { $set: { "friends.$.status": req.body.status } }
  );
  res.json({ message: "Friend status updated" });
});

export const removeFriend = asyncHandler(async (req: Request, res: Response) => {
  await UserModel.findByIdAndUpdate(req.user?._id, {
    $pull: { friends: { userId: req.params.userId } }
  });
  res.status(204).send();
});
