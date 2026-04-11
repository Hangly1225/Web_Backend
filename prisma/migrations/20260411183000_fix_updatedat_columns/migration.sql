DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'User'
      AND column_name = 'updatedAT'
  ) THEN
    ALTER TABLE "User" RENAME COLUMN "updatedAT" TO "updatedAt";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Brand'
      AND column_name = 'updatedAT'
  ) THEN
    ALTER TABLE "Brand" RENAME COLUMN "updatedAT" TO "updatedAt";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Category'
      AND column_name = 'updatedAT'
  ) THEN
    ALTER TABLE "Category" RENAME COLUMN "updatedAT" TO "updatedAt";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Product'
      AND column_name = 'updatedAT'
  ) THEN
    ALTER TABLE "Product" RENAME COLUMN "updatedAT" TO "updatedAt";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Order'
      AND column_name = 'updatedAT'
  ) THEN
    ALTER TABLE "Order" RENAME COLUMN "updatedAT" TO "updatedAt";
  END IF;
END $$;