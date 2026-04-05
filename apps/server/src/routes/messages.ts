import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  getMessages,
  updateMessage
} from "../controllers/messagesController";
import { authenticate } from "../middleware/auth";

const messagesRouter = Router();

messagesRouter.use(authenticate);
messagesRouter.get("/channels/:channelId/messages", getMessages);
messagesRouter.post("/channels/:channelId/messages", createMessage);
messagesRouter.patch("/channels/:channelId/messages/:messageId", updateMessage);
messagesRouter.delete("/channels/:channelId/messages/:messageId", deleteMessage);

export default messagesRouter;
