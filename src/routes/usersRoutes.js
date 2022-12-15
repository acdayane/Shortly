import { Router } from "express";
import { signUp, signIn } from "../controllers/usersControllers.js";

const router = Router();

router.post("/signup", signUp);
router.post("/sign-in", signIn);

export default router;
