-- CreateEnum
CREATE TYPE "ExperienceStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'ACTIVE', 'PAUSED', 'REJECTED');
CREATE TYPE "ExperienceCategory" AS ENUM ('BOAT_TOUR', 'WATER_SPORTS', 'FISHING', 'DIVING_SNORKELING', 'SUNSET_CRUISE', 'PRIVATE_CHARTER_EXPERIENCE', 'WORKSHOP_CLASS', 'OTHER');
CREATE TYPE "ExperienceStep" AS ENUM ('CATEGORY', 'TITLE_DESCRIPTION', 'INCLUDED_INFO', 'LOGISTICS', 'PRICING', 'CANCELLATION', 'MEDIA');
CREATE TYPE "ExperiencePricingType" AS ENUM ('PER_PERSON', 'PER_GROUP');
CREATE TYPE "CancellationPolicyType" AS ENUM ('FREE_24H', 'FREE_48H', 'NON_REFUNDABLE', 'CUSTOM');

-- CreateTable
CREATE TABLE "experiences" (
    "id" UUID NOT NULL,
    "captainId" UUID NOT NULL,
    "status" "ExperienceStatus" NOT NULL DEFAULT 'DRAFT',
    "currentStep" "ExperienceStep" NOT NULL DEFAULT 'CATEGORY',
    "completedSteps" "ExperienceStep"[] DEFAULT ARRAY[]::"ExperienceStep"[],
    "category" "ExperienceCategory",
    "title" TEXT NOT NULL DEFAULT '',
    "shortDescription" TEXT NOT NULL DEFAULT '',
    "fullDescription" TEXT NOT NULL DEFAULT '',
    "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "included" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notIncluded" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notAllowed" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "knowBeforeYouGo" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "emergencyContactPhone" TEXT,
    "durationMinutes" INTEGER NOT NULL DEFAULT 60,
    "meetingPoint" TEXT NOT NULL DEFAULT '',
    "meetingPointLat" DOUBLE PRECISION,
    "meetingPointLng" DOUBLE PRECISION,
    "meetingTime" TEXT NOT NULL DEFAULT '',
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "minParticipants" INTEGER NOT NULL DEFAULT 1,
    "maxParticipants" INTEGER NOT NULL DEFAULT 10,
    "requiredEquipment" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "accessibilityInfo" TEXT,
    "basePrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "pricingType" "ExperiencePricingType" NOT NULL DEFAULT 'PER_PERSON',
    "childDiscountPercent" INTEGER,
    "cancellationPolicy" "CancellationPolicyType" NOT NULL DEFAULT 'FREE_24H',
    "cancellationPolicyText" TEXT,
    "coverPhotoUrl" TEXT NOT NULL DEFAULT '',
    "photoUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "videoUrl" TEXT,
    "reviewNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "experiences_captainId_idx" ON "experiences"("captainId");
CREATE INDEX "experiences_status_idx" ON "experiences"("status");
CREATE INDEX "experiences_category_idx" ON "experiences"("category");

-- AddForeignKey
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_captainId_fkey" FOREIGN KEY ("captainId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
