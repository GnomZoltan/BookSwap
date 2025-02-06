/*
  Warnings:

  - The primary key for the `BookGenre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `BookGenre` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BookGenre" DROP CONSTRAINT "BookGenre_pkey",
DROP COLUMN "id";
