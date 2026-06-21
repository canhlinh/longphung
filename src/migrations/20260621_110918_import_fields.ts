import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_products_price_direction" AS ENUM('none', 'up', 'down');
  CREATE TYPE "public"."enum__products_v_version_price_direction" AS ENUM('none', 'up', 'down');
  ALTER TABLE "categories" ADD COLUMN "icon" varchar;
  ALTER TABLE "categories" ADD COLUMN "color" varchar;
  ALTER TABLE "categories" ADD COLUMN "source_group_id" numeric;
  ALTER TABLE "products" ADD COLUMN "source_image_url" varchar;
  ALTER TABLE "products" ADD COLUMN "external_key" varchar;
  ALTER TABLE "products" ADD COLUMN "is_new_listing" boolean DEFAULT false;
  ALTER TABLE "products" ADD COLUMN "price_direction" "enum_products_price_direction" DEFAULT 'none';
  ALTER TABLE "_products_v" ADD COLUMN "version_source_image_url" varchar;
  ALTER TABLE "_products_v" ADD COLUMN "version_external_key" varchar;
  ALTER TABLE "_products_v" ADD COLUMN "version_is_new_listing" boolean DEFAULT false;
  ALTER TABLE "_products_v" ADD COLUMN "version_price_direction" "enum__products_v_version_price_direction" DEFAULT 'none';
  ALTER TABLE "daily_prices" ADD COLUMN "display_unit" varchar;
  ALTER TABLE "daily_prices" ADD COLUMN "price_tiers" jsonb;
  ALTER TABLE "daily_prices" ADD COLUMN "external_key" varchar;
  ALTER TABLE "wholesale_customers" ADD COLUMN "tier_name" varchar;
  ALTER TABLE "wholesale_customers" ADD COLUMN "store_display_name" varchar;
  ALTER TABLE "wholesale_customers" ADD COLUMN "sale_name" varchar;
  ALTER TABLE "wholesale_customers" ADD COLUMN "sale_phone" varchar;
  ALTER TABLE "wholesale_customers" ADD COLUMN "boss_name" varchar;
  ALTER TABLE "wholesale_customers" ADD COLUMN "boss_phone" varchar;
  ALTER TABLE "wholesale_customers" ADD COLUMN "promo_text" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "categories" DROP COLUMN "icon";
  ALTER TABLE "categories" DROP COLUMN "color";
  ALTER TABLE "categories" DROP COLUMN "source_group_id";
  ALTER TABLE "products" DROP COLUMN "source_image_url";
  ALTER TABLE "products" DROP COLUMN "external_key";
  ALTER TABLE "products" DROP COLUMN "is_new_listing";
  ALTER TABLE "products" DROP COLUMN "price_direction";
  ALTER TABLE "_products_v" DROP COLUMN "version_source_image_url";
  ALTER TABLE "_products_v" DROP COLUMN "version_external_key";
  ALTER TABLE "_products_v" DROP COLUMN "version_is_new_listing";
  ALTER TABLE "_products_v" DROP COLUMN "version_price_direction";
  ALTER TABLE "daily_prices" DROP COLUMN "display_unit";
  ALTER TABLE "daily_prices" DROP COLUMN "price_tiers";
  ALTER TABLE "daily_prices" DROP COLUMN "external_key";
  ALTER TABLE "wholesale_customers" DROP COLUMN "tier_name";
  ALTER TABLE "wholesale_customers" DROP COLUMN "store_display_name";
  ALTER TABLE "wholesale_customers" DROP COLUMN "sale_name";
  ALTER TABLE "wholesale_customers" DROP COLUMN "sale_phone";
  ALTER TABLE "wholesale_customers" DROP COLUMN "boss_name";
  ALTER TABLE "wholesale_customers" DROP COLUMN "boss_phone";
  ALTER TABLE "wholesale_customers" DROP COLUMN "promo_text";
  DROP TYPE "public"."enum_products_price_direction";
  DROP TYPE "public"."enum__products_v_version_price_direction";`)
}
