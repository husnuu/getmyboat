-- Boat brand/model lookup tables + captain brand/model requests

CREATE TYPE "DataSource" AS ENUM ('MANUAL', 'EXTERNAL_API');
CREATE TYPE "BrandModelRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "BoatBrandCategory" AS ENUM ('MOTORYACHT', 'SAILBOAT_CATAMARAN', 'GULET', 'RIB');

CREATE TABLE "boat_brands" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "category" "BoatBrandCategory" NOT NULL,
    "logoUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "source" "DataSource" NOT NULL DEFAULT 'MANUAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "boat_brands_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "boat_models" (
    "id" UUID NOT NULL,
    "brandId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "source" "DataSource" NOT NULL DEFAULT 'MANUAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "boat_models_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "brand_model_requests" (
    "id" UUID NOT NULL,
    "captainId" UUID NOT NULL,
    "requestedBrand" TEXT NOT NULL,
    "requestedModel" TEXT,
    "status" "BrandModelRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brand_model_requests_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "boat_brands_name_key" ON "boat_brands"("name");
CREATE INDEX "boat_brands_category_idx" ON "boat_brands"("category");
CREATE UNIQUE INDEX "boat_models_brandId_name_key" ON "boat_models"("brandId", "name");
CREATE INDEX "brand_model_requests_captainId_idx" ON "brand_model_requests"("captainId");
CREATE INDEX "brand_model_requests_status_idx" ON "brand_model_requests"("status");

ALTER TABLE "boat_models" ADD CONSTRAINT "boat_models_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "boat_brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "brand_model_requests" ADD CONSTRAINT "brand_model_requests_captainId_fkey" FOREIGN KEY ("captainId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
