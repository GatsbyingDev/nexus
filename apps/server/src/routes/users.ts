import { Router } from "express";
import {
  deleteMe,
  getFriends,
  getMe,
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
usersRouter.get("/me", getMe);
usersRouter.patch("/me", updateMe);
usersRouter.post("/me/avatar", uploadSingle("avatar"), handleCloudinaryUpload("nexus/avatars"), uploadAvatar);
usersRouter.delete("/me", deleteMe);

usersRouter.get("/me/friends", getFriends);
usersRouter.post("/me/friends/:userId", sendFriendRequest);
usersRouter.patch("/me/friends/:userId", respondToFriend);
usersRouter.delete("/me/friends/:userId", removeFriend);

usersRouter.get("/:id", getUser);

export default usersRouter;
