import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email({message: "Invalid email"}),
  password: z.string().min(6),
  role: z.enum(["user", "admin"]).default("user"),
});

export type RegisterInput = z.infer<typeof registerSchema>;


