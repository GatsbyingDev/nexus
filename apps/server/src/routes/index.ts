import { Router } from "express";
import authRouter from "./auth";
import usersRouter from "./users";
import serversRouter from "./servers";
import channelsRouter from "./channels";
import messagesRouter from "./messages";
import dmRouter from "./dm";
import invitesRouter from "./invites";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/servers", serversRouter);
apiRouter.use(channelsRouter);
apiRouter.use(messagesRouter);
apiRouter.use("/dm", dmRouter);
apiRouter.use(invitesRouter);

export default apiRouter;
