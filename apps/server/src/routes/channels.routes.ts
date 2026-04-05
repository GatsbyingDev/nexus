import { Router } from "express";
import { createChannel, deleteChannel, listChannels, updateChannel } from "../controllers/channels.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const channelsRouter = Router();

channelsRouter.use(requireAuth);
channelsRouter.post("/servers/:serverId/channels", createChannel);
channelsRouter.get("/servers/:serverId/channels", listChannels);
channelsRouter.patch("/servers/:serverId/channels/:channelId", updateChannel);
channelsRouter.delete("/servers/:serverId/channels/:channelId", deleteChannel);
