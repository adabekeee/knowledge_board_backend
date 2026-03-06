// src/validators/comment.validator.ts
import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().min(1, { message: "Comment content is required" }),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, { message: "Comment content is required" }),
});