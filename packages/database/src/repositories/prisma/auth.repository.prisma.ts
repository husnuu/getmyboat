import type { ProfileRole } from "@getyourboat/shared";
import { prisma } from "../../client.js";
import type { AuthRepository, CaptainAuthProfile } from "../auth.repository.js";

function toCaptain(row: {
  id: string;
  email: string | null;
  fullName: string | null;
  role: string;
  passwordHash: string | null;
}): CaptainAuthProfile | null {
  if (!row.email) return null;
  return {
    id: row.id,
    email: row.email,
    fullName: row.fullName,
    role: row.role as ProfileRole,
    passwordHash: row.passwordHash,
  };
}

export class PrismaAuthRepository implements AuthRepository {
  async createCaptain(input: { email: string; passwordHash: string; fullName: string }) {
    const profile = await prisma.profile.create({
      data: {
        email: input.email.toLowerCase(),
        passwordHash: input.passwordHash,
        fullName: input.fullName,
        role: "OWNER",
        isVerified: true,
      },
    });
    const mapped = toCaptain(profile);
    if (!mapped) throw new Error("Profile created without email");
    return mapped;
  }

  async findByEmail(email: string) {
    const profile = await prisma.profile.findUnique({
      where: { email: email.toLowerCase() },
    });
    return profile ? toCaptain(profile) : null;
  }

  async findById(id: string) {
    const profile = await prisma.profile.findUnique({ where: { id } });
    return profile ? toCaptain(profile) : null;
  }

  async saveRefreshToken(userId: string, tokenHash: string, expiresAt: Date) {
    await prisma.refreshToken.create({
      data: { userId, tokenHash, expiresAt },
    });
  }

  async findRefreshToken(tokenHash: string) {
    return prisma.refreshToken.findUnique({ where: { tokenHash } });
  }

  async revokeRefreshToken(tokenHash: string) {
    await prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { revoked: true },
    });
  }
}
