import type { ProfileRole } from "@getyourboat/shared";

export interface CaptainAuthProfile {
  id: string;
  email: string;
  fullName: string | null;
  role: ProfileRole;
  passwordHash: string | null;
}

export interface AuthRepository {
  createCaptain(input: {
    email: string;
    passwordHash: string;
    fullName: string;
  }): Promise<CaptainAuthProfile>;
  findByEmail(email: string): Promise<CaptainAuthProfile | null>;
  findById(id: string): Promise<CaptainAuthProfile | null>;
  saveRefreshToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void>;
  findRefreshToken(tokenHash: string): Promise<{
    id: string;
    userId: string;
    expiresAt: Date;
    revoked: boolean;
  } | null>;
  revokeRefreshToken(tokenHash: string): Promise<void>;
}

export function toAuthUser(profile: Pick<CaptainAuthProfile, "id" | "email" | "fullName" | "role">) {
  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.fullName,
    role: profile.role,
  };
}
