/**
 * Reads boat-brands-source.xlsx → boat-brands.json
 * Run: pnpm --filter @getyourboat/database convert:boat-brands
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as XLSX from "xlsx";

const here = dirname(fileURLToPath(import.meta.url));
const SOURCE = resolve(here, "source/boat-brands-source.xlsx");
const OUTPUT = resolve(here, "boat-brands.json");

export type BoatBrandCategoryKey =
  | "MOTORYACHT"
  | "SAILBOAT_CATAMARAN"
  | "GULET"
  | "RIB";

export interface BoatBrandSeedRow {
  category: BoatBrandCategoryKey;
  brand: string;
  model: string;
  notes: string | null;
}

export interface BoatBrandSeedBrand {
  category: BoatBrandCategoryKey;
  name: string;
  models: Array<{ name: string; notes: string | null }>;
}

const CATEGORY_MAP: Record<string, BoatBrandCategoryKey> = {
  "Motoryat / Motorboat": "MOTORYACHT",
  "Sailboat / Katamaran": "SAILBOAT_CATAMARAN",
  "Gulet (Özel Yapım)": "GULET",
  "RIB / Günlük Kiralama": "RIB",
};

function normalizeCategory(raw: string): BoatBrandCategoryKey {
  const key = CATEGORY_MAP[raw.trim()];
  if (!key) {
    throw new Error(`Unknown category: "${raw}"`);
  }
  return key;
}

function convert(): BoatBrandSeedBrand[] {
  const workbook = XLSX.read(readFileSync(SOURCE), { type: "buffer" });
  const sheetName = workbook.SheetNames.includes("Brand_Model_Seed")
    ? "Brand_Model_Seed"
    : workbook.SheetNames[0]!;
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(workbook.Sheets[sheetName]!);

  const grouped = new Map<string, BoatBrandSeedBrand>();

  for (const row of rows) {
    const category = normalizeCategory(String(row.Category ?? row.category ?? ""));
    const brand = String(row.Brand ?? row.brand ?? "").trim();
    const model = String(row.Model ?? row.model ?? "").trim();
    const notesRaw = row.Notes ?? row.notes;
    const notes = notesRaw ? String(notesRaw).trim() || null : null;

    if (!brand || !model) continue;

    const groupKey = `${category}::${brand}`;
    const existing = grouped.get(groupKey) ?? { category, name: brand, models: [] };
    existing.models.push({ name: model, notes });
    grouped.set(groupKey, existing);
  }

  return [...grouped.values()].sort((a, b) =>
    a.category === b.category ? a.name.localeCompare(b.name) : a.category.localeCompare(b.category)
  );
}

function main() {
  const brands = convert();
  const modelCount = brands.reduce((sum, b) => sum + b.models.length, 0);
  const byCategory = brands.reduce<Record<string, number>>((acc, b) => {
    acc[b.category] = (acc[b.category] ?? 0) + 1;
    return acc;
  }, {});

  writeFileSync(OUTPUT, JSON.stringify({ brands }, null, 2));

  console.log("boat-brands.json written:", OUTPUT);
  console.log(`Total brands: ${brands.length}`);
  console.log(`Total models: ${modelCount}`);
  console.log("By category:", byCategory);

  const gulet = brands.find((b) => b.name === "Custom Built / Gulet");
  if (gulet) {
    console.log(`Custom Built / Gulet: ${gulet.models.length} reference models`);
  } else {
    console.warn("WARNING: Custom Built / Gulet brand not found");
  }
}

main();
