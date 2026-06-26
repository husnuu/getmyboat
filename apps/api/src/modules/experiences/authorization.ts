import type { AuthUser } from "../../plugins/captain-auth.js";
import { experienceRepository } from "@getyourboat/database";
import { forbidden, notFound } from "../../lib/errors.js";

export async function loadOwnedExperience(id: string, user: AuthUser) {
  const exp = await experienceRepository.getOwned(id, user.id);
  if (!exp) throw notFound("Deneyim bulunamadı");
  return exp;
}

export async function loadExperienceForCaptain(id: string, user: AuthUser) {
  return loadOwnedExperience(id, user);
}

export function assertEditableStatus(status: string) {
  if (status === "REJECTED") {
    throw forbidden("Reddedilen deneyim düzenlenemez");
  }
}

export function assertStatusToggle(status: string) {
  if (!["APPROVED", "ACTIVE", "PAUSED"].includes(status)) {
    throw forbidden("Bu durumdaki deneyim yayına alınamaz veya duraklatılamaz");
  }
}
