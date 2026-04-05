import { Router } from "express";
import {
  createServer,
  deleteServer,
  getMembers,
  getServer,
  joinServer,
  kickMember,
  leaveServer,
  updateMember,
  updateServer
} from "../controllers/serversController";
import { authenticate } from "../middleware/auth";

const serversRouter = Router();

serversRouter.use(authenticate);
serversRouter.post("/", createServer);
serversRouter.get("/:serverId", getServer);
serversRouter.patch("/:serverId", updateServer);
serversRouter.delete("/:serverId", deleteServer);
serversRouter.post("/:serverId/join", joinServer);
serversRouter.post("/:serverId/leave", leaveServer);
serversRouter.get("/:serverId/members", getMembers);
serversRouter.patch("/:serverId/members/:userId", updateMember);
serversRouter.delete("/:serverId/members/:userId", kickMember);

export default serversRouter;
