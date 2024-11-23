/*
  Warnings:

  - You are about to drop the column `cost` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `firstDate` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `lastDate` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `plaidAccountId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `plaidItemId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `plaidMetadata` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `plaidPredictedNextDate` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `plaidStreamId` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `startDate` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_plaidItemId_fkey";

-- DropIndex
DROP INDEX "Subscription_name_idx";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "cost",
DROP COLUMN "firstDate",
DROP COLUMN "isActive",
DROP COLUMN "lastDate",
DROP COLUMN "plaidAccountId",
DROP COLUMN "plaidItemId",
DROP COLUMN "plaidMetadata",
DROP COLUMN "plaidPredictedNextDate",
DROP COLUMN "plaidStreamId",
ADD COLUMN     "autoRenew" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "PlaidSubscription" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "billingCycle" "BillingCycle" NOT NULL,
    "firstDate" TIMESTAMP(3),
    "lastDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "plaidPredictedNextDate" TIMESTAMP(3),
    "plaidItemId" TEXT,
    "plaidAccountId" TEXT,
    "plaidStreamId" TEXT,
    "plaidMetadata" JSONB,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaidSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPeriod" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "isTrial" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SubscriptionPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlaidSubscription_name_idx" ON "PlaidSubscription"("name");

-- CreateIndex
CREATE INDEX "SubscriptionPeriod_subscriptionId_idx" ON "SubscriptionPeriod"("subscriptionId");

-- AddForeignKey
ALTER TABLE "PlaidSubscription" ADD CONSTRAINT "PlaidSubscription_plaidItemId_fkey" FOREIGN KEY ("plaidItemId") REFERENCES "PlaidItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaidSubscription" ADD CONSTRAINT "PlaidSubscription_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionPeriod" ADD CONSTRAINT "SubscriptionPeriod_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
