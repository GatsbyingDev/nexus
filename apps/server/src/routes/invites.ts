import { Router } from "express";
import { createInvite, getInvite } from "../controllers/invitesController";
import { authenticate } from "../middleware/auth";

const invitesRouter = Router();

invitesRouter.post("/servers/:serverId/invites", authenticate, createInvite);
invitesRouter.get("/invites/:inviteCode", getInvite);

export default invitesRouter;
