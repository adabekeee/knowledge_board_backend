import { z } from "zod";

export const createTagSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Tag name must be at least 3 characters long")
        .max(50, "Tag name must be at most 50 characters long"),
    color: z
        .string()
        .trim()
        .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Color must be a valid hex code")
        .optional()
});

export const updateTagSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Tag name must be at least 3 characters long")
        .max(50, "Tag name must be at most 50 characters long")
        .optional(),
    color: z
        .string()
        .trim()
        .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Color must be a valid hex code")
        .optional(),
});