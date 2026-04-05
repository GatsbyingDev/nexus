import { Router } from "express";
import { addFriend, deleteMe, getFriends, getUserById, removeFriend, updateFriend, updateMe, uploadAvatar } from "../controllers/users.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../utils/upload.js";

export const usersRouter = Router();

usersRouter.use(requireAuth);
usersRouter.get("/:id", getUserById);
usersRouter.patch("/me", updateMe);
usersRouter.post("/me/avatar", upload.single("avatar"), uploadAvatar);
usersRouter.delete("/me", deleteMe);
usersRouter.get("/me/friends", getFriends);
usersRouter.post("/me/friends/:userId", addFriend);
usersRouter.patch("/me/friends/:userId", updateFriend);
usersRouter.delete("/me/friends/:userId", removeFriend);
