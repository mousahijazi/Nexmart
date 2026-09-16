// todo
import { z } from "zod";

export const registerUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(30, "First name must not exceed 30 characters"),
    
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(30, "Last name must not exceed 30 characters"),
    
  email: z
    .string()
    .email("Please enter a valid email address"),
    
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
    
  phoneNumber: z
    .string()
    .regex(/^[0-9+\-\s()]*$/, "Please enter a valid phone number")
});