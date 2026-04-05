import type { Request, Response } from "express";
import { Types } from "mongoose";
import { z } from "zod";
import { ChannelModel } from "../models/Channel";
import { MessageModel, type IMessage } from "../models/Message";
import { ServerModel } from "../models/Server";
import { AppError } from "../middleware/errorHandler";
import { asyncHandler } from "../utils/asyncHandler";

type AuthedRequest = Request & { user?: { userId: string } };

type SocketApp = {
  to: (room: string) => { emit: (event: string, payload: unknown) => void };
};

const paginationSchema = z.object({
  before: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(50)
});

const createMessageSchema = z.object({
  content: z.string().min(1).max(2000),
  replyTo: z.string().optional(),
  attachments: z
    .array(
      z.object({
        url: z.string().url(),
        filename: z.string().min(1),
        size: z.number().int().min(0),
        type: z.string().min(1)
      })
    )
    .optional()
    .default([]),
  mentions: z.array(z.string()).optional().default([])
});

const updateMessageSchema = z.object({
  content: z.string().min(1).max(2000)
});

const getIO = (req: Request): SocketApp | null => {
  const io = req.app.get("io") as SocketApp | undefined;
  return io ?? null;
};

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const { before, limit } = paginationSchema.parse(req.query);

  const query: Record<string, unknown> = { channelId: req.params.channelId };
  if (before) {
    query._id = { $lt: new Types.ObjectId(before) };
  }

  const items = await MessageModel.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("author", "username displayName avatar");

  const chronological = [...items].reverse();
  const nextCursor = items.length === limit ? items[items.length - 1]._id.toString() : undefined;

  res.json({
    success: true,
    data: chronological,
    nextCursor,
    hasMore: Boolean(nextCursor)
  });
});

export const createMessage = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const payload = createMessageSchema.parse(req.body);

  const message = await MessageModel.create({
    channelId: req.params.channelId,
    authorId: req.user.userId,
    content: payload.content,
    replyTo: payload.replyTo,
    attachments: payload.attachments,
    mentions: payload.mentions,
    embeds: [],
    reactions: []
  });

  await message.populate("author", "username displayName avatar");

  const io = getIO(req);
  io?.to(`channel:${req.params.channelId}`).emit("new_message", message);

  res.status(201).json({ success: true, data: message });
});

export const updateMessage = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const payload = updateMessageSchema.parse(req.body);

  const message = await MessageModel.findOne({
    _id: req.params.messageId,
    channelId: req.params.channelId
  });

  if (!message) {
    throw new AppError("Message not found", 404);
  }

  if (message.authorId.toString() !== req.user.userId) {
    throw new AppError("Forbidden", 403);
  }

  message.content = payload.content;
  message.edited = true;
  message.editedAt = new Date();
  await message.save();
  await message.populate("author", "username displayName avatar");

  const io = getIO(req);
  io?.to(`channel:${req.params.channelId}`).emit("message_updated", message);

  res.json({ success: true, data: message });
});

const canDeleteMessage = async (message: IMessage, userId: string): Promise<boolean> => {
  if (message.authorId.toString() === userId) {
    return true;
  }

  const channel = await ChannelModel.findById(message.channelId).select("serverId");
  if (!channel) {
    return false;
  }

  const server = await ServerModel.findById(channel.serverId).select("ownerId");
  if (!server) {
    return false;
  }

  return server.ownerId.toString() === userId;
};

export const deleteMessage = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const message = await MessageModel.findOne({
    _id: req.params.messageId,
    channelId: req.params.channelId
  });

  if (!message) {
    throw new AppError("Message not found", 404);
  }

  const allowed = await canDeleteMessage(message, req.user.userId);
  if (!allowed) {
    throw new AppError("Forbidden", 403);
  }

  message.deleted = true;
  message.content = "";
  await message.save();

  const io = getIO(req);
  io?.to(`channel:${req.params.channelId}`).emit("message_deleted", {
    messageId: message._id.toString(),
    channelId: req.params.channelId
  });

  res.json({ success: true, message: "Message deleted" });
});
