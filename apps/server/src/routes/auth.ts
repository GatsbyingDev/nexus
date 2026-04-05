import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { getMe, login, logout, refresh, register } from "../controllers/authController";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/refresh", refresh);
authRouter.get("/me", authenticate, getMe);

export default authRouter;
