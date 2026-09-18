# Krishiq Production SEO Readiness — Specification

## Problem
The user requires the Krishiq website (React/Vite SPA deployed on Vercel) to be fully production-ready for Google Search Console, indexing, and organic search visibility. An audit of the existing codebase shows substantial SEO infrastructure already exists, but there are crawlability gaps, minor structural issues, and a production build validation gap that must be closed before it is fully compliant with the user's 17-point checklist.

## Users
- End user: Ankish (developer/creator of Krishiq)
- Secondary audience: Googlebot / Bingbot and other legitimate search crawlers
- Tertiary: Farmers, buyers, FPOs, and administrators using the platform (no feature regressions allowed)

## Goals
1. Every item on the user's 17-point SEO checklist is satisfied.
2. The Google Search Console verification tag is present in the initial production HTML `<head>` on the homepage.
3. All 6 genuine public pages are indexable, uniquely titled, described, canonically linked, and included in a valid `sitemap.xml` reachable at `https://krishiq-beta.vercel.app/sitemap.xml` with HTTP 200.
4. `robots.txt` is reachable at the canonical HTTPS URL with HTTP 200 and references the sitemap.
5. Private/authenticated pages (login, register, cart, checkout, dashboard, all role-prefixed routes) are not in the sitemap and carry `noindex`/appropriate robots rules.
6. A logical internal linking structure connects all public pages via primary navigation, secondary navigation, footer, and contextual in-content links.
7. Valid, non-fabricated JSON-LD structured data is present: WebSite, Organization (with founder `Ankish`), and BreadcrumbList on each public page.
8. The production build (`vite build`) succeeds and includes all SEO-critical assets in the output bundle.
9. No existing functionality (auth flow, backend APIs, MongoDB, Cloudinary, marketplace, profile, role-based dashboards) is degraded.

## Non-Goals
- Redesigning the website or altering visual design, color palette, or layout.
- Adding new feature pages beyond the 6 genuine public pages that already exist.
- Inventing fake company details, addresses, phone numbers, social accounts, reviews, stats, or organization information.
- Keyword stuffing, invisible text, doorway pages, or any black-hat SEO tactic.
- Modifying the backend API surface or authentication middleware.
- Committing or pushing to Git (per user constraints).

## Constraints
- Framework: **React 18 + Vite + React Router v7** (SPA, not Next.js). Static files in `frontend/public/` are served verbatim by Vercel.
- Production deployment on Vercel using `frontend/vercel.json` (rewrites for SPA fallback, explicit headers for `sitemap.xml` / `robots.txt`).
- All backend routes prefixed with `/api`; frontend uses `VITE_API_URL`.
- Do not hardcode user assets; user avatar comes from `AuthContext` via `resolveUserAvatarSrc` helper.
- Never commit or push to Git without explicit user request.

## Dependencies and Assumptions
- Existing `frontend/public/og-image.png` exists (confirmed) and represents Krishiq.
- Existing `frontend/public/logo.png` exists (confirmed).
- The Vercel project has `VITE_API_URL` correctly configured per prior work.
- The production build output is what Vercel deploys via its Vite preset.
- `frontend/vercel.json` rewrite rule already handles SPA 404 fallback correctly.

## Open Questions
- None material. The existing site content is genuine, matches user keywords naturally, and all 6 requested public pages (`/`, `/about`, `/krishiq-ai`, `/for-farmers`, `/marketplace`, `/agritech`) already exist with accurate, useful content.

## Acceptance Criteria

### Section 1 — Google Search Console Verification
- **Rule**: The initial HTML returned by the production homepage source contains `<meta name="google-site-verification" content="lQixSIlW6CeaXRt07t9IJSdvx9jRDiqZz-te2oMvUBk" />` inside the `<head>` element, outside the `<body>`, and not dependent on client-side JS rendering.
- **Rule**: The tag's `content` attribute is byte-for-byte equal to `lQixSIlW6CeaXRt07t9IJSdvx9jRDiqZz-te2oMvUBk` (no character substitutions).
- **Rule**: All pre-existing `<title>`, `<meta description>`, canonical, OG, Twitter, and JSON-LD tags in `index.html` remain present and unmodified in their value.

