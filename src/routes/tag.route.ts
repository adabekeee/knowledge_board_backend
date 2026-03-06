import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import * as tagController from "../controllers/tag.controller.js";

const router = Router();

router.post("/", authMiddleware, tagController.createTag);

router.get("/", authMiddleware, tagController.getAllTags);

router.patch("/:tagId", authMiddleware, tagController.updateTag);

router.delete("/:tagId", authMiddleware, tagController.deleteTag);

export default router;