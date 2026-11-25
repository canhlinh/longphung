import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ALTER COLUMN "brand_name" SET DEFAULT 'Hải Sản Minh Kiên';
  ALTER TABLE "site_settings" ALTER COLUMN "address" SET DEFAULT 'Cập nhật địa chỉ của Minh Kiên';
  ALTER TABLE "site_settings" ALTER COLUMN "seo_title" SET DEFAULT 'Hải Sản Minh Kiên';
  ALTER TABLE "users" ADD COLUMN "reset_password_requested_at" timestamp(3) with time zone;
  ALTER TABLE "media" ADD COLUMN "prefix" varchar DEFAULT '';
  ALTER TABLE "media" ADD COLUMN "_objectkey" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ALTER COLUMN "brand_name" SET DEFAULT 'Hải Sản Long Phụng';
  ALTER TABLE "site_settings" ALTER COLUMN "address" SET DEFAULT 'Cập nhật địa chỉ của Long Phụng';
  ALTER TABLE "site_settings" ALTER COLUMN "seo_title" SET DEFAULT 'Hải Sản Long Phụng';
  ALTER TABLE "users" DROP COLUMN "reset_password_requested_at";
  ALTER TABLE "media" DROP COLUMN "prefix";
  ALTER TABLE "media" DROP COLUMN "_objectkey";`)
}
