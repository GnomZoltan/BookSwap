/*
  Warnings:

  - You are about to drop the column `inExchange` on the `BookForExchange` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `User` table. All the data in the column will be lost.
  - Added the required column `city` to the `BookForExchange` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookForExchange" DROP COLUMN "inExchange",
ADD COLUMN     "city" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "city";
