import type {
  AmenityCategoryDTO,
  BoatTypeOptionDTO,
  DocumentTypeDTO,
  FeatureGroupDTO,
  ListingModelOptionDTO,
  OnboardingConfigDTO,
  OnboardingFieldDTO,
  ResolvedOnboardingConfigDTO,
} from "@getyourboat/shared";
import { resolveOnboardingConfig } from "@getyourboat/shared";
import { prisma } from "../../client.js";
import type {
  FieldFilter,
  LookupModel,
  OnboardingLookupRepository,
} from "../lookup.repository.js";

const byOrder = { orderBy: { sortOrder: "asc" } } as const;

export class PrismaOnboardingLookupRepository implements OnboardingLookupRepository {
  getBoatTypes(): Promise<BoatTypeOptionDTO[]> {
    return prisma.boatTypeOption.findMany(byOrder);
  }

  getListingModels(): Promise<ListingModelOptionDTO[]> {
    return prisma.listingModelOption.findMany(byOrder);
  }

  getFeatureGroups(): Promise<FeatureGroupDTO[]> {
    return prisma.featureGroup.findMany({
      ...byOrder,
      include: { features: { orderBy: { sortOrder: "asc" } } },
    });
  }

  getAmenityCategories(): Promise<AmenityCategoryDTO[]> {
    return prisma.amenityCategory.findMany({
      ...byOrder,
      include: { amenities: { orderBy: { sortOrder: "asc" } } },
    });
  }

  getDocumentTypes(): Promise<DocumentTypeDTO[]> {
    return prisma.documentType.findMany(byOrder);
  }

  getFields(filter: FieldFilter): Promise<OnboardingFieldDTO[]> {
    const packageFilter = filter.packages?.length
      ? {
          inclusions: {
            some: {
              packageKey: { in: filter.packages },
              included: true,
            },
          },
        }
      : filter.package
        ? { inclusions: { some: { packageKey: filter.package, included: true } } }
        : {};

    return prisma.onboardingFieldDefinition.findMany({
      where: {
        ...(filter.type ? { type: filter.type } : {}),
        ...(filter.section ? { sectionKey: filter.section } : {}),
        ...packageFilter,
      },
      orderBy: { sortOrder: "asc" },
      include: { inclusions: true },
    });
  }

  getAllFields(): Promise<OnboardingFieldDTO[]> {
    return prisma.onboardingFieldDefinition.findMany({
      orderBy: { sortOrder: "asc" },
      include: { inclusions: true },
    });
  }

  async getResolvedConfig(listingModelKeys: string[]): Promise<ResolvedOnboardingConfigDTO> {
    const [config, fields] = await Promise.all([this.getConfig(), this.getAllFields()]);
    return resolveOnboardingConfig(config, fields, listingModelKeys);
  }

  async getConfig(): Promise<OnboardingConfigDTO> {
    const [boatTypes, listingModels, featureGroups, amenityCategories, documentTypes] =
      await Promise.all([
        this.getBoatTypes(),
        this.getListingModels(),
        this.getFeatureGroups(),
        this.getAmenityCategories(),
        this.getDocumentTypes(),
      ]);
    return { boatTypes, listingModels, featureGroups, amenityCategories, documentTypes };
  }

  countByKeys(model: LookupModel, keys: string[]): Promise<number> {
    const where = { key: { in: keys } };
    const counters: Record<LookupModel, () => Promise<number>> = {
      listingModelOption: () => prisma.listingModelOption.count({ where }),
      boatTypeOption: () => prisma.boatTypeOption.count({ where }),
      featureDefinition: () => prisma.featureDefinition.count({ where }),
      amenity: () => prisma.amenity.count({ where }),
    };
    return counters[model]();
  }
}
