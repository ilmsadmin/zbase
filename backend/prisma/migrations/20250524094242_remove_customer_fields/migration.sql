/*
  Warnings:

  - You are about to drop the column `creditBalance` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `taxCode` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "creditBalance",
DROP COLUMN "taxCode";
