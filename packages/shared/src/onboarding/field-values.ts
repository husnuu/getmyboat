import type { OnboardingFieldDTO } from "../dto/onboarding";
import type { SerializedBoatDTO } from "../dto/onboarding";

export type FieldValueMap = Record<string, string | boolean>;

/** Known mappings from seed field keys to first-class boat columns. */
export const BOAT_COLUMN_FIELD_KEYS = {
  listing_title: "title",
  description: "description",
} as const;

export function readFieldValues(
  boat: Pick<
    SerializedBoatDTO,
    "title" | "description" | "rulesText" | "checkInNotes" | "checkOutNotes" | "structuredRules"
  >,
  fields: Pick<OnboardingFieldDTO, "key">[]
): FieldValueMap {
  const rules = (boat.structuredRules ?? {}) as FieldValueMap;
  const map: FieldValueMap = { ...rules };

  for (const field of fields) {
    if (field.key === "listing_title") map[field.key] = boat.title ?? "";
    else if (field.key === "description") map[field.key] = boat.description ?? "";
    else if (!(field.key in map)) map[field.key] = "";
  }

  return map;
}

export function splitDescriptionFieldValues(values: FieldValueMap): {
  title: string;
  description: string;
  structuredRules: FieldValueMap;
} {
  const structuredRules: FieldValueMap = { ...values };
  const title = String(structuredRules.listing_title ?? "").trim();
  const description = String(structuredRules.description ?? "");
  delete structuredRules.listing_title;
  delete structuredRules.description;
  return { title, description, structuredRules };
}

export function mergePricingFieldValues(
  existing: FieldValueMap | null | undefined,
  bookingFields: FieldValueMap
): FieldValueMap {
  return { ...(existing ?? {}), ...bookingFields };
}
