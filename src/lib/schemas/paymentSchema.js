import {z} from "zod";

export const paymentSchema = z.object({
    name: z.string().min(1, "Cardholder name is required").max(26, "Maximum 26 characters").regex(/^[a-zA-Z\s]+$/, "Name cannot contain numbers or special characters"),
    number: z.string().length(19, "Card number must be 16 digits").regex(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, "Invalid card number"),
    month: z.string().length(2, "Month must contain 2 digits").trim().regex(/^(0[1-9]|1[0-2])$/, "Invalid month"),
    year: z.string().trim().length(2, "Year must contain 2 digits").regex(/^\d{2}$/, "Invalid year"),
    cvc: z.string().trim().length(3, "CVC must contain 3 digits").regex(/^\d{3}$/, "Invalid CVC"),
});

export const addressSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(20, "Maximum 20 characters").regex(/^[A-Za-z]+$/, "Only English letters are allowed"),
  lastName: z.string().trim().min(1, "Last name is required").max(20, "Maximum 20 characters").regex(/^[A-Za-z]+$/, "Only English letters are allowed"),
  phone: z.string().trim().min(8, "Phone number is too short").max(15, "Phone number is too long").regex(/^\+?[0-9]+$/, "Invalid phone number"),
  city: z.string().trim().min(2, "City is required").max(40, "Maximum 40 characters").regex(/^[A-Za-z ]+$/, "Only English letters are allowed"),
  address: z.string().trim().min(5, "Address is too short").max(120, "Maximum 120 characters"),
  notes: z.string().trim().max(300, "Maximum 300 characters").optional().or(z.literal("")),
});

export const registerSchema = (isLogin) => z.object({
  firstName:  isLogin
            ? z.string().optional()
            : z.string().trim().min(2, "First name must be at least 2 characters").max(20, "Maximum 20 characters").regex(/^[A-Za-z]+$/, "Only English letters are allowed"),
  lastName: isLogin
            ? z.string().optional()
            : z.string().trim().min(2, "Last name must be at least 2 characters").max(20, "Maximum 20 characters").regex(/^[A-Za-z]+$/, "Only English letters are allowed"),
  email: z.string().trim().email("Invalid email address").max(100),
  password: z.string().trim().min(6, "Password must contain at least 6 characters").max(50),
});

export const updateProfileSchema = z.object({
    firstName: z.string().trim().min(2).max(20).regex(/^[A-Za-z]+$/),
    lastName: z.string().trim().min(2).max(20).regex(/^[A-Za-z]+$/),
    phone: z.string().trim().min(8).max(15).regex(/^\+?[0-9]+$/),
});