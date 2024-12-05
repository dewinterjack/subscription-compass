/*
  Warnings:

  - A unique constraint covering the columns `[defaultPaymentMethodId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "defaultPaymentMethodId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_defaultPaymentMethodId_key" ON "User"("defaultPaymentMethodId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_defaultPaymentMethodId_fkey" FOREIGN KEY ("defaultPaymentMethodId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
