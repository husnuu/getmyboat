/** Listing models the captain picks in step 1. */
export const LISTING_MODEL_KEYS = [
  "hourly",
  "daily",
  "overnight",
  "weekly_charter",
] as const;
export type ListingModelKey = (typeof LISTING_MODEL_KEYS)[number];

/** Requirement packages seeded from the PDF matrix. */
export const ONBOARDING_PACKAGE_KEYS = [
  "seahub_hourly",
  "seahub_stay_included",
] as const;
export type OnboardingPackageKey = (typeof ONBOARDING_PACKAGE_KEYS)[number];

/** Hourly/Daily → Mod A; Overnight/Weekly → Mod B. */
const HOURLY_MODELS = new Set<ListingModelKey>(["hourly", "daily"]);
const STAY_MODELS = new Set<ListingModelKey>(["overnight", "weekly_charter"]);

export function resolvePackagesFromListingModels(
  listingModelKeys: string[]
): OnboardingPackageKey[] {
  const packages = new Set<OnboardingPackageKey>();
  for (const key of listingModelKeys) {
    if (HOURLY_MODELS.has(key as ListingModelKey)) packages.add("seahub_hourly");
    if (STAY_MODELS.has(key as ListingModelKey)) packages.add("seahub_stay_included");
  }
  return ONBOARDING_PACKAGE_KEYS.filter((p) => packages.has(p));
}

export function isListingModelKey(key: string): key is ListingModelKey {
  return (LISTING_MODEL_KEYS as readonly string[]).includes(key);
}
