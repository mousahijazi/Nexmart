import { z } from "zod";

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(30, "First name must not exceed 30 characters")
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(30, "Last name must not exceed 30 characters")
    .optional(),

  phoneNumber: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]*$/, "Please enter a valid phone number")
    .optional(),
});