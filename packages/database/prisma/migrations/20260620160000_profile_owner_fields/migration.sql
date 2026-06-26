-- AlterTable
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "companyName" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "address" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "language" TEXT DEFAULT 'tr';
