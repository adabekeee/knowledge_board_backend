import { z } from "zod";

export const createBoardSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters long")
        .max(100, "Title must be at most 100 characters long")
});

export const updateBoardSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters long")
        .max(100, "Title must be at most 100 characters long")
});