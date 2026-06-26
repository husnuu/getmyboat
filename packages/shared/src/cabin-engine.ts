import { CabinType, EngineType, WcType } from "./enums";

export const CABIN_TYPE_LABELS: Record<CabinType, string> = {
  [CabinType.SINGLE_CABIN]: "Single Cabin",
  [CabinType.DOUBLE_CABIN]: "Double Cabin",
  [CabinType.TWIN_CABIN]: "Twin Cabin",
  [CabinType.BUNK_BED]: "Bunk Bed",
  [CabinType.THREE_PLUS_BERTHS]: "3+ Berths",
  [CabinType.SALOON]: "Saloon",
  [CabinType.SHARED_BATHROOM]: "Shared Bathroom",
};

export const WC_TYPE_LABELS: Record<WcType, string> = {
  [WcType.EXTERNAL]: "External WC / Shower",
  [WcType.EN_SUITE]: "En Suite (in cabin)",
};

export const ENGINE_TYPE_LABELS: Record<EngineType, string> = {
  [EngineType.INBOARD]: "Inboard",
  [EngineType.OUTBOARD]: "Outboard",
  [EngineType.STERN_DRIVE]: "Stern Drive (Inboard/Outboard)",
  [EngineType.JET_DRIVE]: "Jet Drive",
  [EngineType.ELECTRIC]: "Electric",
  [EngineType.SAIL_NO_ENGINE]: "Sail (No Engine)",
};

export const FUEL_FIELDS_HIDDEN_FOR_ENGINE = new Set([
  "fuel_type",
  "fuel_tank_capacity",
  "fuel_consumption",
]);
