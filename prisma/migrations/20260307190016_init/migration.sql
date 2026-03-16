CREATE TYPE "OrderStatus" AS ENUM (
    'PENDING',
    'PAID',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
);

CREATE TABLE "User" (
    "id" BIGSERIAL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Brand" (
    "id" BIGSERIAL PRIMARY KEY,
    "name" TEXT NOT NULL
);

CREATE TABLE "Category" (
    "id" BIGSERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "brandId" BIGINT NOT NULL
);

CREATE TABLE "Product" (
    "id" BIGSERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL,
    "categoryId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_price_check" CHECK ("price" >= 0),
    CONSTRAINT "Product_stock_check" CHECK ("stock" >= 0)
);

CREATE TABLE "Order" (
    "id" BIGSERIAL PRIMARY KEY,
    "userId" BIGINT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "OrderItem" (
    "id" BIGSERIAL PRIMARY KEY,
    "orderId" BIGINT NOT NULL,
    "productId" BIGINT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "OrderItem_quantity_check" CHECK ("quantity" > 0),
    CONSTRAINT "OrderItem_unitPrice_check" CHECK ("unitPrice" >= 0)
);

CREATE TABLE "CartItem" (
    "id" BIGSERIAL PRIMARY KEY,
    "userId" BIGINT NOT NULL,
    "productId" BIGINT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "CartItem_quantity_check" CHECK ("quantity" > 0)
);

CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand" ("name");
CREATE UNIQUE INDEX "Category_brandId_name_key" ON "Category" ("brandId", "name");
CREATE UNIQUE INDEX "OrderItem_orderId_productId_key" ON "OrderItem" ("orderId", "productId");
CREATE UNIQUE INDEX "CartItem_userId_productId_key" ON "CartItem" ("userId", "productId");

ALTER TABLE "Category" ADD CONSTRAINT "Category_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") 
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id")
ON DELETE CASCADE ON UPDATE CASCADE;