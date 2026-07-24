# VORTAMAX Global

**The global marketplace for industrial assets, investment mandates & physical commodities.**

VORTAMAX Global runs three connected business lines on one platform:

1. **Projects** — sale and financing of industrial assets and megaprojects (mines, desalination plants, energy, agro, ports, manufacturing, infrastructure).
2. **Investment Mandates (buy-side)** — funds and corporates publish structured search requirements that feed the matching engine.
3. **Commodities** — physical sell offers and buy requirements (copper cathodes, concentrates, lithium, iron ore, agro-commodities…). The platform connects counterparties; payment and logistics settle through traditional channels.

All three are AI-powered via an internal Anthropic (Claude) service: document ingestion that pre-fills listings, automatic project↔mandate and sell↔buy matching with natural-language rationales, per-project Q&A assistants grounded strictly in listing data, and AI-drafted deal documents (NDA, LOI, MOU, SPA, Commodity SPA) with a mandatory both-parties review workflow.

Bilingual (English default / Spanish), fully responsive, and built with an institutional, investment-bank grade visual identity (deep navy, warm white, restrained gold; Playfair Display for headlines, Inter for UI).

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS (custom navy/gold design system, Playfair Display + Inter) |
| Database | Prisma ORM — PostgreSQL (Neon in production); migrations applied automatically on deploy |
| Auth | NextAuth (email/password + optional Google OAuth), JWT sessions with roles |
| AI | Anthropic API via internal service (`lib/ai.ts`) — ingestion, matching rationale, assistant, contract drafting |
| Charts | Recharts (palette validated for CVD safety and contrast) |
| Validation | Zod on every API route |
| i18n | Locale-prefixed routes (`/en`, `/es`) with typed dictionaries |

### AI configuration

Set `ANTHROPIC_API_KEY` (console.anthropic.com) to activate all AI features; `AI_MODEL` optionally overrides the default `claude-sonnet-5`. **Everything degrades gracefully without a key**: matching runs on deterministic criteria scoring (rationales become criteria summaries), contracts generate from templates, and ingestion/assistant show a clear "not configured" state — so the platform is fully demonstrable either way.

## Features

### Public
- Landing page: hero with global search, category grid, featured projects, interactive world map with project pins, "how it works" for sellers & investors, live platform stats, testimonials, trust signals.
- Project explorer with filters: category, country, investment range (USD), stage, deal type, verified-only, full-text search.
- Project pages: image gallery, executive overview, investment highlights, technical sheet, financial profile, public documents, location, similar opportunities.
- Static pages: About (incl. Compliance/KYC), How It Works, For Sellers, For Investors, Contact, Terms, Privacy.

### Roles
| Role | Capabilities |
| --- | --- |
| **Seller / Developer** | 6-step listing wizard (basics → category/location → technical → financial → media/docs → review), drafts, edit & resubmit, project stats, offers received, messaging |
| **Investor / Buyer** | Favorites, saved search alerts, offers/LOIs (acquisition, equity %, debt, JV), NDA-gated data rooms, messaging |
| **Founding Partner** | Everything a seller can do, plus the gold **Founding Partner** badge on their listings and a business metrics panel (pipeline GMV, offer volume, breakdowns by category/country, growth) — designed for a 50% platform partner |
| **Admin** | Verification queue (approve/reject with reason), user & role management, verified-seller flag, featured-project curation, global metrics |

### Trust & confidentiality
- **Verification workflow**: every submitted listing enters an admin review queue; approved projects get the green *Verified* badge.
- **Data room with digital NDA**: confidential documents are hidden until the investor signs a digital NDA (full name + acceptance); acceptances are recorded per project/user.
- **Verified Seller** badges, compliance/KYC section, platform stats and testimonial social proof throughout.

---

## Getting Started (development)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env        # set DATABASE_URL to a PostgreSQL instance (e.g. a free Neon database)

# 3. Create the database schema and seed demo data
npx prisma migrate deploy
npm run db:seed

