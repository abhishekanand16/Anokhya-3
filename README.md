# Anokhya 3.0

Event website for **Anokhya 3.0** — *"Where tech meets the unforeseen"*, the tech fest run by the
Department of Artificial Intelligence & Machine Learning, Dayananda Sagar College of Engineering.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). That's it for browsing the site — registration
forms need Supabase (below) before they can actually save anyone.

### Connect Supabase (for registrations to work)

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run [`supabase/schema.sql`](./supabase/schema.sql). It is safe to re-run. It creates:
   - `events` — team size, **capacity** (15 / 16 / 32 teams) and an open/closed switch per event.
   - `registrations` — one row per team.
   - `register_team()` — the only way a registration is written. In one transaction it checks the event is
     open, the team size is valid, a slot is free (first-come, first-served, race-safe), and that nobody on
     the team (leader *or* member, by email or USN) is already registered for that event.
   - RLS locks both tables so the public/anon key can't read or write anything.
3. Copy `.env.example` to `.env.local` and fill it in (Project Settings → API):

   ```bash
   cp .env.example .env.local
   ```

   - `SUPABASE_URL` — project URL.
   - `SUPABASE_SERVICE_ROLE_KEY` — the **service_role** secret (not the anon key). Server-only.
   - `ADMIN_TOKEN` — any long random string (`openssl rand -hex 32`); enables the organizer export below.

4. Restart `npm run dev`, submit a test registration on any `/events/<slug>` page, and check the
   `registrations` table in the Supabase dashboard.

### Backend endpoints

| Endpoint | Auth | What it does |
| --- | --- | --- |
| `registerForEvent` server action (`src/app/events/[slug]/actions.ts`) | public | Validates the form and calls `register_team()`. |
| `GET /api/events/slots` | public | Powers the "X of N spots left" badges. Live `capacity` / `registered` / `slotsLeft` / `open` per event. Counts only. |
| `GET /api/admin/registrations?event=<slug>&format=csv\|json` | `Authorization: Bearer <ADMIN_TOKEN>` | Organizer export. CSV is one row per participant. |

```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "https://anokhya.site/api/admin/registrations?event=bgmi" -o bgmi.csv
```

To close one event early, use the separate admin dashboard (`anokhya-admin`), or set `registration_open` to `false`
on its row in the `events` table. The event page then shows a "Registrations are closed" notice instead of the
form, and the database rejects any submission that still comes through.
To change a capacity or team size, edit the `insert into public.events` block in `schema.sql` and re-run it
(keep it in sync with `src/data/events.ts`).

### Deploy to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket (or `vercel` CLI → `vercel`).
2. Import it in [Vercel](https://vercel.com/new). Framework preset `Next.js` is auto-detected.
3. Add the three env vars from `.env.example` under Project Settings → Environment Variables
   (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_TOKEN`).
4. Deploy. No other config needed — `next.config.ts` has no custom build steps.

---

## What's here

- **Next.js 16** (App Router, TypeScript, Turbopack), **Tailwind CSS v4**, **Supabase JS**, **Zod**.
  No UI kit, no animation library, no extra state manager — the site is small enough not to need one.
- One dark, glassmorphic theme matching the official Anokhya branding (not light/dark — the fest has a
  fixed visual identity, so a theme toggle would fight the brand rather than serve it).
- Content (event rules, dates, prize pool) is transcribed from the official sponsorship deck and the
  "Final" poster. One assumption worth double-checking against the organizing team:
  - **Date**: Saturday, 4 December 2026 (confirmed by the organizers) — set in `src/data/site.ts`.
  - **Schedule times**: the deck has no per-event timings, so `src/data/schedule.ts` has a placeholder
    run-of-day, clearly labeled "Tentative" on the page. Edit that file once real timings exist.
- No personal contact details (student coordinator names/phone numbers from the sponsorship deck) are
  on the site — only the public `@_anokhya` Instagram and the AIML Dept. DSCE LinkedIn page.

### Editing content

- `src/data/site.ts` — dates, venue, prize pool, socials.
- `src/data/events.ts` — the 6 events, rules, team sizes. `slug` doubles as the Supabase `event_slug`
  value, so changing a slug after registrations start means old rows won't match the new one.
- `src/data/schedule.ts` — the day-of timeline shown on the homepage.
- `public/brand/` — vector chip mark (`mark.svg`) plus PNG exports for favicons and Open Graph (`node scripts/generate-brand-mark.mjs`).

### Structure

```
src/
  app/            routes: home, /events/[slug] (details + register), sitemap, robots
  components/     UI (header, hero, event cards, schedule grid, register form, ...)
  data/           site/events/schedule content — the single source of truth
  lib/            supabase client, zod validation, small utils
supabase/
  schema.sql      events + registrations tables, register_team(), RLS
  api/            /api/events/slots, /api/admin/registrations (under src/app)
```
