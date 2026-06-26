import type { ProfileSetupInput } from "@getyourboat/shared";
import type { ProfileRole } from "@getyourboat/shared";
import { prisma } from "../../client.js";
import type { AuthProfile, ProfileRepository } from "../profile.repository.js";
import { toOwnerProfileDTO } from "../profile.repository.js";

export class PrismaProfileRepository implements ProfileRepository {
  async upsertFromAuth(id: string, email: string | null): Promise<AuthProfile> {
    const profile = await prisma.profile.upsert({
      where: { id },
      update: { email },
      create: { id, email },
    });
    return { id: profile.id, email: profile.email, role: profile.role as ProfileRole };
  }

  async getOwnerProfile(id: string) {
    const profile = await prisma.profile.findUnique({ where: { id } });
    return profile ? toOwnerProfileDTO(profile) : null;
  }

  async updateOwnerProfile(id: string, input: ProfileSetupInput) {
    const profile = await prisma.profile.update({
      where: { id },
      data: {
        fullName: input.fullName,
        phone: input.phone,
        companyName: input.companyName,
        avatarUrl: input.avatarUrl,
        address: input.address,
        language: input.language,
      },
    });
    return toOwnerProfileDTO(profile);
  }
}
