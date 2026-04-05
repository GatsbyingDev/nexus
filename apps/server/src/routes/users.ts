import { Router } from "express";
import {
  deleteMe,
  getFriends,
  getUser,
  removeFriend,
  respondToFriend,
  sendFriendRequest,
  updateMe,
  uploadAvatar
} from "../controllers/usersController";
import { authenticate } from "../middleware/auth";
import { handleCloudinaryUpload, uploadSingle } from "../middleware/upload";

const usersRouter = Router();

usersRouter.use(authenticate);
usersRouter.get("/me", async (req, res) => {
  req.params.id = (req as typeof req & { user?: { userId: string } }).user?.userId ?? "";
  return getUser(req, res);
});
usersRouter.patch("/me", updateMe);
usersRouter.post("/me/avatar", uploadSingle("avatar"), handleCloudinaryUpload("nexus/avatars"), uploadAvatar);
usersRouter.delete("/me", deleteMe);

usersRouter.get("/me/friends", getFriends);
usersRouter.post("/me/friends/:userId", sendFriendRequest);
usersRouter.patch("/me/friends/:userId", respondToFriend);
usersRouter.delete("/me/friends/:userId", removeFriend);

usersRouter.get("/:id", getUser);

export default usersRouter;
