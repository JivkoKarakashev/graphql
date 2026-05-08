/*
  Warnings:

  - Added the required column `userId` to the `company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "company" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "company_userId_idx" ON "company"("userId");

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
