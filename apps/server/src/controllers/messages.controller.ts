import type { Request, Response } from "express";
import { paginationSchema, sendMessageSchema, updateMessageSchema } from "@nexus/shared/schemas";
import { MessageModel } from "../models/Message.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listMessages = asyncHandler(async (req: Request, res: Response) => {
  const { before, limit } = paginationSchema.parse(req.query);

  const query: Record<string, unknown> = { channelId: req.params.channelId };
  if (before) {
    query._id = { $lt: before };
  }

  const messages = await MessageModel.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("author", "username displayName avatar");

  const ordered = messages.reverse();
  const nextCursor = messages.length === limit ? messages[messages.length - 1]._id : null;

  res.json({ items: ordered, nextCursor });
});

export const createMessage = asyncHandler(async (req: Request, res: Response) => {
  const payload = sendMessageSchema.parse(req.body);
  const message = await MessageModel.create({
    ...payload,
    channelId: req.params.channelId,
    authorId: req.user?._id,
    embeds: [],
    reactions: []
  });

  await message.populate("author", "username displayName avatar");
  res.status(201).json(message);
});

export const updateMessage = asyncHandler(async (req: Request, res: Response) => {
  const payload = updateMessageSchema.parse(req.body);

  const message = await MessageModel.findOneAndUpdate(
    { _id: req.params.messageId, channelId: req.params.channelId, authorId: req.user?._id },
    { content: payload.content, edited: true, editedAt: new Date() },
    { new: true }
  ).populate("author", "username displayName avatar");

  res.json(message);
});

export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  await MessageModel.findOneAndUpdate(
    { _id: req.params.messageId, channelId: req.params.channelId },
    { deleted: true }
  );

  res.status(204).send();
});
