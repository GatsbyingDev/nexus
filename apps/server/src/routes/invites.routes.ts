import { Router } from "express";
import { createInvite, getInvite } from "../controllers/invites.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const invitesRouter = Router();

invitesRouter.post("/servers/:serverId/invites", requireAuth, createInvite);
invitesRouter.get("/invites/:inviteCode", getInvite);
