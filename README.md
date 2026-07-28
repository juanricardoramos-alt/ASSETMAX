# VORTAMAX Global

**The global marketplace for mining projects, industrial assets & qualified supply.** *(Repository keeps the legacy name "AssetMax".)*

VORTAMAX Global runs four connected business lines on one platform:

1. **Projects** — sale and financing of industrial assets and megaprojects (mines, desalination plants, energy, agro, ports, manufacturing, infrastructure).
2. **Investment Mandates (buy-side)** — funds and corporates publish structured search requirements that feed the matching engine.
3. **Commodities** — physical sell offers and buy requirements (copper cathodes, concentrates, lithium, iron ore, agro-commodities…). The platform connects counterparties; payment and logistics settle through traditional channels.
4. **Corporate ecosystem (anchor-company model)** — large **anchor companies** (TLP Pipeline, Andrade Gutiérrez, TBEA — placeholder profiles) publish their real procurement **needs**; a **qualified supplier registry** applies to them. VORTAMAX controls the demand and connects qualified supply: verified corporate profiles, a filterable needs board, and a supplier qualification workflow run by the platform team.

All three are AI-powered via an internal Anthropic (Claude) service: document ingestion that pre-fills listings, automatic project↔mandate and sell↔buy matching with natural-language rationales, per-project Q&A assistants grounded strictly in listing data, and AI-drafted deal documents (NDA, LOI, MOU, SPA, Commodity SPA) with a mandatory both-parties review workflow.

Bilingual (English default / Spanish), fully responsive, and built with an institutional, investment-bank grade visual identity (deep navy, warm white, restrained gold; Playfair Display for headlines, Inter for UI).

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS (custom navy/gold design system, Playfair Display + Inter) |
| Database | Prisma ORM — SQLite in development, PostgreSQL-ready for production |
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
cp .env.example .env        # defaults work out of the box for SQLite

# 3. Create the database and seed demo data
npm run db:push
npm run db:seed

# 4. Run
npm run dev                 # http://localhost:3000  (redirects to /en)
```

### Demo accounts

All demo accounts use the password **`assetmax123`**:

| Email | Role |
| --- | --- |
| `admin@assetmax.global` | Administrator |
| `partner@assetmax.global` | Founding Partner |
| `seller@assetmax.global` | Seller (verified) |
| `seller2@assetmax.global` | Seller |
| `investor@assetmax.global` | Investor |
| `tlp@assetmax.global` | Anchor company — TLP Pipeline |
| `andrade@assetmax.global` | Anchor company — Andrade Gutiérrez |
| `tbea@assetmax.global` | Anchor company — TBEA |
| `supplier@assetmax.global` | Qualified supplier — Andina Drilling & Geotech |
| `baustahl@assetmax.global` | Supplier awaiting qualification (admin queue demo) |

The seed creates **25 realistic projects** across 12 countries (desalination, copper, green hydrogen, lithium, solar, hydro, agro-export, data centers, ports, cold chain, industrial parks…), **6 investment mandates** (one confidential) generating 13 automatic matches, **14 commodity listings** (9 sell offers + 5 buy requirements) generating 5 matches, plus demo offers, messages, favorites, NDA acceptances and notifications. Two extra demo accounts join the originals: `fund@assetmax.global`, `strategics@assetmax.global` and `trader@assetmax.global` (same password).

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

1. **Provision Postgres** (Vercel Postgres, Neon, Supabase…).
2. **Switch the Prisma provider** in `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
   The schema deliberately uses portable types (String enums, no JSON columns), so no other changes are needed.
3. **Set environment variables** in the Vercel project:
   - `DATABASE_URL` — your Postgres connection string
   - `NEXTAUTH_SECRET` — `openssl rand -base64 32`
   - `NEXTAUTH_URL` — `https://your-domain.com`
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — optional, enables Google sign-in
4. **Push the schema & seed** (once, from your machine):
   ```bash
   DATABASE_URL="postgresql://…" npx prisma db push
   DATABASE_URL="postgresql://…" npx tsx prisma/seed.ts
   ```
5. **Deploy** — `vercel` or connect the Git repository. The build command is the default `npm run build`.

> For production-grade migrations, switch from `db push` to `prisma migrate dev` / `prisma migrate deploy` once the schema stabilizes.

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
| **Corporate profiles** | Enterprise panel (`/dashboard/company`) where a company manages its public presence and portfolio; public directory (`/companies`) with a **Founding Partners** section (anchor placeholders: TLP Pipeline, Andrade Gutiérrez, TBEA); admin grants *Verified* / *Anchor* flags |
| **Needs board** | Anchor companies publish real sourcing needs (`/needs`): category, reference budget, deadline, location, requirements — filterable by supplier category, country and company, each with an *Apply* action; managed from `/dashboard/needs` (publish, edit, close, review applications) |
| **Supplier registry** | New SUPPLIER role: suppliers register (`/dashboard/supplier`), the admin team qualifies them (`/dashboard/admin/suppliers`), and qualified suppliers appear in `/suppliers` and can apply to open needs with proposal, budget and lead time; both sides get in-app notifications and companies decide (discuss/accept/decline) per application |
| **Live matching engine** | Public tool (`/matching`): describe a project or need and get instantly ranked compatible investors (published mandates: sector 35 · geography 25 · ticket 30 · stage 10) and qualified suppliers (category 50 · geography 30 · track record 12 · certifications 8), each with a transparent per-component score breakdown |
| **Consortium builder** | When a need is too large for one supplier, a qualified supplier assembles complementary registry members into a single joint candidacy (`/dashboard/consortiums/new?need=…`), designates roles and leads the bid; the anchor company sees one application with full member detail, and members are notified |
| **EPC tenders** | Turnkey EPC packages published as tenders (`/tenders`): scope, deadline, reference budget, requirements and a **publicly visible** list of competing bids (suppliers or consortia); reuses the standard application flow with a tender toggle on publishing |
| **Private data room** | Due-diligence workspace (`/dashboard/dataroom`): counterparties request access per project, owners grant/deny, granted users open placeholder documents, and every document view lands in an immutable access log |
| **Management layer** | Two tiers (`/services`): automated toolkit for every account (interactive certification checklist, copyable proposal templates, guided in-platform proposal builders) and paid premium advisory (from USD 2,500/month); revenue model surfaced in the UI — supplier membership (Basic USD 0 / Pro USD 490/mo), 2–4% success fee, premium management retainer, and featured-supplier placement (USD 290/mo) with gold priority in the registry and matching |

## Roadmap (post-MVP)

- Payment gateway for premium/featured listings (Stripe)
- Real KYC/AML verification (e.g. Sumsub) wired into the existing compliance framework
- Electronic NDA signature (e.g. DocuSign) replacing the built-in digital acceptance
- File uploads to object storage (S3/Vercel Blob) for images and data room documents
- Email notifications for offers, messages and alert matches
- Full-text search (Postgres `tsvector`) and map clustering
