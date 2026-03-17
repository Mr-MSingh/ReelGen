# API

Core API routes (MVP):

Auth
- `POST /api/auth/*`

Workspace
- `GET /api/workspace`
- `PATCH /api/workspace`

Series
- `GET /api/series`
- `POST /api/series`
- `GET /api/series/:id`
- `PATCH /api/series/:id`
- `DELETE /api/series/:id`
- `POST /api/series/:id/generate-video`

Videos
- `GET /api/videos`
- `GET /api/videos/:id`
- `POST /api/videos/:id/render`

Assets
- `POST /api/assets/upload-url`
- `GET /api/assets/:id`

Publishing
- `GET /api/publishing/schedules`
- `POST /api/videos/:id/schedule`
- `POST /api/videos/:id/publish-now`
- `GET /api/publishing/attempts/:id`

Integrations
- `GET /api/integrations`
- `POST /api/integrations/youtube/connect`
- `POST /api/integrations/youtube/callback`
- `DELETE /api/integrations/:id`

Billing
- `GET /api/billing`
- `POST /api/billing/checkout`
- `POST /api/billing/portal`
- `POST /api/webhooks/stripe`

Internal
- `POST /api/internal/jobs/cleanup`
- `POST /api/internal/jobs/reset-credits`
