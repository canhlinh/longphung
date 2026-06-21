# Minh Kien Seafood

Next.js + Payload CMS catalog website for a seafood retail/wholesale business. V1 is intentionally focused on catalog browsing, daily prices, SEO content, and Zalo/hotline ordering instead of full checkout.

## Stack

- Next.js App Router
- Payload CMS 3
- PostgreSQL
- Payload uploads, with Vercel Blob recommended for production media storage
- TypeScript

## Local Setup

1. Copy environment variables:

```bash
cp .env.example .env
```

2. Start PostgreSQL:

```bash
docker compose up -d
```

3. Install dependencies and run the app:

```bash
npm install
npm run dev
```

4. Open:

```text
http://localhost:3000
http://localhost:3000/admin
```

5. Seed sample Minh Kien data:

```bash
npm run seed
```

Default seed admin:

```text
admin@minhkien.local
MinhKien123!
```

Change `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` before seeding if desired.

## Admin Content Model

Payload admin manages:

- Users
- Media
- Categories
- Products
- Daily Prices
- Banners
- Posts
- Site Settings

Products, banners, and posts support draft/publish. Public pages only read published content.

## Vercel Deployment

Set these environment variables in Vercel:

```text
DATABASE_URL
PAYLOAD_SECRET
NEXT_PUBLIC_SITE_URL
BLOB_READ_WRITE_TOKEN
```

Add Vercel Blob or another Payload-compatible cloud storage adapter before relying on production uploads. Vercel/serverless filesystems are ephemeral, so local disk uploads are only appropriate for development.

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
npm run generate:types
npm run seed
```
