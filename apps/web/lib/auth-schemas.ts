import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2).max(60),
    email: z.string().trim().email(),
    password: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
