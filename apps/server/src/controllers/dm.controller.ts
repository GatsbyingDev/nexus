import type { Request, Response } from "express";
import { dmMessageSchema, paginationSchema } from "@nexus/shared/schemas";
import { DirectMessageContentModel } from "../models/DirectMessageContent.js";
import { DirectMessageModel } from "../models/DirectMessage.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listDmConversations = asyncHandler(async (req: Request, res: Response) => {
  const dms = await DirectMessageModel.find({ participants: req.user?._id }).sort({ updatedAt: -1 });
  res.json(dms);
});

export const createDmConversation = asyncHandler(async (req: Request, res: Response) => {
  const participants = [req.user?._id?.toString(), req.params.userId].sort();
  let dm = await DirectMessageModel.findOne({ participants });

  if (!dm) {
    dm = await DirectMessageModel.create({ participants });
  }

  res.status(201).json(dm);
});

export const listDmMessages = asyncHandler(async (req: Request, res: Response) => {
  const { before, limit } = paginationSchema.parse(req.query);

  const query: Record<string, unknown> = { dmId: req.params.dmId };
  if (before) {
    query._id = { $lt: before };
  }

  const items = await DirectMessageContentModel.find(query).sort({ createdAt: -1 }).limit(limit);
  const ordered = items.reverse();
  const nextCursor = items.length === limit ? items[items.length - 1]._id : null;

  res.json({ items: ordered, nextCursor });
});

export const createDmMessage = asyncHandler(async (req: Request, res: Response) => {
  const payload = dmMessageSchema.parse(req.body);

  const message = await DirectMessageContentModel.create({
    ...payload,
    dmId: req.params.dmId,
    authorId: req.user?._id,
    reactions: []
  });

  await DirectMessageModel.findByIdAndUpdate(req.params.dmId, { updatedAt: new Date() });
  res.status(201).json(message);
});
