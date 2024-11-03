-- AlterTable
ALTER TABLE "Subscription"
    ADD COLUMN "firstDate" TIMESTAMP(3),
    ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN "lastDate" TIMESTAMP(3),
    ADD COLUMN "plaidPredictedNextDate" TIMESTAMP(3);