# 4. Run
npm run dev                 # http://localhost:3000  (redirects to /en)
```

### Demo accounts

All demo accounts use the password **`assetmax123`**:

| Email | Role |
| --- | --- |
| `admin@vortamax.global` | Administrator |
| `partner@vortamax.global` | Founding Partner |
| `seller@vortamax.global` | Seller (verified) |
| `seller2@vortamax.global` | Seller |
| `investor@vortamax.global` | Investor |

The seed creates **25 realistic projects** across 12 countries (desalination, copper, green hydrogen, lithium, solar, hydro, agro-export, data centers, ports, cold chain, industrial parks…), **6 investment mandates** (one confidential) generating 13 automatic matches, **14 commodity listings** (9 sell offers + 5 buy requirements) generating 5 matches, plus demo offers, messages, favorites, NDA acceptances and notifications. Two extra demo accounts join the originals: `fund@vortamax.global`, `strategics@vortamax.global` and `trader@vortamax.global` (same password).

### Useful scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (runs `prisma generate` first) |
| `npm run db:push` | Sync Prisma schema to the database |
| `npm run db:seed` | Seed demo data (idempotent) |
| `npm run db:reset` | Drop, recreate and reseed the database |

---

## Deploying to Vercel (with PostgreSQL)

1. **Provision Postgres** (Neon, Vercel Postgres, Supabase…).
2. **Set environment variables** in the Vercel project:
   - `DATABASE_URL` — your Postgres connection string (Neon's pooled URL is fine)
   - `NEXTAUTH_SECRET` — `openssl rand -base64 32`
   - `NEXTAUTH_URL` — `https://your-domain.com`
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — optional, enables Google sign-in
   - `ANTHROPIC_API_KEY` — optional, activates the AI modules (everything degrades gracefully without it)
3. **Deploy** — connect the Git repository (production tracks `main`). Vercel runs
   `npm run vercel-build`, which applies pending Prisma migrations
   (`scripts/deploy-db.mjs`) and seeds the demo data automatically when the
   database is empty. Subsequent deploys never touch existing data.

> Schema changes: add a migration with `npx prisma migrate dev --name <change>`
> (or generate SQL offline via `prisma migrate diff`) and push — it is applied
> on the next deploy.

---

## Internationalization

- English is the default locale (`/en/...`); Spanish lives at `/es/...`. The root `/` redirects via middleware.
- All copy lives in typed dictionaries: `lib/i18n/dictionaries/en.ts` (source of truth for the `Dictionary` type) and `es.ts`.
- **Adding a language**: create `lib/i18n/dictionaries/<locale>.ts`, add the locale to `locales` in `lib/i18n/index.ts`, and add a case in `getDictionary`. The middleware, language switcher and sitemap pick it up automatically.

## Project structure

```
app/
  [lang]/               # locale-prefixed pages (landing, explorer, project, static, auth)
    dashboard/          # role-aware panels (seller, investor, partner, admin)
  api/                  # REST endpoints (projects, offers, NDA, threads, alerts, admin)
components/             # UI kit, layout, home sections, project & dashboard components
lib/                    # prisma client, auth config, i18n, constants, zod schemas, utils
prisma/                 # schema + seed (15 demo projects, 5 demo users)
```

## Platform modules (expansion phase)

| Module | What it does |
| --- | --- |
| **AI ingestion** | Upload a PDF/DOCX/XLSX teaser and the wizard pre-fills every field, flags missing info and suggests public vs data-room documents |
| **Mandates (buy-side)** | Structured or AI-structured free-text mandates, public explorer, confidential mode, admin verification |
| **Matching engine** | Deterministic criteria scoring + AI rationale; runs on every approval; notifies both parties; one-click conversation |
| **Deal documents** | AI-drafted NDA/LOI/MOU/SPA/Commodity-SPA with DRAFT banners, legal disclaimers, dual review gate and print-to-PDF export |
| **Project assistant** | Per-listing chat grounded exclusively in published data — never invents figures |
| **Commodities desk** | Sell/buy listings with specs, Incoterms, price references, NDA-gated certificates, matching and contracts |
| **Premium layer** | Serif/sans type system, animated counters, scroll reveals, Recently Closed, Insights (7 bilingual research articles), leadership team, global offices, market-reference ticker, global search, notifications, skeletons, branded 404/500, OG image |

## Roadmap (post-MVP)

- Payment gateway for premium/featured listings (Stripe)
- Real KYC/AML verification (e.g. Sumsub) wired into the existing compliance framework
- Electronic NDA signature (e.g. DocuSign) replacing the built-in digital acceptance
- File uploads to object storage (S3/Vercel Blob) for images and data room documents
- Email notifications for offers, messages and alert matches
- Full-text search (Postgres `tsvector`) and map clustering
