# LinkTrace 🚀

> **Track Every Click. Understand Every Campaign.**

LinkTrace is a modern SaaS-based link management and campaign analytics platform. It converts standard URLs into high-performance trackable short links, providing privacy-conscious analytics, campaign attribution, and unified workspace management.

---

## 🌟 Key Features

- **Link Management:** Shorten URLs, assign custom aliases, configure active/inactive statuses, and set expiration dates.
- **High-Performance Redirect Engine:** Fast resolution (`/[shortCode]`) with non-blocking, asynchronous event capture.
- **Privacy-Centric Analytics:** Aggregated visitor metrics, referrers, device/browser distributions, and geographic trends without storing raw IP addresses.
- **Campaign Organization:** Group links under marketing campaigns to compare channel and conversion performance.
- **Interactive UTM Builder:** Generate standard UTM parameters with instant live preview and one-click copy.
- **Multi-Workspace Foundation:** Workspace-level data isolation and management.
- **Dark-Theme Interface:** Sleek, modern SaaS dashboard design with accessible layout and typography.

---

## 🛠️ Architecture & Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling & UI:** Tailwind CSS, Lucide React icons
- **Visualizations:** Recharts
- **Database & ORM:** PostgreSQL, Prisma ORM 7
- **Validation:** Zod schemas
- **Architecture:** Feature-based modular monolith

---

## 📂 Project Structure

```text
linktrace/
├── prisma/
│   └── schema.prisma       # Prisma data model (User, Workspace, Link, Campaign, ClickEvent, UTM)
├── src/
│   ├── app/
│   │   ├── (dashboard)/    # Dashboard layout, links, campaigns, analytics, UTM builder, settings
│   │   ├── [shortCode]/    # Dynamic redirect engine & non-blocking analytics
│   │   ├── globals.css     # Dark theme design tokens & modern scrollbars
│   │   ├── layout.tsx      # Root application layout with color-scheme meta
│   │   └── page.tsx        # Modern SaaS hero landing page
│   ├── components/
│   │   └── layout/         # Sidebar navigation, header, workspace selector
│   ├── lib/
│   │   ├── prisma.ts       # Global Prisma client singleton
│   │   ├── utils.ts        # UI styling utility (cn)
│   │   └── validations/    # Zod schemas (link, campaign, workspace, utm)
│   └── types/              # TypeScript domain interfaces
├── PRD.md                  # Comprehensive Product Requirements Document
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node v24)
- PostgreSQL database (local or hosted, e.g., Supabase / Neon)

### 2. Installation & Setup
```bash
# Clone the repository
git clone https://github.com/Hugoagfarizky/linktrace.git
cd linktrace

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your PostgreSQL DATABASE_URL

# Generate Prisma Client
npx prisma generate

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🗺️ Development Roadmap

- [x] **Phase 01 — Product Foundation:** Next.js App Router, Tailwind CSS, Prisma ORM schema, modular monolith structure, dark-theme layout, and build pipeline.
- [x] **Phase 02 — Authentication & Workspace:** User registration/login with bcrypt & JWT session cookies, automated default workspace provisioning, multi-workspace switcher, route protection middleware, and account API routes.
- [ ] **Phase 03 — Link Management:** Database-backed link CRUD, custom alias validation, and campaign linkage.
- [ ] **Phase 04 — Redirect & Tracking Engine:** Edge-ready HTTP redirects, geo-enrichment, and privacy-preserving visitor hashing.
- [ ] **Phase 05 — Analytics Dashboard:** Time-series charts, date filters, and aggregated reporting.
- [ ] **Phase 06 — Campaign Management & UTM:** Campaign analytics rollups and seamless UTM-to-shortlink pipeline.
- [ ] **Phase 07 — Security, Testing & Deployment:** Vitest/Playwright test suites, rate limiting, and Vercel/Docker deployment.
