import { Router } from "express";
import {
  createServer,
  deleteMember,
  deleteServer,
  getServer,
  joinServer,
  leaveServer,
  listMembers,
  updateMember,
  updateServer
} from "../controllers/servers.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const serversRouter = Router();

serversRouter.use(requireAuth);
serversRouter.post("/", createServer);
serversRouter.get("/:serverId", getServer);
serversRouter.patch("/:serverId", updateServer);
serversRouter.delete("/:serverId", deleteServer);
serversRouter.post("/:serverId/join", joinServer);
serversRouter.post("/:serverId/leave", leaveServer);
serversRouter.get("/:serverId/members", listMembers);
serversRouter.patch("/:serverId/members/:userId", updateMember);
serversRouter.delete("/:serverId/members/:userId", deleteMember);
