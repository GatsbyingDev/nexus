import type { Request, Response } from "express";
import { z } from "zod";
import { ChannelModel } from "../models/Channel";
import { ServerModel } from "../models/Server";
import { AppError } from "../middleware/errorHandler";
import { asyncHandler } from "../utils/asyncHandler";

type AuthedRequest = Request & { user?: { userId: string } };

const createChannelSchema = z.object({
  name: z.string().min(1).max(100),
  topic: z.string().max(1024).optional(),
  type: z.enum(["TEXT", "VOICE", "ANNOUNCEMENT"]).default("TEXT"),
  position: z.number().int().min(0).default(0),
  categoryName: z.string().max(64).optional(),
  isPrivate: z.boolean().default(false),
  slowMode: z.number().int().min(0).max(21600).default(0)
});

const updateChannelSchema = createChannelSchema.partial();

const assertServerOwner = async (serverId: string, userId: string): Promise<void> => {
  const server = await ServerModel.findById(serverId);
  if (!server) {
    throw new AppError("Server not found", 404);
  }
  if (server.ownerId.toString() !== userId) {
    throw new AppError("Forbidden", 403);
  }
};

export const createChannel = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  await assertServerOwner(req.params.serverId, req.user.userId);
  const payload = createChannelSchema.parse(req.body);

  const channel = await ChannelModel.create({
    ...payload,
    serverId: req.params.serverId,
    createdAt: new Date()
  });

  res.status(201).json({ success: true, data: channel });
});

export const getChannels = asyncHandler(async (req: Request, res: Response) => {
  const channels = await ChannelModel.find({ serverId: req.params.serverId }).sort({ position: 1 });
  res.json({ success: true, data: channels });
});

export const updateChannel = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  await assertServerOwner(req.params.serverId, req.user.userId);
  const payload = updateChannelSchema.parse(req.body);

  const channel = await ChannelModel.findOneAndUpdate(
    {
      _id: req.params.channelId,
      serverId: req.params.serverId
    },
    payload,
    { new: true }
  );

  if (!channel) {
    throw new AppError("Channel not found", 404);
  }

  res.json({ success: true, data: channel });
});

export const deleteChannel = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  await assertServerOwner(req.params.serverId, req.user.userId);

  await ChannelModel.deleteOne({
    _id: req.params.channelId,
    serverId: req.params.serverId
  });

  res.json({ success: true, message: "Channel deleted" });
});
