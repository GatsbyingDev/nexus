import { Router } from "express";
import { createDmConversation, createDmMessage, listDmConversations, listDmMessages } from "../controllers/dm.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const dmRouter = Router();

dmRouter.use(requireAuth);
dmRouter.get("/", listDmConversations);
dmRouter.post("/:userId", createDmConversation);
dmRouter.get("/:dmId/messages", listDmMessages);
dmRouter.post("/:dmId/messages", createDmMessage);
