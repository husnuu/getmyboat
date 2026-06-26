import { BoatBrandCategory } from "./enums";

export const NOT_IN_LIST = "__NOT_IN_LIST__";
export const GULET_BRAND_NAME = "Custom Built / Gulet";

/** Maps onboarding boat type keys to brand catalog categories. */
export function boatTypeToBrandCategory(boatTypeKey: string): BoatBrandCategory | null {
  switch (boatTypeKey) {
    case "motoryacht":
      return BoatBrandCategory.MOTORYACHT;
    case "sailboat":
    case "catamaran":
      return BoatBrandCategory.SAILBOAT_CATAMARAN;
    case "gulet":
      return BoatBrandCategory.GULET;
    case "rib":
      return BoatBrandCategory.RIB;
    default:
      return null;
  }
}

export function isGuletBoatType(boatTypeKey: string): boolean {
  return boatTypeKey === "gulet";
}

export const BOAT_BRAND_CATEGORY_LABELS: Record<BoatBrandCategory, string> = {
  [BoatBrandCategory.MOTORYACHT]: "Motoryat",
  [BoatBrandCategory.SAILBOAT_CATAMARAN]: "Yelkenli / Katamaran",
  [BoatBrandCategory.GULET]: "Gulet",
  [BoatBrandCategory.RIB]: "RIB",
};
