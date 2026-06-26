import type { OnboardingConfigDTO, OnboardingFieldDTO, ResolvedOnboardingConfigDTO } from "../dto/onboarding";
import { resolvePackagesFromListingModels } from "./constants";
import {
  filterAmenityCategories,
  filterDocumentTypes,
  filterFeatureGroups,
  getRequiredFieldKeys,
} from "./required-fields";

export function resolveOnboardingConfig(
  config: OnboardingConfigDTO,
  fields: OnboardingFieldDTO[],
  listingModelKeys: string[]
): ResolvedOnboardingConfigDTO {
  const packages = resolvePackagesFromListingModels(listingModelKeys);
  const requiredFieldKeys = getRequiredFieldKeys(fields, listingModelKeys);
  const keySet = new Set(requiredFieldKeys);
  const scopedFields = fields.filter((f) => keySet.has(f.key));

  return {
    ...config,
    packages,
    requiredFieldKeys,
    fields: scopedFields,
    featureGroups: filterFeatureGroups(config.featureGroups, keySet),
    amenityCategories: filterAmenityCategories(config.amenityCategories, keySet),
    documentTypes: filterDocumentTypes(config.documentTypes, keySet).map((d) => ({
      ...d,
      required: true,
    })),
  };
}
