import type { Request, Response } from "express";
import { Types } from "mongoose";
import { z } from "zod";
import { DirectMessageContentModel } from "../models/DirectMessageContent";
import { DirectMessageModel } from "../models/DirectMessage";
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

const sendDmSchema = z.object({
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
    .default([])
});

const getIO = (req: Request): SocketApp | null => {
  const io = req.app.get("io") as SocketApp | undefined;
  return io ?? null;
};

export const getDMs = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const dms = await DirectMessageModel.find({
    participants: req.user.userId
  }).sort({ updatedAt: -1 });

  res.json({ success: true, data: dms });
});

export const createOrGetDM = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const targetUserId = req.params.userId;
  const participants = [req.user.userId, targetUserId].sort();

  let dm = await DirectMessageModel.findOne({ participants });
  if (!dm) {
    dm = await DirectMessageModel.create({ participants });
  }

  res.status(201).json({ success: true, data: dm });
});

export const getDMMessages = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const { before, limit } = paginationSchema.parse(req.query);

  const dm = await DirectMessageModel.findById(req.params.dmId);
  if (!dm) {
    throw new AppError("DM not found", 404);
  }

  if (!dm.participants.some((p) => p.toString() === req.user?.userId)) {
    throw new AppError("Forbidden", 403);
  }

  const query: Record<string, unknown> = { dmId: req.params.dmId };
  if (before) {
    query._id = { $lt: new Types.ObjectId(before) };
  }

  const items = await DirectMessageContentModel.find(query)
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

export const sendDMMessage = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const payload = sendDmSchema.parse(req.body);

  const dm = await DirectMessageModel.findById(req.params.dmId);
  if (!dm) {
    throw new AppError("DM not found", 404);
  }

  if (!dm.participants.some((p) => p.toString() === req.user?.userId)) {
    throw new AppError("Forbidden", 403);
  }

  const message = await DirectMessageContentModel.create({
    dmId: req.params.dmId,
    authorId: req.user.userId,
    content: payload.content,
    attachments: payload.attachments,
    replyTo: payload.replyTo,
    reactions: []
  });

  await message.populate("author", "username displayName avatar");
  dm.updatedAt = new Date();
  await dm.save();

  const io = getIO(req);
  io?.to(`dm:${req.params.dmId}`).emit("new_dm", message);

  res.status(201).json({ success: true, data: message });
});
