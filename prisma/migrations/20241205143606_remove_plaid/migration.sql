/*
  Warnings:

  - You are about to drop the `PlaidItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlaidSubscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlaidItem" DROP CONSTRAINT "PlaidItem_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlaidSubscription" DROP CONSTRAINT "PlaidSubscription_createdById_fkey";

-- DropForeignKey
ALTER TABLE "PlaidSubscription" DROP CONSTRAINT "PlaidSubscription_plaidItemId_fkey";

-- DropTable
DROP TABLE "PlaidItem";

-- DropTable
DROP TABLE "PlaidSubscription";
