# ReelGen

Production-ready MVP scaffold for a FacelessReels-like SaaS.

## Prerequisites
- Node.js 20+
- pnpm 9+
- Docker (for MongoDB, Redis, MinIO)

## Getting started

1) Install dependencies

```
pnpm install
```

2) Start local infra

```
docker compose up -d
```

3) Configure env

```
cp .env.example .env
```

4) Run apps

```
pnpm dev
```

## Scripts
- `pnpm dev:web` - Next.js app
- `pnpm dev:worker` - Worker process
- `pnpm dev` - Run both
- `pnpm db:seed` - Seed database
- `pnpm lint` - Lint
- `pnpm typecheck` - Type check
- `pnpm test` - Tests

## Publishing (dev)
- Connect YouTube via the Integrations page (mock callback is supported).
- Use the Publishing page to schedule or publish a video.

## Testing
- `pnpm test` runs Vitest suites for shared packages and the web app.

## Idempotency + rate limits
- Use the `Idempotency-Key` header on billing and publish endpoints.
- Generation and publishing endpoints are rate limited per workspace (in-memory).
