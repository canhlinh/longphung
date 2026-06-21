# Minh Kien Seafood

Next.js + Payload CMS catalog website for a seafood retail/wholesale business. V1 is intentionally focused on catalog browsing, daily prices, SEO content, and Zalo/hotline ordering instead of full checkout.

## Stack

- Next.js App Router
- Payload CMS 3
- PostgreSQL
- Payload uploads, with S3-compatible storage recommended for production media storage
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

In Docker/Kubernetes, use the compose seed profile or run the seed script in the runtime image built from the current Dockerfile:

```bash
# Local compose (builder stage, full dev deps)
docker compose --profile seed run --rm seed

# Production registry (one-off job / kubectl run)
docker run --rm -e DATABASE_URL=... -e PAYLOAD_SECRET=... ghcr.io/canhlinh/longphung:main npm run seed
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

## Vercel Staging Deployment

`vercel.json` runs `npm run build` only. Do not run Payload migrations inside the Vercel build step; run them deliberately before promoting a deployment or from a trusted CI/job that can reach the production database:

```bash
npm run verify:deploy
npm run migrate
```

Set these environment variables in Vercel for Production and Preview environments that need to boot the app:

```text
DATABASE_URL
PAYLOAD_SECRET
NEXT_PUBLIC_SITE_URL
BLOB_READ_WRITE_TOKEN
```

Vercel staging uses Vercel Blob for uploads. `BLOB_READ_WRITE_TOKEN` is usually created by Vercel after Blob storage is added to the project. Vercel/serverless filesystems are ephemeral, so local disk uploads are only appropriate for development.

## Kubernetes Production Deployment

Kubernetes production uses S3-compatible object storage for uploads. Configure these values in the runtime container environment:

```text
S3_BUCKET
S3_ACCESS_KEY_ID
S3_SECRET_ACCESS_KEY
S3_ENDPOINT
S3_PUBLIC_URL
S3_REGION
```

The database must be reachable from the runtime environment. A Postgres instance that is private inside Kubernetes will not be reachable from Vercel staging unless it is exposed through an approved network path.

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
npm run migrate
npm run verify:deploy
npm run generate:types
npm run seed
```
