import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { newShortUrl, getUrlById, visitUrl, deleteUrl } from "../controllers/urlsControllers.js";

const router = Router();

router.post("/urls/shorten", authMiddleware, newShortUrl);
router.get("/urls/:id", getUrlById);
router.get("/urls/open/:shortUrl", visitUrl);
router.delete("/urls/:id", authMiddleware, deleteUrl);

export default router;