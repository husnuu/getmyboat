import type { BoatBrandDTO, BoatModelDTO, BrandModelRequestDTO } from "@getyourboat/shared";
import type { BoatBrandCategory, BrandModelRequestStatus } from "@getyourboat/shared";

export interface BoatBrandRepository {
  listBrands(category?: BoatBrandCategory, activeOnly?: boolean): Promise<BoatBrandDTO[]>;
  listModels(brandId: string, activeOnly?: boolean): Promise<BoatModelDTO[]>;
  findBrandByName(name: string): Promise<BoatBrandDTO | null>;
  createBrand(input: {
    name: string;
    category: BoatBrandCategory;
    logoUrl?: string | null;
  }): Promise<BoatBrandDTO>;
  createModel(input: {
    brandId: string;
    name: string;
    notes?: string | null;
  }): Promise<BoatModelDTO>;
  createRequest(input: {
    captainId: string;
    requestedBrand: string;
    requestedModel?: string | null;
  }): Promise<BrandModelRequestDTO>;
  listRequests(status?: BrandModelRequestStatus): Promise<BrandModelRequestDTO[]>;
  getRequest(id: string): Promise<BrandModelRequestDTO | null>;
  updateRequestStatus(id: string, status: BrandModelRequestStatus): Promise<BrandModelRequestDTO>;
}

export function toBoatBrandDTO(row: {
  id: string;
  name: string;
  category: string;
  logoUrl: string | null;
  isActive: boolean;
  source: string;
  _count?: { models: number };
}): BoatBrandDTO {
  return {
    id: row.id,
    name: row.name,
    category: row.category as BoatBrandCategory,
    logoUrl: row.logoUrl,
    isActive: row.isActive,
    source: row.source as BoatBrandDTO["source"],
    modelCount: row._count?.models,
  };
}

export function toBoatModelDTO(row: {
  id: string;
  brandId: string;
  name: string;
  notes: string | null;
  isActive: boolean;
  source: string;
}): BoatModelDTO {
  return {
    id: row.id,
    brandId: row.brandId,
    name: row.name,
    notes: row.notes,
    isActive: row.isActive,
    source: row.source as BoatModelDTO["source"],
  };
}

export function toBrandModelRequestDTO(row: {
  id: string;
  captainId: string;
  requestedBrand: string;
  requestedModel: string | null;
  status: string;
  createdAt: Date;
  captain?: { fullName: string | null; email: string | null } | null;
}): BrandModelRequestDTO {
  return {
    id: row.id,
    captainId: row.captainId,
    captainName: row.captain?.fullName ?? null,
    captainEmail: row.captain?.email ?? null,
    requestedBrand: row.requestedBrand,
    requestedModel: row.requestedModel,
    status: row.status as BrandModelRequestStatus,
    createdAt: row.createdAt,
  };
}
