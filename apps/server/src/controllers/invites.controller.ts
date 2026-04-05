import type { Request, Response } from "express";
import { nanoid } from "nanoid";
import { ServerModel } from "../models/Server.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createInvite = asyncHandler(async (req: Request, res: Response) => {
  const inviteCode = nanoid(10);
  const server = await ServerModel.findByIdAndUpdate(req.params.serverId, { inviteCode }, { new: true });
  res.status(201).json({ inviteCode, serverId: server?._id });
});

export const getInvite = asyncHandler(async (req: Request, res: Response) => {
  const server = await ServerModel.findOne({ inviteCode: req.params.inviteCode });
  if (!server) {
    res.status(404).json({ message: "Invite not found" });
    return;
  }

  res.json({
    inviteCode: server.inviteCode,
    server: {
      _id: server._id,
      name: server.name,
      icon: server.icon,
      description: server.description
    }
  });
});
