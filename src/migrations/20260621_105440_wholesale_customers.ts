import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "wholesale_customers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"order_link" varchar,
  	"contact_person" varchar,
  	"phone" varchar,
  	"greeting" varchar,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "site_settings" ALTER COLUMN "brand_name" SET DEFAULT 'Long Phụng Seafood';
  ALTER TABLE "site_settings" ALTER COLUMN "tagline" SET DEFAULT 'Hải sản tươi mỗi ngày cho gia đình và nhà hàng';
  ALTER TABLE "site_settings" ALTER COLUMN "address" SET DEFAULT 'Cập nhật địa chỉ của Long Phụng';
  ALTER TABLE "site_settings" ALTER COLUMN "business_hours" SET DEFAULT '06:00 - 20:00 hằng ngày';
  ALTER TABLE "site_settings" ALTER COLUMN "seo_title" SET DEFAULT 'Long Phụng Seafood';
  ALTER TABLE "site_settings" ALTER COLUMN "seo_description" SET DEFAULT 'Hải sản tươi sống, sashimi, combo gia đình và bảng giá mỗi ngày.';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "wholesale_customers_id" integer;
  CREATE UNIQUE INDEX "wholesale_customers_slug_idx" ON "wholesale_customers" USING btree ("slug");
  CREATE INDEX "wholesale_customers_updated_at_idx" ON "wholesale_customers" USING btree ("updated_at");
  CREATE INDEX "wholesale_customers_created_at_idx" ON "wholesale_customers" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_wholesale_customers_fk" FOREIGN KEY ("wholesale_customers_id") REFERENCES "public"."wholesale_customers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_wholesale_customers_id_idx" ON "payload_locked_documents_rels" USING btree ("wholesale_customers_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "wholesale_customers" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "wholesale_customers" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_wholesale_customers_fk";
  
  DROP INDEX "payload_locked_documents_rels_wholesale_customers_id_idx";
  ALTER TABLE "site_settings" ALTER COLUMN "brand_name" SET DEFAULT 'Long Phung Seafood';
  ALTER TABLE "site_settings" ALTER COLUMN "tagline" SET DEFAULT 'Hai san tuoi moi ngay cho gia dinh va nha hang';
  ALTER TABLE "site_settings" ALTER COLUMN "address" SET DEFAULT 'Cap nhat dia chi cua Long Phung';
  ALTER TABLE "site_settings" ALTER COLUMN "business_hours" SET DEFAULT '06:00 - 20:00 hang ngay';
  ALTER TABLE "site_settings" ALTER COLUMN "seo_title" SET DEFAULT 'Long Phung Seafood';
  ALTER TABLE "site_settings" ALTER COLUMN "seo_description" SET DEFAULT 'Hai san tuoi song, sashimi, combo gia dinh va bang gia moi ngay.';
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "wholesale_customers_id";`)
}
