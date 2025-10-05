/*
  Warnings:

  - A unique constraint covering the columns `[gamePin]` on the table `Quiz` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "gamePin" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_gamePin_key" ON "Quiz"("gamePin");