### Section 2 — Technical SEO on Every Important Public Page
- **Rule**: For each of `/`, `/marketplace`, `/krishiq-ai`, `/for-farmers`, `/agritech`, `/about`, client-side navigation sets a distinct `<title>` matching the value in `frontend/src/seo/site.js` `publicSeo` map.
- **Rule**: Each of the 6 public pages has a unique, non-empty meta description set by `SeoManager`.
- **Rule**: Each of the 6 public pages has a `<link rel="canonical">` resolving to its full HTTPS URL (`https://krishiq-beta.vercel.app/<path>` or `/` for root).
- **Rule**: Each of the 6 public pages has `<meta name="robots" content="index,follow">` (set both as `robots` and `googlebot` meta tags).
- **Rule**: Each of the 6 public pages has Open Graph metadata: `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image` = `https://krishiq-beta.vercel.app/og-image.png`.
- **Rule**: Each of the 6 public pages has Twitter card metadata: `twitter:card` = `summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`.
- **Rule**: Each of the 6 public pages renders exactly one `<h1>` element with page-appropriate content (no duplicate or missing H1s).
- **Rubric**: H2/H3 semantic hierarchy (0–2): `2` = sections use `<h2>` for top-level section headings and `<h3>` for sub-cards with logical order; `1` = hierarchy present but one section skips a level; `0` = no semantic heading hierarchy. Pass threshold ≥ 2.
- **Rubric**: Descriptive image alt text (0–2): `2` = every `<img>` rendering product/feature imagery has a non-empty, descriptive, non-stuffed alt attribute that matches the image; `1` = ≥ 1 image missing alt; `0` = widespread missing alt. Pass threshold ≥ 2.
- **Rubric**: Semantic HTML usage (0–2): `2` = pages use `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>` appropriately; `1` = one structural wrapper uses a generic div where a semantic element exists; `0` = fully div-based layout. Pass threshold ≥ 2.
- **Rule**: Contextual internal links between public pages exist inside page content (not only nav/footer).

### Section 3 — Primary SEO Search Terms, Naturally Used
- **Rule**: The terms "Krishiq", "Krishiq AI", "Krishiq for Farmer(s)", "Krishiq Marketplace", "Krishiq Agritech", and "Ankish" each appear at least once in the combined copy of the public pages in natural, readable sentences.
- **Rule**: No page repeats any single keyword phrase on more than 5 distinct heading/content blocks across the homepage.
- **Rule**: No invisible, off-screen, zero-opacity, or same-color-on-background text exists anywhere.

### Section 4 — Homepage SEO
- **Rule**: Homepage H1 text matches "Krishiq – AI-Powered Agritech Platform for Farmers" exactly (as set by `HOME_TITLE` and rendered by `FullBleedHero`).
- **Rule**: Homepage meta description matches the user-specified paragraph (as set in `HOME_DESCRIPTION` and `index.html`).
- **Rule**: Homepage naturally includes sections that explain what Krishiq is, Krishiq AI, how Krishiq helps farmers, Krishiq Marketplace, Krishiq Agritech, main features/benefits, and how users can start using the platform — all supported by real features (not invented).

### Section 5 — SEO-Friendly Public Pages
- **Rule**: URLs `/about`, `/krishiq-ai`, `/for-farmers`, `/marketplace`, `/agritech` each return HTTP 200 in a production build and render a real, useful, content-rich page (no empty/stub pages).
- **Rule**: The page titles of the 6 public pages match exactly the strings specified in requirement 5 (e.g. `/krishiq-ai` → "Krishiq AI – Smart AI Technology for Farmers").
- **Rule**: No additional keyword-stuffed doorway pages are created.

### Section 6 — Ankish / Developer Attribution
- **Rule**: The About page contains the sentence "Krishiq is developed by Ankish." or equivalent natural phrasing that clearly attributes the project to the developer.
- **Rule**: The Organization JSON-LD graph includes `"founder": { "@type": "Person", "name": "Ankish" }` exactly (no fictitious social handles, address, etc. attached).

### Section 7 — sitemap.xml
- **Rule**: `GET https://krishiq-beta.vercel.app/sitemap.xml` returns HTTP 200 with `Content-Type: application/xml; charset=utf-8` (verified locally by inspecting `frontend/public/sitemap.xml` + `vercel.json` headers rule).
- **Rule**: The sitemap XML is namespace-valid: root `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`.
- **Rule**: The sitemap contains exactly the 6 public page URLs, all HTTPS, under `krishiq-beta.vercel.app`, with `localhost` / dev URLs absent.
- **Rule**: The sitemap does NOT include `/login`, `/register`, `/cart`, `/checkout`, `/payment`, `/order-confirmation`, `/dashboard`, `/farmer/*`, `/buyer/*`, `/fpo/*`, `/admin/*`, `/super-admin/*`, `/product/:id`, or any `/api/*` route.

### Section 8 — robots.txt
- **Rule**: `GET https://krishiq-beta.vercel.app/robots.txt` returns HTTP 200 with `Content-Type: text/plain; charset=utf-8`.
- **Rule**: `robots.txt` starts with `User-agent: *` and has `Allow: /` so the homepage and public pages are crawlable.
- **Rule**: `robots.txt` contains `Disallow:` entries for `/login`, `/register`, `/cart`, `/checkout`, `/payment`, `/order-confirmation`, `/dashboard`, `/farmer/`, `/buyer/`, `/fpo/`, `/admin/`, `/super-admin/`, `/api/`.
- **Rule**: `robots.txt` ends with the line `Sitemap: https://krishiq-beta.vercel.app/sitemap.xml`.

