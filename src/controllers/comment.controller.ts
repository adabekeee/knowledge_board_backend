// src/controllers/comment.controller.ts
import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import * as commentService from "../service/comment.service.js";
import { createCommentSchema, updateCommentSchema } from "../validators/comment.validator.js";

export const createComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cardId = req.params?.cardId as string | null;
    const userId = req.user?.userId;

    if (!cardId) return res.status(400).json({ message: "Card ID is required" });
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { content } = createCommentSchema.parse(req.body);

    const comment = await commentService.createComment({ content, cardId, userId });

    return res.status(201).json({
      message: "Comment created successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

export const getCommentsByCard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cardId = req.params?.cardId as string | null;

    if (!cardId) return res.status(400).json({ message: "Card ID is required" });

    const comments = await commentService.getCommentsByCard(cardId);

    return res.status(200).json({
      message: "Comments retrieved successfully",
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const commentId = req.params?.commentId as string | null;

    if (!commentId) return res.status(400).json({ message: "Comment ID is required" });

    const { content } = updateCommentSchema.parse(req.body);

    const comment = await commentService.updateComment(commentId, content);

    return res.status(200).json({
      message: "Comment updated successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const commentId = req.params?.commentId as string | null;

    if (!commentId) return res.status(400).json({ message: "Comment ID is required" });

    await commentService.deleteComment(commentId);

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};