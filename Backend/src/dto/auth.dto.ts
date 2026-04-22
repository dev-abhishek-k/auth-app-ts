import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email({message: "Invalid email"}),
  password: z.string().min(6),
  role: z.enum(["user", "admin"]).default("user"),
});

export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
export const forgotPasswordSchema = z.object({ email: z.string().email() });
export const resetPasswordSchema = z.object({ token: z.string().min(6), newPassword: z.string().min(6) });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;


