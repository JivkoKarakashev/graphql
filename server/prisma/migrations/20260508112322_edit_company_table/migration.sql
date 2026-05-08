/*
  Warnings:

  - You are about to drop the column `userId` on the `company` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `company` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "company" DROP CONSTRAINT "company_userId_fkey";

-- DropIndex
DROP INDEX "company_userId_idx";

-- AlterTable
ALTER TABLE "company" DROP COLUMN "userId",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "company_ownerId_idx" ON "company"("ownerId");

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
