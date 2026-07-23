# ASSETMAX Global

**The global marketplace for industrial assets & megaprojects.**

ASSETMAX Global connects owners and developers of large-scale industrial assets — mines, desalination plants, energy projects, agro-industrial platforms, ports, manufacturing plants and infrastructure — with international investors and buyers. Think RE/MAX, but for industrial-scale M&A.

Bilingual (English default / Spanish), fully responsive, and built with an institutional, investment-bank grade visual identity (deep navy, white, gold accent).

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS (custom navy/gold design system) |
| Database | Prisma ORM — SQLite in development, PostgreSQL-ready for production |
| Auth | NextAuth (email/password + optional Google OAuth), JWT sessions with roles |
| Validation | Zod on every API route |
| i18n | Locale-prefixed routes (`/en`, `/es`) with typed dictionaries |

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

The seed creates **15 realistic projects** across Chile, Peru, Mexico, USA, Spain, UAE, Australia, Morocco and Argentina (desalination, copper, green hydrogen, lithium, solar, agro-export, data centers, ports, industrial parks…), including one project waiting in the admin verification queue and sample offers, messages, favorites and an NDA acceptance.

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

## Roadmap (post-MVP)

- Payment gateway for premium/featured listings (Stripe)
- Real KYC/AML verification (e.g. Sumsub) wired into the existing compliance framework
- Electronic NDA signature (e.g. DocuSign) replacing the built-in digital acceptance
- File uploads to object storage (S3/Vercel Blob) for images and data room documents
- Email notifications for offers, messages and alert matches
- Full-text search (Postgres `tsvector`) and map clustering
