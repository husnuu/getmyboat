/** Unit enums and conversion helpers — single source for api + captain + web. */

export const LengthUnit = { M: "M", FT: "FT" } as const;
export type LengthUnit = (typeof LengthUnit)[keyof typeof LengthUnit];

export const VolumeUnit = { L: "L", GAL: "GAL" } as const;
export type VolumeUnit = (typeof VolumeUnit)[keyof typeof VolumeUnit];

export const FuelRateUnit = { LPH: "LPH", GPH: "GPH" } as const;
export type FuelRateUnit = (typeof FuelRateUnit)[keyof typeof FuelRateUnit];

export const SpeedUnit = { KN: "KN", MPH: "MPH" } as const;
export type SpeedUnit = (typeof SpeedUnit)[keyof typeof SpeedUnit];

export type UnitFieldKind = "length" | "volume" | "fuel_rate" | "speed" | "hour";

export interface UnitFieldConfig {
  kind: UnitFieldKind;
  defaultUnit: string;
  unitOptions: { value: string; label: string }[];
}

export const UNIT_FIELD_CONFIG: Record<string, UnitFieldConfig> = {
  length_ft_m: {
    kind: "length",
    defaultUnit: LengthUnit.M,
    unitOptions: [
      { value: LengthUnit.M, label: "Metre (m)" },
      { value: LengthUnit.FT, label: "Feet (ft)" },
    ],
  },
  beam_width: {
    kind: "length",
    defaultUnit: LengthUnit.M,
    unitOptions: [
      { value: LengthUnit.M, label: "Metre (m)" },
      { value: LengthUnit.FT, label: "Feet (ft)" },
    ],
  },
  draft: {
    kind: "length",
    defaultUnit: LengthUnit.M,
    unitOptions: [
      { value: LengthUnit.M, label: "Metre (m)" },
      { value: LengthUnit.FT, label: "Feet (ft)" },
    ],
  },
  water_tank_capacity: {
    kind: "volume",
    defaultUnit: VolumeUnit.L,
    unitOptions: [
      { value: VolumeUnit.L, label: "Litre (L)" },
      { value: VolumeUnit.GAL, label: "Gallon (gal)" },
    ],
  },
  waste_tank_capacity: {
    kind: "volume",
    defaultUnit: VolumeUnit.L,
    unitOptions: [
      { value: VolumeUnit.L, label: "Litre (L)" },
      { value: VolumeUnit.GAL, label: "Gallon (gal)" },
    ],
  },
  fuel_tank_capacity: {
    kind: "volume",
    defaultUnit: VolumeUnit.L,
    unitOptions: [
      { value: VolumeUnit.L, label: "Litre (L)" },
      { value: VolumeUnit.GAL, label: "Gallon (gal)" },
    ],
  },
  fuel_consumption: {
    kind: "fuel_rate",
    defaultUnit: FuelRateUnit.LPH,
    unitOptions: [
      { value: FuelRateUnit.LPH, label: "L/saat" },
      { value: FuelRateUnit.GPH, label: "Gal/saat" },
    ],
  },
  max_speed: {
    kind: "speed",
    defaultUnit: SpeedUnit.KN,
    unitOptions: [
      { value: SpeedUnit.KN, label: "Knot (kn)" },
      { value: SpeedUnit.MPH, label: "Mph" },
    ],
  },
};

export const HOUR_FIELD_KEYS = ["daily_a_c_usage", "daily_cruising_time"] as const;

export const HOUR_OPTIONS = Array.from({ length: 25 }, (_, i) => ({
  value: String(i),
  label: i === 1 ? "1 hour" : `${i} hours`,
}));

export function isUnitFieldKey(key: string): boolean {
  return key in UNIT_FIELD_CONFIG;
}

export function isHourFieldKey(key: string): boolean {
  return (HOUR_FIELD_KEYS as readonly string[]).includes(key);
}

export function unitSuffix(key: string, suffix: "unit" | "raw"): string {
  return `${key}_${suffix}`;
}

/** Keys stored in the UI map but not persisted as BoatFeatureValue rows. */
export function isInternalFeatureStorageKey(key: string): boolean {
  return (
    key === "manufacturer_brand_id" ||
    key === "model_id" ||
    key.endsWith("_unit") ||
    key.endsWith("_raw")
  );
}

/** Builds API feature writes from wizard value map (drops UI-only companion keys). */
export function buildFeatureWritesFromValues(
  values: Record<string, string>
): { key: string; value: string }[] {
  return Object.entries(values)
    .filter(([key, value]) => !isInternalFeatureStorageKey(key) && value.trim() !== "")
    .map(([key, value]) => ({ key, value }));
}

export function sanitizeFeatureWrites(
  features: { key: string; value?: string | null }[]
): { key: string; value: string | null }[] {
  return features
    .filter((f) => !isInternalFeatureStorageKey(f.key))
    .map((f) => ({ key: f.key, value: f.value ?? null }));
}

const FT_PER_M = 3.28084;
const L_PER_GAL = 3.78541;
const KN_PER_MPH = 0.868976;

export function feetToMeters(ft: number): number {
  return ft / FT_PER_M;
}

export function metersToFeet(m: number): number {
  return m * FT_PER_M;
}

export function gallonsToLiters(gal: number): number {
  return gal * L_PER_GAL;
}

export function litersToGallons(l: number): number {
  return l / L_PER_GAL;
}

export function mphToKnots(mph: number): number {
  return mph * KN_PER_MPH;
}

export function knotsToMph(kn: number): number {
  return kn / KN_PER_MPH;
}

/** Converts captain input to standard stored value (metre / litre / knot / LPH). */
export function toStandardValue(
  fieldKey: string,
  rawValue: number,
  unit: string
): number {
  const cfg = UNIT_FIELD_CONFIG[fieldKey];
  if (!cfg) return rawValue;

  switch (cfg.kind) {
    case "length":
      return unit === LengthUnit.FT ? feetToMeters(rawValue) : rawValue;
    case "volume":
      return unit === VolumeUnit.GAL ? gallonsToLiters(rawValue) : rawValue;
    case "fuel_rate":
      return unit === FuelRateUnit.GPH ? gallonsToLiters(rawValue) : rawValue;
    case "speed":
      return unit === SpeedUnit.MPH ? mphToKnots(rawValue) : rawValue;
    default:
      return rawValue;
  }
}

/** Parses stored feature map into raw + unit for a unit field. */
export function parseUnitFieldValues(
  key: string,
  values: Record<string, string>
): { raw: string; unit: string; standard: string } {
  const cfg = UNIT_FIELD_CONFIG[key];
  const unit = values[unitSuffix(key, "unit")] ?? cfg?.defaultUnit ?? LengthUnit.M;
  const raw = values[unitSuffix(key, "raw")] ?? values[key] ?? "";
  const standard = values[key] ?? "";
  return { raw, unit, standard };
}

/** Writes unit field triple into a feature value map. */
export function writeUnitFieldValues(
  key: string,
  raw: string,
  unit: string,
  target: Record<string, string>
): void {
  const num = Number(raw);
  if (!raw.trim() || Number.isNaN(num)) {
    delete target[key];
    delete target[unitSuffix(key, "unit")];
    delete target[unitSuffix(key, "raw")];
    return;
  }
  const standard = toStandardValue(key, num, unit);
  target[unitSuffix(key, "raw")] = raw;
  target[unitSuffix(key, "unit")] = unit;
  target[key] = String(Number(standard.toFixed(4)));
}
