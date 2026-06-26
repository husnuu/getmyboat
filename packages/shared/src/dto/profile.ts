/** Owner profile fields collected before the boat wizard (stepper dışı). */
export interface OwnerProfileDTO {
  id: string;
  email: string | null;
  fullName: string | null;
  phone: string | null;
  companyName: string | null;
  avatarUrl: string | null;
  address: string | null;
  language: string | null;
  /** True when all required owner profile fields are filled. */
  isComplete: boolean;
}

export const PROFILE_REQUIRED_KEYS = [
  "full_name_contact_person",
  "phone_number",
  "company_business_name",
  "profile_photo_logo",
  "address_location",
  "language",
] as const;

/** Seed key → profile DTO field (email/password handled by Supabase Auth). */
export const PROFILE_FIELD_MAP = {
  full_name_contact_person: "fullName",
  phone_number: "phone",
  company_business_name: "companyName",
  profile_photo_logo: "avatarUrl",
  address_location: "address",
  language: "language",
} as const;
