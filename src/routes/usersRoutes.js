import { Router } from "express";
import { signUp, signIn, userUrls } from "../controllers/usersControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/users/me", authMiddleware, userUrls);

export default router;
