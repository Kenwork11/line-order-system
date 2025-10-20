-- CreateTable
CREATE TABLE "public"."customers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "line_user_id" VARCHAR(255) NOT NULL,
    "display_name" VARCHAR(255) NOT NULL,
    "picture_url" TEXT,
    "nickname" VARCHAR(100),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" TIMESTAMPTZ,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_line_user_id_key" ON "public"."customers"("line_user_id");

-- CreateIndex
CREATE INDEX "idx_customers_line_user_id" ON "public"."customers"("line_user_id");
