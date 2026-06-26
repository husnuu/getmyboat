import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Şifre en az 8 karakter olmalı")
  .regex(/[A-Z]/, "En az bir büyük harf içermeli")
  .regex(/[0-9]/, "En az bir rakam içermeli");

export const captainSignupSchema = z.object({
  email: z.string().email("Geçerli bir e-posta gir"),
  password: passwordSchema,
  fullName: z.string().min(2, "Ad soyad en az 2 karakter").max(120),
});

export const signupFormSchema = captainSignupSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

export type SignupInput = z.infer<typeof captainSignupSchema>;
export type SignupFormInput = z.infer<typeof signupFormSchema>;

export const captainLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
});

export type CaptainLoginInput = z.infer<typeof captainLoginSchema>;

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const logoutSchema = refreshTokenSchema;