### Section 9 — Structured Data / JSON-LD
- **Rule**: The homepage static HTML includes a `WebSite` JSON-LD graph that names "Krishiq", lists alternate names "Krishiq AI", "Krishiq Agritech", "KRISHIQ", sets the production URL, and points `publisher` to an `Organization` node.
- **Rule**: The `Organization` JSON-LD node names "Krishiq", sets `url`, `logo`, `description`, and `founder = Person { name: "Ankish" }`.
- **Rule**: Each public page injects a `BreadcrumbList` JSON-LD script via `SeoJsonLd` / `breadcrumbJsonLd` with 2+ items on sub-pages and 1 item on the homepage, with valid `position`, `name`, and full HTTPS `item` URL.
- **Rule**: No structured data block claims a fake address, phone, rating, review count, award, or employee count.

### Section 10 — Indexing and Crawlability
- **Rule**: None of the 6 public pages ever set `noindex` via `SeoManager` / meta tag.
- **Rule**: Every exact-match private route (`/login`, `/register`, `/cart`, `/checkout`, `/payment`, `/order-confirmation`, `/dashboard`) sets `meta robots = noindex,nofollow`.
- **Rule**: Every role-prefix route `/farmer`, `/buyer`, `/fpo`, `/admin`, `/super-admin` (and sub-paths) sets `meta robots = noindex,nofollow`.
- **Rule**: Home page canonical is `https://krishiq-beta.vercel.app/`; sub-page canonicals do not self-point to `/` or localhost.
- **Rule**: All primary/secondary nav links to public pages use React Router `<Link>` with correct `to=` targets that resolve without 404.

### Section 11 — Performance / Mobile SEO
- **Rule**: All non-critical `<img>` tags on public pages have the `loading="lazy"` attribute.
- **Rule**: The responsive breakpoints (`sm:`, `lg:`, etc.) used in public pages produce a functional, horizontally scroll-free layout on the `375px` mobile viewport width (Tailwind mobile-first).
- **Rule**: Images in product cards and hero media declare explicit `width` and `height` attributes or are constrained via CSS to avoid layout shift.
- **Rule**: Font loading uses `preconnect` hints for Google Fonts, with no blocking script before the root `<div id="root">`.

### Section 12 — 404 Page
- **Rule**: Visiting any unrecognised route renders the `NotFound` component.
- **Rule**: `NotFound` renders an `<h1>`, links back to `/` and `/marketplace`, and links to the other public pages.
- **Rule**: `SeoManager` assigns `noindex,nofollow` to the 404 catch-all path.
- **Rule**: The `/404`-like catch-all route is not listed in `sitemap.xml`.

### Section 13 — Private Routes
- **Rule**: Private routes are gated by `ProtectedRoute` per role and are NOT listed in `sitemap.xml`.
- **Rule**: The `isNoindexPath` helper returns true for every private route pattern.
- **Rule**: Authentication is neither broken nor bypassed by any change.

### Section 14 — Internal Linking
- **Rule**: The desktop and mobile primary navigation (`Navbar`) exposes links to all 6 public landing pages: Home, Marketplace, Krishiq AI, For Farmers, Agritech, About (plus the How-It-Works hash anchor).
- **Rule**: The `Footer` contains the "Platform" column linking to all 5 non-home public pages, the "Company" column linking to About and hash sections, and the action columns pointing users to `/login` for authenticated workflows.
- **Rule**: The homepage `PlatformOverview` section provides 4 contextual `<Link>` cards to `/krishiq-ai`, `/for-farmers`, `/marketplace`, `/agritech`.
- **Rule**: Each sub-public page closes with a "Related / Explore" paragraph that links to other public pages with descriptive anchor text.

### Section 15 — Final SEO Validation
- **Rule**: Running `npm run build` inside `frontend/` exits with code 0 and emits a `dist/` directory.
- **Rule**: Inspecting `frontend/dist/index.html` post-build shows the GSC verification meta tag, the homepage `<title>`, meta description, canonical, OG tags, Twitter tags, and JSON-LD graph intact.
- **Rule**: Inspecting `frontend/dist/sitemap.xml` and `frontend/dist/robots.txt` post-build shows the files copied verbatim with the correct content.
- **Rule**: All 6 public route paths resolve when rendered locally via `vite preview` (no runtime crashes, no blank pages).

### Section 16 — Deployment Requirements
- **Rule**: The `frontend/public/` directory contains `sitemap.xml`, `robots.txt`, `og-image.png`, `logo.png`, `favicon.ico` at build time, ensuring the Vercel build output includes them as static files.
- **Rule**: `frontend/vercel.json` continues to provide the SPA rewrite rule `/((?!api/|.*\..*).*)` → `/index.html` and preserves the explicit `Content-Type` and `Cache-Control` headers for `sitemap.xml` and `robots.txt`.

### Section 17 — Final Report
- **Rubric**: Report completeness (0–2): `2` = all 14 items from requirement 17 are answered with concrete, reproducible facts including exact file paths, URLs, and git commands; `1` = 10–13 items answered with minor gaps; `0` = < 10 items answered. Pass threshold ≥ 2.
