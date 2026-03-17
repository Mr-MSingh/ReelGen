# Architecture

ReelGen is a modular monolith with async workers. The web app handles UI and API routes. Workers process AI generation, rendering, and publishing via BullMQ. MongoDB stores metadata, S3-compatible storage holds media assets, and Redis backs the queues.

Key runtime components:
- `apps/web`: Next.js App Router UI + API
- `apps/worker`: BullMQ workers for generation/render/publish
- `packages/*`: shared domain modules
