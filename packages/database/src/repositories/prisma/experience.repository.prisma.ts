import { prisma } from "../../client.js";
import type { ExperienceProgressState } from "@getyourboat/shared";
import type { ExperienceStatus } from "@getyourboat/shared";
import type {
  ExperienceRepository,
  ExperienceWriteBase,
} from "../experience.repository.js";
import { toExperienceDTO, toExperienceListItem } from "../experience.repository.js";

export class PrismaExperienceRepository implements ExperienceRepository {
  async createDraft(captainId: string) {
    const row = await prisma.experience.create({
      data: { captainId },
    });
    return toExperienceDTO(row);
  }

  async listByCaptain(captainId: string) {
    const rows = await prisma.experience.findMany({
      where: { captainId },
      orderBy: { updatedAt: "desc" },
    });
    return rows.map(toExperienceListItem);
  }

  async getById(id: string) {
    const row = await prisma.experience.findUnique({ where: { id } });
    return row ? toExperienceDTO(row) : null;
  }

  async getOwned(id: string, captainId: string) {
    const row = await prisma.experience.findFirst({ where: { id, captainId } });
    return row ? toExperienceDTO(row) : null;
  }

  async updateFields(id: string, data: ExperienceWriteBase) {
    const row = await prisma.experience.update({
      where: { id },
      data: {
        ...data,
        basePrice: data.basePrice,
      },
    });
    return toExperienceDTO(row);
  }

  async updateProgress(id: string, progress: ExperienceProgressState) {
    await prisma.experience.update({
      where: { id },
      data: {
        completedSteps: progress.completedSteps,
        currentStep: progress.currentStep,
      },
    });
  }

  async updateStatus(id: string, status: ExperienceStatus, reviewNote?: string | null) {
    const row = await prisma.experience.update({
      where: { id },
      data: {
        status,
        ...(reviewNote !== undefined ? { reviewNote } : {}),
      },
    });
    return toExperienceDTO(row);
  }

  async delete(id: string) {
    await prisma.experience.delete({ where: { id } });
  }
}
