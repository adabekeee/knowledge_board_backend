// src/routes/comment.route.ts
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import * as commentController from "../controllers/comment.controller.js";

const router = Router({ mergeParams: true });

router.post("/", authMiddleware, commentController.createComment);
router.get("/", authMiddleware, commentController.getCommentsByCard);
router.patch("/:commentId", authMiddleware, commentController.updateComment);
router.delete("/:commentId", authMiddleware, commentController.deleteComment);

export default router;