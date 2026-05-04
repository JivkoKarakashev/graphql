/*
  Warnings:

  - You are about to drop the column `familyId` on the `refresh_token` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "refresh_token_familyId_idx";

-- AlterTable
ALTER TABLE "refresh_token" DROP COLUMN "familyId",
ADD COLUMN     "deviceId" TEXT;

-- CreateIndex
CREATE INDEX "refresh_token_deviceId_idx" ON "refresh_token"("deviceId");
