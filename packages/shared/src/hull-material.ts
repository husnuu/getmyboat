export const HULL_MATERIAL_FIELD_KEY = "hull_material";

export const HULL_MATERIAL_OPTIONS = [
  { value: "FIBERGLASS", label: "Fiberglass / GRP" },
  { value: "ALUMINUM", label: "Aluminum" },
  { value: "STEEL", label: "Steel" },
  { value: "WOOD", label: "Wood" },
  { value: "CARBON_FIBER", label: "Carbon Fiber" },
  { value: "COMPOSITE", label: "Composite" },
  { value: "PVC", label: "PVC (Inflatable)" },
  { value: "OTHER", label: "Other" },
] as const;

export type HullMaterialValue = (typeof HULL_MATERIAL_OPTIONS)[number]["value"];
