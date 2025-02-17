-- CreateEnum
CREATE TYPE "BookStatus" AS ENUM ('AVAILABLE', 'SWAPPED');

-- AlterTable
ALTER TABLE "BookForExchange" ADD COLUMN     "status" "BookStatus" NOT NULL DEFAULT 'AVAILABLE';
