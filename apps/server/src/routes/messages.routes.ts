import { Router } from "express";
import { createMessage, deleteMessage, listMessages, updateMessage } from "../controllers/messages.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const messagesRouter = Router();

messagesRouter.use(requireAuth);
messagesRouter.get("/channels/:channelId/messages", listMessages);
messagesRouter.post("/channels/:channelId/messages", createMessage);
messagesRouter.patch("/channels/:channelId/messages/:messageId", updateMessage);
messagesRouter.delete("/channels/:channelId/messages/:messageId", deleteMessage);
