-- AlterTable
ALTER TABLE "Subscription"
    ADD COLUMN "firstDate" TEXT,
    ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN "lastDate" TEXT,
    ADD COLUMN "plaidPredictedNextDate" TEXT;

