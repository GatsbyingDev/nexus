import type { Request, Response } from "express";
import { nanoid } from "nanoid";
import { ServerMemberModel } from "../models/ServerMember";
import { ServerModel } from "../models/Server";
import { AppError } from "../middleware/errorHandler";
import { asyncHandler } from "../utils/asyncHandler";

type AuthedRequest = Request & { user?: { userId: string } };

export const createInvite = asyncHandler(async (req: AuthedRequest, res: Response) => {
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

  server.inviteCode = nanoid(8);
  await server.save();

  res.status(201).json({
    success: true,
    data: {
      inviteCode: server.inviteCode,
      inviteLink: `${req.protocol}://${req.get("host")}/invites/${server.inviteCode}`
    }
  });
});

export const getInvite = asyncHandler(async (req: Request, res: Response) => {
  const server = await ServerModel.findOne({ inviteCode: req.params.inviteCode }).select(
    "name icon inviteCode"
  );

  if (!server) {
    throw new AppError("Invite not found", 404);
  }

  const memberCount = await ServerMemberModel.countDocuments({ serverId: server._id });

  res.json({
    success: true,
    data: {
      name: server.name,
      icon: server.icon,
      inviteCode: server.inviteCode,
      memberCount
    }
  });
});
