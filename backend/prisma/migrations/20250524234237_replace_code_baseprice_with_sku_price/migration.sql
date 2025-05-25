/*
  Warnings:

  - You are about to drop the column `basePrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `Product` table. All the data in the column will be lost.
  - Made the column `price` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sku` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/

-- Step 1: Migrate data from old fields to new fields
-- Update sku from code where sku is null
UPDATE "Product" SET "sku" = "code" WHERE "sku" IS NULL;

-- Update price from basePrice where price is null  
UPDATE "Product" SET "price" = "basePrice" WHERE "price" IS NULL;

-- Step 2: Drop old indexes
DROP INDEX "Product_code_key";

-- Step 3: Drop old columns and update constraints
ALTER TABLE "Product" DROP COLUMN "basePrice",
DROP COLUMN "code",
ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "sku" SET NOT NULL;
