/**
 * Upserts boat brands/models from boat-brands.json (idempotent).
 * Run: pnpm --filter @getyourboat/database seed:boat-brands
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "../generated/client/index.js";
import type { BoatBrandSeedBrand } from "./convert-boat-brands.js";

const prisma = new PrismaClient();
const here = dirname(fileURLToPath(import.meta.url));
const JSON_PATH = resolve(here, "boat-brands.json");

async function main() {
  const { brands } = JSON.parse(readFileSync(JSON_PATH, "utf8")) as {
    brands: BoatBrandSeedBrand[];
  };

  let brandUpserts = 0;
  let modelUpserts = 0;

  for (const entry of brands) {
    const brand = await prisma.boatBrand.upsert({
      where: { name: entry.name },
      update: {
        category: entry.category,
        isActive: true,
        source: "MANUAL",
      },
      create: {
        name: entry.name,
        category: entry.category,
        isActive: true,
        source: "MANUAL",
      },
    });
    brandUpserts += 1;

    for (const model of entry.models) {
      await prisma.boatModel.upsert({
        where: {
          brandId_name: {
            brandId: brand.id,
            name: model.name,
          },
        },
        update: {
          notes: model.notes,
          isActive: true,
          source: "MANUAL",
        },
        create: {
          brandId: brand.id,
          name: model.name,
          notes: model.notes,
          isActive: true,
          source: "MANUAL",
        },
      });
      modelUpserts += 1;
    }
  }

  const [brandCount, modelCount] = await Promise.all([
    prisma.boatBrand.count(),
    prisma.boatModel.count(),
  ]);

  console.log("Seed complete:");
  console.log(`  Processed brands: ${brandUpserts}`);
  console.log(`  Processed models: ${modelUpserts}`);
  console.log(`  DB totals: ${brandCount} brands, ${modelCount} models`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
