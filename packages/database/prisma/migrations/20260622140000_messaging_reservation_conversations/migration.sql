-- Messaging refactor: reservation-scoped conversations, captain = Profile.id

CREATE TYPE "MessageSenderType" AS ENUM ('CUSTOMER', 'CAPTAIN');

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'Conversation'
  ) THEN
    ALTER TABLE "Conversation" RENAME TO "conversations";
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'Message'
  ) THEN
    ALTER TABLE "Message" RENAME TO "messages";
  END IF;
END $$;

TRUNCATE TABLE "messages", "conversations" CASCADE;

ALTER TABLE "conversations" DROP CONSTRAINT IF EXISTS "Conversation_boatId_fkey";
ALTER TABLE "conversations" DROP CONSTRAINT IF EXISTS "conversations_boatId_fkey";
ALTER TABLE "conversations" DROP CONSTRAINT IF EXISTS "Conversation_captainId_fkey";
ALTER TABLE "conversations" DROP CONSTRAINT IF EXISTS "conversations_captainId_fkey";
DROP INDEX IF EXISTS "Conversation_customerId_captainId_boatId_key";
DROP INDEX IF EXISTS "conversations_customerId_captainId_boatId_key";

ALTER TABLE "conversations" DROP COLUMN IF EXISTS "boatId";

ALTER TABLE "conversations" ADD COLUMN IF NOT EXISTS "reservationId" TEXT;
ALTER TABLE "conversations" ALTER COLUMN "reservationId" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "conversations_reservationId_key" ON "conversations"("reservationId");

ALTER TABLE "conversations" DROP COLUMN IF EXISTS "captainId";
ALTER TABLE "conversations" ADD COLUMN "captainId" UUID NOT NULL;

ALTER TABLE "conversations"
  ADD CONSTRAINT "conversations_reservationId_fkey"
  FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "conversations"
  ADD CONSTRAINT "conversations_captainId_fkey"
  FOREIGN KEY ("captainId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "Message_senderId_fkey";
ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "messages_senderId_fkey";

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'messages' AND column_name = 'content'
  ) THEN
    ALTER TABLE "messages" RENAME COLUMN "content" TO "body";
  END IF;
END $$;

ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "attachmentUrl" TEXT;
ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "senderType" "MessageSenderType";
UPDATE "messages" SET "senderType" = 'CUSTOMER' WHERE "senderType" IS NULL;
ALTER TABLE "messages" ALTER COLUMN "senderType" SET NOT NULL;

DROP INDEX IF EXISTS "Message_conversationId_idx";
DROP INDEX IF EXISTS "messages_conversationId_idx";
CREATE INDEX "messages_conversationId_createdAt_idx" ON "messages"("conversationId", "createdAt");
