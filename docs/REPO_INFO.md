# Repo Info — Deployment & Integrations

## Production deployment

- **Live site:** https://bayforge.events (and https://www.bayforge.events)
- **Hosting:** Coolify (self-hosted) on the shared VPS, app `bayforge-web`
- **Build:** root `Dockerfile` — multi-stage `node:22-alpine`, `npm ci` + `next build`, runs the Next.js standalone server (`output: "standalone"` in `next.config.ts`) on port 3000
- **Reverse proxy / SSL:** Traefik (managed by Coolify), Let's Encrypt auto-SSL
- **Auto-deploy:** every push to `main` triggers a Coolify rebuild via a GitHub webhook (manual-webhook pattern). No CI build step is required for deploys.
- **DNS:** Hostinger — apex A record → VPS, `www` CNAME → apex

## Runtime environment variables (set in Coolify)

| Variable | Purpose |
| --- | --- |
| `WAITLIST_API_URL` | Shared email-waitlist service subscribe endpoint (`https://emailwaitlist.ayushojha.com/api/v1/subscribe`) |
| `WAITLIST_STATS_URL` | Waitlist stats endpoint (`https://emailwaitlist.ayushojha.com/api/v1/stats`) |
| `WAITLIST_API_KEY` | `wl_…` API key for the `bayforge` waitlist project (server-side only, never exposed to the browser) |

Optional `COMMUNITY_*_PATH` variables (see `.env.example`) are unset in production; the site falls back to its designed static content.

## Integrations

- **Email waitlist:** signups are proxied server-side through `app/api/subscribe/route.ts` to the shared email-waitlist service (project slug `bayforge`). Allowed origins: `https://bayforge.events`, `https://www.bayforge.events`.
- **Pulse analytics:** tracking script in `app/layout.tsx` loads from `https://pulse.ayushojha.com/api/script.js` with the BayForge ingest key (ingest keys are public by design). Dashboard: `https://pulse.ayushojha.com/dashboard` (log in with the BayForge query key — stored privately, not in this repo).

Secrets (waitlist API key, query key, webhook secret) are intentionally not committed — this is a public repo. They live in Coolify env config and the operator's private notes.
