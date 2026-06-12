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

## Authentication

Auth is provided by the shared auth service (client `bayforge`) and proxied
server-side — the `X-API-Key` and all tokens stay off the browser:

- `app/api/auth/[...proxy]/route.ts` forwards `/api/auth/*` to the service.
  `login`/`signup`/`refresh` responses store the access + refresh tokens as
  httpOnly cookies (`bf_access`, `bf_refresh`, parent-domain scoped via
  `AUTH_COOKIE_DOMAIN`). `GET /api/auth/me` silently refreshes an expired
  access token. `GET /api/auth/oauth/<provider>` begins social login
  (`session_mode=token`) and hands the provider redirect to the browser.
- `app/auth/callback/route.ts` receives the one-time `auth_code` after a
  social login (the auth service redirects here via its per-client
  `settings.ui.oauth_redirect_url` override), exchanges it server-side at
  `POST /api/auth/redirect/exchange`, sets the session cookies, and lands on `/`.
- `/login` + `/signup` pages, `components/AuthForm.tsx` (email/password +
  GitHub/Google buttons), `components/AuthStatus.tsx` (header session state).

Additional env (set in Coolify): `AUTH_SERVICE_URL`, `AUTH_API_KEY`
(server-only), `AUTH_COOKIE_DOMAIN=.bayforge.events`, optional `SITE_ORIGIN`
(defaults to `https://bayforge.events`; used for absolute redirects behind
the reverse proxy).

Provider status: GitHub login is live (per-client OAuth config). Google
shows a friendly "unavailable" notice until a Google OAuth client is
configured for this auth client.

## Transactional email (Resend)

`lib/email.ts` sends via the Resend API (no SDK dependency). Envs in Coolify:
`RESEND_API_KEY` (send-only key), `EMAIL_FROM`, `NOTIFY_EMAIL`.

- Every successful waitlist signup fire-and-forgets a notification to
  `NOTIFY_EMAIL` (outreach@bayforge.events). Works today.
- A welcome email to the subscriber activates automatically once
  `EMAIL_FROM` is switched to a `bayforge.events` address — that requires
  the domain to be verified in the Resend account first. Until then Resend
  only delivers from `onboarding@resend.dev` to the account owner.

## Integrations

- **Email waitlist:** signups are proxied server-side through `app/api/subscribe/route.ts` to the shared email-waitlist service (project slug `bayforge`). Allowed origins: `https://bayforge.events`, `https://www.bayforge.events`.
- **Pulse analytics:** tracking script in `app/layout.tsx` loads from `https://pulse.ayushojha.com/api/script.js` with the BayForge ingest key (ingest keys are public by design). Dashboard: `https://pulse.ayushojha.com/dashboard` (log in with the BayForge query key — stored privately, not in this repo).

Secrets (waitlist API key, query key, webhook secret) are intentionally not committed — this is a public repo. They live in Coolify env config and the operator's private notes.
