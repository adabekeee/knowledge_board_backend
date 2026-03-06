import { z } from "zod";

export const registerSchema = z.object({
    firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .trim(),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .trim(),

  email: z
    .email("Invalid email address")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
});

export const loginSchema = z.object({
  email: z
    .email({message: "Invalid email address"})
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(1, "Password is required")
});