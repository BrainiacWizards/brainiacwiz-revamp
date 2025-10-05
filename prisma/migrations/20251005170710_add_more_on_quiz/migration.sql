/*
  Warnings:

  - Added the required column `category` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `difficulty` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timePerQn` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "difficulty" "Difficulty" NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "timePerQn" INTEGER NOT NULL;
