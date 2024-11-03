/*
 Warnings:

 - You are about to alter the column `cost` on the `Subscription` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
 */
-- AlterTable
ALTER TABLE "Subscription"
  ALTER COLUMN "cost" SET DATA TYPE Int;

