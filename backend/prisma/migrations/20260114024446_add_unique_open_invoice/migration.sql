/*
  Warnings:

  - A unique constraint covering the columns `[subscriptionId,status]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subscriptionId` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "subscriptionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_subscriptionId_status_key" ON "Invoice"("subscriptionId", "status");
