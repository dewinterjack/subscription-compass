/*
  Warnings:

  - You are about to drop the column `institution` on the `PlaidItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlaidItem" DROP COLUMN "institution",
ADD COLUMN     "institutionId" TEXT,
ADD COLUMN     "institutionName" TEXT;
