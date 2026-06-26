-- Autosave: track last visited wizard step and last draft save time.
ALTER TABLE "boats" ADD COLUMN "activeStep" "OnboardingStep" NOT NULL DEFAULT 'LISTING_MODEL';
ALTER TABLE "boats" ADD COLUMN "lastSavedAt" TIMESTAMP(3);

UPDATE "boats" SET "activeStep" = "currentStep" WHERE "activeStep" IS DISTINCT FROM "currentStep";
