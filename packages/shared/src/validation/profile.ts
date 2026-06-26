import { z } from "zod";

export const profileSetupSchema = z.object({
  fullName: z.string().min(2).max(120),
  phone: z.string().min(6).max(40),
  companyName: z.string().min(2).max(160),
  avatarUrl: z.string().min(1).max(500),
  address: z.string().min(3).max(300),
  language: z.string().min(2).max(10),
});

export type ProfileSetupInput = z.infer<typeof profileSetupSchema>;

export function isOwnerProfileComplete(
  profile: Pick<
    ProfileSetupInput,
    "fullName" | "phone" | "companyName" | "avatarUrl" | "address" | "language"
  >
): boolean {
  return profileSetupSchema.safeParse(profile).success;
}
