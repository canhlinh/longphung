import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "daily_prices_price_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"price" numeric NOT NULL,
  	"pco" numeric
  );
  
  ALTER TABLE "wholesale_customers" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "brand_name" SET DEFAULT 'Hải Sản Long Phụng';
  ALTER TABLE "site_settings" ALTER COLUMN "seo_title" SET DEFAULT 'Hải Sản Long Phụng';
  ALTER TABLE "daily_prices_price_tiers" ADD CONSTRAINT "daily_prices_price_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."daily_prices"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "daily_prices_price_tiers_order_idx" ON "daily_prices_price_tiers" USING btree ("_order");
  CREATE INDEX "daily_prices_price_tiers_parent_id_idx" ON "daily_prices_price_tiers" USING btree ("_parent_id");
  
  -- Di chuyển dữ liệu cũ từ JSONB price_tiers sang bảng phụ daily_prices_price_tiers
  INSERT INTO "daily_prices_price_tiers" ("_parent_id", "_order", "id", "name", "price", "pco")
  SELECT 
    dp.id AS _parent_id,
    (elem.idx - 1) AS _order,
    substring(md5(dp.id::text || elem.idx::text || random()::text) from 1 for 24) AS id,
    COALESCE(elem.val->>'name', 'Bậc')::varchar AS name,
    COALESCE(elem.val->>'price', '0')::numeric AS price,
    (elem.val->>'pco')::numeric AS pco
  FROM "daily_prices" dp
  CROSS JOIN LATERAL jsonb_array_elements(dp.price_tiers) WITH ORDINALITY AS elem(val, idx)
  WHERE dp.price_tiers IS NOT NULL 
    AND jsonb_typeof(dp.price_tiers) = 'array';

  ALTER TABLE "daily_prices" DROP COLUMN "price_tiers";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "daily_prices" ADD COLUMN "price_tiers" jsonb;

  -- Phục hồi dữ liệu gộp từ bảng phụ daily_prices_price_tiers về lại dạng JSONB array
  UPDATE "daily_prices" dp
  SET price_tiers = (
    SELECT jsonb_agg(
      jsonb_build_object(
        'name', dppt.name,
        'price', dppt.price,
        'pco', dppt.pco
      ) ORDER BY dppt._order
    )
    FROM "daily_prices_price_tiers" dppt
    WHERE dppt._parent_id = dp.id
  );

  ALTER TABLE "daily_prices_price_tiers" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "daily_prices_price_tiers" CASCADE;
  ALTER TABLE "wholesale_customers" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "brand_name" SET DEFAULT 'Long Phụng Seafood';
  ALTER TABLE "site_settings" ALTER COLUMN "seo_title" SET DEFAULT 'Long Phụng Seafood';`)
}
