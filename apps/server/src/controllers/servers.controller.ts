import type { Request, Response } from "express";
import { createServerSchema, updateServerSchema } from "@nexus/shared/schemas";
import { ChannelModel } from "../models/Channel.js";
import { ServerMemberModel } from "../models/ServerMember.js";
import { ServerModel } from "../models/Server.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createServer = asyncHandler(async (req: Request, res: Response) => {
  const payload = createServerSchema.parse(req.body);

  const server = await ServerModel.create({ ...payload, ownerId: req.user?._id });
  await ServerMemberModel.create({ serverId: server._id, userId: req.user?._id, roles: [] });
  await ChannelModel.create({ serverId: server._id, name: "general", type: "TEXT", position: 0 });

  res.status(201).json(server);
});

export const getServer = asyncHandler(async (req: Request, res: Response) => {
  const server = await ServerModel.findById(req.params.serverId);
  if (!server) {
    res.status(404).json({ message: "Server not found" });
    return;
  }
  res.json(server);
});

export const updateServer = asyncHandler(async (req: Request, res: Response) => {
  const payload = updateServerSchema.parse(req.body);
  const server = await ServerModel.findByIdAndUpdate(req.params.serverId, payload, { new: true });
  res.json(server);
});

export const deleteServer = asyncHandler(async (req: Request, res: Response) => {
  await ServerModel.findByIdAndDelete(req.params.serverId);
  await ServerMemberModel.deleteMany({ serverId: req.params.serverId });
  await ChannelModel.deleteMany({ serverId: req.params.serverId });
  res.status(204).send();
});

export const joinServer = asyncHandler(async (req: Request, res: Response) => {
  await ServerMemberModel.updateOne(
    { serverId: req.params.serverId, userId: req.user?._id },
    { $setOnInsert: { serverId: req.params.serverId, userId: req.user?._id, joinedAt: new Date() } },
    { upsert: true }
  );

  res.status(201).json({ message: "Joined server" });
});

export const leaveServer = asyncHandler(async (req: Request, res: Response) => {
  await ServerMemberModel.deleteOne({ serverId: req.params.serverId, userId: req.user?._id });
  res.status(204).send();
});

export const listMembers = asyncHandler(async (req: Request, res: Response) => {
  const members = await ServerMemberModel.find({ serverId: req.params.serverId }).populate(
    "userId",
    "username displayName avatar status"
  );
  res.json(members);
});

export const updateMember = asyncHandler(async (req: Request, res: Response) => {
  const member = await ServerMemberModel.findOneAndUpdate(
    { serverId: req.params.serverId, userId: req.params.userId },
    req.body,
    { new: true }
  );
  res.json(member);
});

export const deleteMember = asyncHandler(async (req: Request, res: Response) => {
  await ServerMemberModel.deleteOne({ serverId: req.params.serverId, userId: req.params.userId });
  res.status(204).send();
});
