import type { BoatBrandCategory, BrandModelRequestStatus } from "@getyourboat/shared";
import { prisma } from "../../client.js";
import type { BoatBrandRepository } from "../boat-brand.repository.js";
import {
  toBoatBrandDTO,
  toBoatModelDTO,
  toBrandModelRequestDTO,
} from "../boat-brand.repository.js";

export class PrismaBoatBrandRepository implements BoatBrandRepository {
  async listBrands(category?: BoatBrandCategory, activeOnly = true) {
    const rows = await prisma.boatBrand.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(activeOnly ? { isActive: true } : {}),
      },
      include: { _count: { select: { models: true } } },
      orderBy: { name: "asc" },
    });
    return rows.map(toBoatBrandDTO);
  }

  async listModels(brandId: string, activeOnly = true) {
    const rows = await prisma.boatModel.findMany({
      where: {
        brandId,
        ...(activeOnly ? { isActive: true } : {}),
      },
      orderBy: { name: "asc" },
    });
    return rows.map(toBoatModelDTO);
  }

  async findBrandByName(name: string) {
    const row = await prisma.boatBrand.findUnique({ where: { name } });
    return row ? toBoatBrandDTO(row) : null;
  }

  async createBrand(input: {
    name: string;
    category: BoatBrandCategory;
    logoUrl?: string | null;
  }) {
    const row = await prisma.boatBrand.create({
      data: {
        name: input.name,
        category: input.category,
        logoUrl: input.logoUrl ?? null,
        source: "MANUAL",
      },
    });
    return toBoatBrandDTO(row);
  }

  async createModel(input: { brandId: string; name: string; notes?: string | null }) {
    const row = await prisma.boatModel.create({
      data: {
        brandId: input.brandId,
        name: input.name,
        notes: input.notes ?? null,
        source: "MANUAL",
      },
    });
    return toBoatModelDTO(row);
  }

  async createRequest(input: {
    captainId: string;
    requestedBrand: string;
    requestedModel?: string | null;
  }) {
    const row = await prisma.brandModelRequest.create({
      data: {
        captainId: input.captainId,
        requestedBrand: input.requestedBrand,
        requestedModel: input.requestedModel ?? null,
      },
      include: { captain: { select: { fullName: true, email: true } } },
    });
    return toBrandModelRequestDTO(row);
  }

  async listRequests(status?: BrandModelRequestStatus) {
    const rows = await prisma.brandModelRequest.findMany({
      where: status ? { status } : undefined,
      include: { captain: { select: { fullName: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toBrandModelRequestDTO);
  }

  async getRequest(id: string) {
    const row = await prisma.brandModelRequest.findUnique({
      where: { id },
      include: { captain: { select: { fullName: true, email: true } } },
    });
    return row ? toBrandModelRequestDTO(row) : null;
  }

  async updateRequestStatus(id: string, status: BrandModelRequestStatus) {
    const row = await prisma.brandModelRequest.update({
      where: { id },
      data: { status },
      include: { captain: { select: { fullName: true, email: true } } },
    });
    return toBrandModelRequestDTO(row);
  }
}
