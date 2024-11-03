/*
  Warnings:

  - A unique constraint covering the columns `[itemId]` on the table `PlaidItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_plaidItemId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "PlaidItem_itemId_key" ON "PlaidItem"("itemId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_plaidItemId_fkey" FOREIGN KEY ("plaidItemId") REFERENCES "PlaidItem"("itemId") ON DELETE SET NULL ON UPDATE CASCADE;
