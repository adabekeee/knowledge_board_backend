import { z } from "zod"

export const createColumnSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters long")
        .max(100, "Title must be at most 100 characters long"),
});

export const updateColumnSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters long")
        .max(100, "Title must be at most 100 characters long"),
});