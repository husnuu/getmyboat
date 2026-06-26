-- CreateEnum
CREATE TYPE "CabinType" AS ENUM ('SINGLE_CABIN', 'DOUBLE_CABIN', 'TWIN_CABIN', 'BUNK_BED', 'THREE_PLUS_BERTHS', 'SALOON', 'SHARED_BATHROOM');

-- CreateEnum
CREATE TYPE "WcType" AS ENUM ('EXTERNAL', 'EN_SUITE');

-- CreateEnum
CREATE TYPE "EngineType" AS ENUM ('INBOARD', 'OUTBOARD', 'STERN_DRIVE', 'JET_DRIVE', 'ELECTRIC', 'SAIL_NO_ENGINE');

-- AlterTable
ALTER TABLE "boats" ADD COLUMN "engineType" "EngineType";

-- CreateTable
CREATE TABLE "cabin_configurations" (
    "id" UUID NOT NULL,
    "boatId" TEXT NOT NULL,
    "cabinType" "CabinType" NOT NULL,
    "wcType" "WcType",
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cabin_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cabin_configurations_boatId_idx" ON "cabin_configurations"("boatId");

-- AddForeignKey
ALTER TABLE "cabin_configurations" ADD CONSTRAINT "cabin_configurations_boatId_fkey" FOREIGN KEY ("boatId") REFERENCES "boats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
