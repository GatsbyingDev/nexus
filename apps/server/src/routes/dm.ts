import { Router } from "express";
import {
  createOrGetDM,
  getDMMessages,
  getDMs,
  sendDMMessage
} from "../controllers/dmController";
import { authenticate } from "../middleware/auth";

const dmRouter = Router();

dmRouter.use(authenticate);
dmRouter.get("/", getDMs);
dmRouter.post("/:userId", createOrGetDM);
dmRouter.get("/:dmId/messages", getDMMessages);
dmRouter.post("/:dmId/messages", sendDMMessage);

export default dmRouter;
