import type { Request, Response } from "express";
import { createChannelSchema, updateChannelSchema } from "@nexus/shared/schemas";
import { ChannelModel } from "../models/Channel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createChannel = asyncHandler(async (req: Request, res: Response) => {
  const payload = createChannelSchema.parse(req.body);
  const channel = await ChannelModel.create({ ...payload, serverId: req.params.serverId });
  res.status(201).json(channel);
});

export const listChannels = asyncHandler(async (req: Request, res: Response) => {
  const channels = await ChannelModel.find({ serverId: req.params.serverId }).sort({ position: 1 });
  res.json(channels);
});

export const updateChannel = asyncHandler(async (req: Request, res: Response) => {
  const payload = updateChannelSchema.parse(req.body);
  const channel = await ChannelModel.findOneAndUpdate(
    { _id: req.params.channelId, serverId: req.params.serverId },
    payload,
    { new: true }
  );
  res.json(channel);
});

export const deleteChannel = asyncHandler(async (req: Request, res: Response) => {
  await ChannelModel.deleteOne({ _id: req.params.channelId, serverId: req.params.serverId });
  res.status(204).send();
});
