import { Router } from "express";
import {
  createChannel,
  deleteChannel,
  getChannels,
  updateChannel
} from "../controllers/channelsController";
import { authenticate } from "../middleware/auth";

const channelsRouter = Router();

channelsRouter.use(authenticate);
channelsRouter.post("/servers/:serverId/channels", createChannel);
channelsRouter.get("/servers/:serverId/channels", getChannels);
channelsRouter.patch("/servers/:serverId/channels/:channelId", updateChannel);
channelsRouter.delete("/servers/:serverId/channels/:channelId", deleteChannel);

export default channelsRouter;
