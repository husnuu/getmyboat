import type { OwnerProfileDTO } from "@getyourboat/shared";
import { isOwnerProfileComplete, type ProfileSetupInput } from "@getyourboat/shared";
import type { ProfileRole } from "@getyourboat/shared";

export interface AuthProfile {
  id: string;
  email: string | null;
  role: ProfileRole;
}

/** Persistence port for the auth-mirrored profiles table. */
export interface ProfileRepository {
  upsertFromAuth(id: string, email: string | null): Promise<AuthProfile>;
  getOwnerProfile(id: string): Promise<OwnerProfileDTO | null>;
  updateOwnerProfile(id: string, input: ProfileSetupInput): Promise<OwnerProfileDTO>;
}

export function toOwnerProfileDTO(row: {
  id: string;
  email: string | null;
  fullName: string | null;
  phone: string | null;
  companyName: string | null;
  avatarUrl: string | null;
  address: string | null;
  language: string | null;
}): OwnerProfileDTO {
  const core = {
    fullName: row.fullName,
    phone: row.phone,
    companyName: row.companyName,
    avatarUrl: row.avatarUrl,
    address: row.address,
    language: row.language,
  };
  return {
    id: row.id,
    email: row.email,
    ...core,
    isComplete: isOwnerProfileComplete({
      fullName: core.fullName ?? "",
      phone: core.phone ?? "",
      companyName: core.companyName ?? "",
      avatarUrl: core.avatarUrl ?? "",
      address: core.address ?? "",
      language: core.language ?? "",
    }),
  };
}
