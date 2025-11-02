-- CreateTable
CREATE TABLE "public"."orders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_number" VARCHAR(50) NOT NULL,
    "customer_id" UUID NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "payment_status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "payment_method" VARCHAR(50),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "product_price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "subtotal" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "public"."orders"("order_number");

-- CreateIndex
CREATE INDEX "idx_orders_customer_id" ON "public"."orders"("customer_id");

-- CreateIndex
CREATE INDEX "idx_orders_status" ON "public"."orders"("status");

-- CreateIndex
CREATE INDEX "idx_orders_created_at" ON "public"."orders"("created_at");

-- CreateIndex
CREATE INDEX "idx_orders_order_number" ON "public"."orders"("order_number");

-- CreateIndex
CREATE INDEX "idx_order_items_order_id" ON "public"."order_items"("order_id");

-- CreateIndex
CREATE INDEX "idx_order_items_product_id" ON "public"."order_items"("product_id");

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
