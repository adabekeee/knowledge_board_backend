import { z } from "zod";

export const createCardSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters long")
        .max(100, "Title must be at most 100 characters long"),
})

export const updateCardSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters long")
        .max(100, "Title must be at most 100 characters long"),
})

export const assignTagSchema = z.object({
    tagIds: z
        .array(z
            .uuid("Each tag ID must be a valid UUID"))
            .max(10, "You can assign up to 10 tags to a card")

})

export const setDueDateSchema = z.object({
    dueDate: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
            message: "Due date must be a valid date string"
        })
})