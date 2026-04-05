import type { Request, Response } from "express";
import { z } from "zod";
import { ChannelModel } from "../models/Channel";
import { RoleModel } from "../models/Role";
import { ServerMemberModel } from "../models/ServerMember";
import { ServerModel } from "../models/Server";
import { AppError } from "../middleware/errorHandler";
import { asyncHandler } from "../utils/asyncHandler";

type AuthedRequest = Request & { user?: { userId: string } };

const createServerSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(512).optional()
});

const updateServerSchema = createServerSchema.partial().extend({
  icon: z.string().url().optional(),
  banner: z.string().url().optional()
});

export const createServer = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const payload = createServerSchema.parse(req.body);

  const server = await ServerModel.create({
    ...payload,
    ownerId: req.user.userId
  });

  const ownerRole = await RoleModel.create({
    serverId: server._id,
    name: "Owner",
    color: "#f04747",
    position: 999,
    permissions: ["ADMINISTRATOR"]
  });

  await ServerMemberModel.create({
    serverId: server._id,
    userId: req.user.userId,
    roles: [ownerRole._id],
    joinedAt: new Date()
  });

  await ChannelModel.insertMany([
    {
      serverId: server._id,
      name: "general",
      type: "TEXT",
      position: 0,
      categoryName: "Text Channels"
    },
    {
      serverId: server._id,
      name: "voice-lounge",
      type: "VOICE",
      position: 1,
      categoryName: "Voice Channels"
    }
  ]);

  res.status(201).json({ success: true, data: server });
});

export const getServer = asyncHandler(async (req: Request, res: Response) => {
  const server = await ServerModel.findById(req.params.serverId);
  if (!server) {
    throw new AppError("Server not found", 404);
  }

  res.json({ success: true, data: server });
});

export const updateServer = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const payload = updateServerSchema.parse(req.body);
  const server = await ServerModel.findById(req.params.serverId);

  if (!server) {
    throw new AppError("Server not found", 404);
  }

  if (server.ownerId.toString() !== req.user.userId) {
    throw new AppError("Forbidden", 403);
  }

  Object.assign(server, payload);
  await server.save();

  res.json({ success: true, data: server });
});

export const deleteServer = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const server = await ServerModel.findById(req.params.serverId);
  if (!server) {
    throw new AppError("Server not found", 404);
  }

  if (server.ownerId.toString() !== req.user.userId) {
    throw new AppError("Forbidden", 403);
  }

  await Promise.all([
    ServerModel.findByIdAndDelete(server._id),
    ServerMemberModel.deleteMany({ serverId: server._id }),
    ChannelModel.deleteMany({ serverId: server._id }),
    RoleModel.deleteMany({ serverId: server._id })
  ]);

  res.json({ success: true, message: "Server deleted" });
});

export const joinServer = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const payload = z.object({ inviteCode: z.string().min(1) }).parse(req.body);
  const server = await ServerModel.findById(req.params.serverId);

  if (!server) {
    throw new AppError("Server not found", 404);
  }

  if (server.inviteCode !== payload.inviteCode) {
    throw new AppError("Invalid invite code", 400);
  }

  const existing = await ServerMemberModel.findOne({
    serverId: server._id,
    userId: req.user.userId
  });

  if (!existing) {
    await ServerMemberModel.create({
      serverId: server._id,
      userId: req.user.userId,
      roles: [],
      joinedAt: new Date()
    });
  }

  res.status(201).json({ success: true, message: "Joined server" });
});

export const leaveServer = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const server = await ServerModel.findById(req.params.serverId);
  if (!server) {
    throw new AppError("Server not found", 404);
  }

  if (server.ownerId.toString() === req.user.userId) {
    throw new AppError("Owner cannot leave their own server. Delete it instead.", 400);
  }

  await ServerMemberModel.deleteOne({
    serverId: server._id,
    userId: req.user.userId
  });

  res.json({ success: true, message: "Left server" });
});

export const getMembers = asyncHandler(async (req: Request, res: Response) => {
  const members = await ServerMemberModel.find({ serverId: req.params.serverId })
    .populate("userId", "username displayName avatar status")
    .populate("roles", "name color position permissions")
    .sort({ joinedAt: 1 });

  res.json({ success: true, data: members });
});

export const updateMember = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const payload = z
    .object({
      nickname: z.string().max(100).optional(),
      roles: z.array(z.string()).optional()
    })
    .parse(req.body);

  const server = await ServerModel.findById(req.params.serverId);
  if (!server) {
    throw new AppError("Server not found", 404);
  }

  if (server.ownerId.toString() !== req.user.userId) {
    throw new AppError("Forbidden", 403);
  }

  const member = await ServerMemberModel.findOneAndUpdate(
    {
      serverId: req.params.serverId,
      userId: req.params.userId
    },
    payload,
    { new: true }
  );

  if (!member) {
    throw new AppError("Member not found", 404);
  }

  res.json({ success: true, data: member });
});

export const kickMember = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const server = await ServerModel.findById(req.params.serverId);
  if (!server) {
    throw new AppError("Server not found", 404);
  }

  if (server.ownerId.toString() !== req.user.userId) {
    throw new AppError("Forbidden", 403);
  }

  await ServerMemberModel.deleteOne({
    serverId: req.params.serverId,
    userId: req.params.userId
  });

  res.json({ success: true, message: "Member removed" });
});
