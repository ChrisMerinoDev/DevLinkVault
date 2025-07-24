import { z } from "zod";

export const RegisterSchema = z.object({
    username: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(6).max(100),
});

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
  });
  
