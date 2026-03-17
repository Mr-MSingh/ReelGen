# Sequences

## Onboarding
1. User signs in via Auth.js.
2. Workspace + subscription created on first login.
3. Initial credits granted.
4. User lands on dashboard.

## Generation
1. User requests video from a series.
2. API checks plan limit + credits, then debits.
3. Job enqueued to generation queue.
4. Worker writes script + storyboard + render spec.
5. Render job completes and updates video status.

## Publishing
1. User schedules or publishes a video.
2. Publish schedule record created.
3. Worker publishes via adapter and records attempts.
