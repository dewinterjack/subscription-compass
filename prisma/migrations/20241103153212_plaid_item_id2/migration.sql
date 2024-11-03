/*
  Warnings:

  - You are about to drop the column `itemId` on the `PlaidItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_plaidItemId_fkey";

-- DropIndex
DROP INDEX "PlaidItem_itemId_key";

-- AlterTable
ALTER TABLE "PlaidItem" DROP COLUMN "itemId";

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_plaidItemId_fkey" FOREIGN KEY ("plaidItemId") REFERENCES "PlaidItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
