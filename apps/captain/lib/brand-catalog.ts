import { boatTypeToBrandCategory, type BoatBrandDTO, type BoatModelDTO } from "@getyourboat/shared";
import { api } from "./api";

let allBrandsPromise: Promise<BoatBrandDTO[]> | null = null;
const modelsCache = new Map<string, BoatModelDTO[]>();

/** Loads the full brand catalog once and caches it for instant category filtering. */
export function prefetchBrandCatalog(): Promise<BoatBrandDTO[]> {
  if (!allBrandsPromise) {
    allBrandsPromise = api.listAllBoatBrands().then((r) => r.items);
  }
  return allBrandsPromise;
}

export function invalidateBrandCatalog(): void {
  allBrandsPromise = null;
  modelsCache.clear();
}

export async function getBrandsForBoatType(boatTypeKey: string): Promise<BoatBrandDTO[]> {
  const all = await prefetchBrandCatalog();
  const category = boatTypeToBrandCategory(boatTypeKey);
  if (!category) return [];
  return all.filter((b) => b.category === category);
}

export async function getModelsForBrand(brandId: string): Promise<BoatModelDTO[]> {
  const cached = modelsCache.get(brandId);
  if (cached) return cached;
  const { items } = await api.listBoatModels(brandId);
  modelsCache.set(brandId, items);
  return items;
}

export function primeModelsCache(brandId: string, models: BoatModelDTO[]): void {
  modelsCache.set(brandId, models);
}
