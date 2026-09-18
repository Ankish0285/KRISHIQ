# Krishiq SEO Ranking Booster — Specification

## Problem
The prior SEO-production-readiness pass correctly implemented technical SEO (GSC tag, sitemap.xml, robots.txt, structured data graphs, static canonicals, private-route noindex rules, protected nav/first-hit metadata). However, there are remaining *content-level* and on-page mismatches against the user's explicit 24-point branded ranking strategy:
- **Requirement 23 CRITICAL REGRESSION**: The GSC verification tag in `frontend/index.html` was changed to `vn2h-Ve9orDpAu1foDuhEZfCRXlmHP3SjuT-O7tLvJg` in the immediately preceding session. Requirement 23 explicitly mandates keeping the original `lQixSIlW6CeaXRt07t9IJSdvx9jRDiqZz-te2oMvUBk` because the homepage is already Google-verified and indexed under that token. **If uncorrected, the existing GSC property will lose verification and the homepage could drop out of GSC data.**
- The 5 sub-public pages carry their "full title string" as the on-page H1. The user wants short branded-core H1s (`Krishiq AI`, `Krishiq for Farmers`, `Krishiq Marketplace`, `Krishiq Agritech`, `About Krishiq`) and uses the PageHero eyebrow + paragraph to deliver context instead.
- Five page titles in `seo/site.js` publicSeo map differ slightly from the user's freshly recommended titles. The user explicitly provides:
  - `/krishiq-ai` → `Krishiq AI – AI-Powered Technology for Farmers` (currently says `Smart AI Technology`)
  - `/for-farmers` → `Krishiq for Farmers – Smart Agricultural Solutions` (currently says `AI-Powered Agricultural Solutions`)
  - `/marketplace` → `Krishiq Marketplace – Agricultural Marketplace` (currently tails with `for Farmers`)
  - `/agritech` → `Krishiq Agritech – Technology for Modern Farming` (currently says `Technology Solutions for Modern Farming`)
- Homepage meta description differs vs new recommended wording ending `...together in one platform.`
- Sub-page closing "Related links" blocks don't match the explicit per-page anchor strategy (req 8). Some miss a direct Homepage link; others include pages the user didn't request.
- Homepage eyebrow and section H2s still use the all-caps string `KRISHIQ` (e.g., `About KRISHIQ`, `How KRISHIQ works`, `Talk to KRISHIQ`). Requirement 19 mandates consistent exact brand spelling `Krishiq` except where a logo/UI-specific technical reason requires capitalization.
- About page Developer section only carries one "Ankish" sentence; user wants *two* natural sentences ("Krishiq is developed by Ankish." + "Ankish is the developer behind Krishiq.") without inventing a bio.
- Public Marketplace page H1 currently reads `Explore fresh produce` instead of the branded `Krishiq Marketplace` (req 5 H1).
- Two public page meta descriptions (Krishiq AI, For Farmers) are slightly optimized but the user has supplied new tighter variants that align 1:1 with their new titles.
- Homepage section H2 structure can be improved so that every core entity ("What is Krishiq?", "Krishiq AI", "Krishiq for Farmers", "Krishiq Marketplace", "Krishiq Agritech", "Why Choose Krishiq?", "About Krishiq") appears as a semantic H2 matching req 11, with exact brand spelling.
- Image alt text on public pages uses generic placeholders: `About KRISHIQ`, `KRISHIQ farm marketplace`. User wants natural, descriptive alt strings like "Krishiq agritech platform", "Krishiq marketplace produce listing", without stuffing.

## Users
- Primary: Ankish (creator/SEO owner) — wants branded search dominance for Krishiq family of queries.
- Secondary: Googlebot (fresh re-crawl after deploy) — needs unambiguous H1/H2 entity hierarchy on every page.
- Tertiary: Real farmers/buyers — content must remain useful and non-stuffed (req 18 content quality).

## Goals
1. Roll back GSC tag to the exact `lQixSIlW...` string (regression 23) so existing Google indexing + GSC property link stays intact.
2. Every public title in site.js matches the user's 24-point document exactly. Homepage meta description matches new wording.
3. Every public page mounts exactly one short branded H1 (not the full title), with H2s that mirror the user's §11 structure where sections exist.
4. Sub-page Related/Explore blocks follow the explicit matrix in §8, no missing Homepage links, no extra pages that aren't part of the 6 core entity map.
5. Brand spelling consistency: plain prose H2/eyebrow text uses `Krishiq` (capital K, lowercase rest) — ALLCAPS only allowed inside visual brand logo wordmark `<BrandLogo>` + navbar brand wordmark that was already there.
6. About Developer section carries 2 natural Ankish attribution sentences, no invented biography, no spam.
7. All public `<img>` alt attributes are rewritten to descriptive entity strings: "Krishiq AI platform for farmers", "Krishiq marketplace produce listing", "About Krishiq agritech platform", "Krishiq agritech technology". No alt stuffing, no raw crop-name-only without "Krishiq Marketplace" context.
8. Build passes exit 0. Preview smoke: 6 public routes, robots.txt, sitemap.xml = HTTP 200. GSC tag on dist/index.html line 8 = lQixSIlW... byte exact.

## Non-Goals
- No visual redesign (colors, layout breakpoints, spacing, fonts, component shapes unchanged).
- No auth/API/MongoDB/Cloudinary/Razorpay/OTP/profile/marketplace functionality changes.
- No new public pages beyond the existing 6. /product/:id stays out of sitemap (dynamic).
- No structured data keys invented (no address/phone/rating/social/awards).
- No keyword stuffing, no hidden text, no duplicate paragraphs rotated with synonyms.
- Do not commit or push to Git (per standing constraint).

## Constraints / Dependencies / Assumptions
- Framework: React 18 + Vite + React Router v7 SPA, deployed Vercel. SEO assets in `frontend/public/`.
- Files that will change (boundary): `frontend/index.html`, `frontend/src/seo/site.js`, `frontend/src/pages/Home.jsx`, `frontend/src/pages/KrishiqAi.jsx`, `frontend/src/pages/ForFarmers.jsx`, `frontend/src/pages/Marketplace.jsx`, `frontend/src/pages/Agritech.jsx`, `frontend/src/pages/About.jsx`. That's 8 files max; no others touched unless build fails.
- Verifying GSC token is a **high-severity rollback**: user's §23 overrides any prior conflicting session. Must be the first code change implemented.
- Default CMS-driven `settings` object in Home.jsx (heroHeading, aboutHeading, etc.) can carry legacy ALLCAPS KRISHIQ placeholders. Static section headings outside `settings.*` scope are the ones being normalized to sentence-case "Krishiq" per §19. For settings-backed strings we do NOT rewrite them — because CMS can customize those. We only normalize hardcoded eyebrow/H2 strings in Home.jsx.

## Open Questions
None. User's 24-point list is self-contained. Every "only use if it exists" feature (Krishiq AI, Marketplace, Agritech, For Farmers, About) corresponds to a genuinely working public page from prior audit.

## Acceptance Criteria
All ACs below are `rule` type (binary, observable) except where noted `rubric` (0-2 numeric, threshold ≥ 2).

### §23 — Critical GSC Tag Rollback
- **Rule**: file `frontend/index.html` line with `meta name="google-site-verification"` has `content` attribute byte-equal to `lQixSIlW6CeaXRt07t9IJSdvx9jRDiqZz-te2oMvUBk`. No other `google-site-verification` meta tags exist in tree.
- **Rule**: Post-build `frontend/dist/index.html` contains the same byte string on a line that parses as inside the HTML `<head>` (grep for `lQixSIl` returns exactly one match before `</head>`).
- **Rule**: Title/description/canonical/OG/Twitter/JSON-LD in index.html remain identical to current values *except* the meta description content string which matches §1 new wording.

### §1 — Homepage Optimization (title unchanged, description updated, H2s normalized, brand spelling)
- **Rule**: Homepage title in site.js publicSeo[`/`] remains `Krishiq – AI-Powered Agritech Platform for Farmers` (matches §1 recommended title exactly).
- **Rule**: Homepage meta description in both (a) site.js HOME_DESCRIPTION and (b) index.html L11 meta tag equals the §1 recommended string word-for-word: *"Krishiq is an AI-powered agritech platform for farmers, bringing smart agricultural solutions, technology and marketplace services together in one platform."*
- **Rule**: Homepage rendered H1 string stays `Krishiq – AI-Powered Agritech Platform for Farmers` (unchanged, matches §1 recommended H1 exactly).
- **Rule**: Homepage static (non-settings-driven) H2s match the following exact strings where the section/topic actually exists on the page:
  1. `What is Krishiq?` (rename PlatformOverview H2 from "An AI-powered agritech platform for farmers.")
  2. `Krishiq AI` (Insights section current H2)
  3. `Krishiq for Farmers` (Audience farmer H2 from settings)
  4. `Krishiq Marketplace` (MarketplaceIntro H2 from settings)
  5. `Krishiq Agritech` (NEW or rename Logistics H2 from "Every handoff stays visible." — Logistics is the implementation carrier for agritech tech layer; keep text but change H2 to branded entity)
  6. `Why Choose Krishiq?` (Features band; add an H2 above the 4-feature grid; current Features band has no H2 wrapper → add one with Eyebrow+Heading)
  7. `About Krishiq` (About section current H2 from "Connecting farms with markets.")
  Note: Buyer H2, Reviews H2, Contact H2, BuiltBy H2, CTA H2, HowItWorks H2 remain from settings as-is — those aren't in the user's requested entity H2 list.
- **Rubric §19 brand spelling consistency in Home static prose**: 0-2 scale. `2` = Every hardcoded (non-settings) H2, Eyebrow, alt attribute on Home.jsx uses sentence-case "Krishiq" instead of ALLCAPS "KRISHIQ". Exceptions: `<BrandLogo>` brand wordmark (navbar/footer), settings.brandName defaults ("KRISHIQ"), and settings-*driven* content strings (heroHeading etc.) are allowed because CMS owns them. `1` = ≤ 1 residual ALLCAPS prose occurrence remains; `0` = ≥ 2. Threshold ≥ 2.

### §2 Brand Entity (consistent naming in titles/H1s/H2s/links/nav/structured data OG)
- **Rule**: publicSeo title for 5 sub-pages matches user §3-7 exactly:
  - `/krishiq-ai` → `Krishiq AI – AI-Powered Technology for Farmers`
  - `/for-farmers` → `Krishiq for Farmers – Smart Agricultural Solutions`
  - `/marketplace` → `Krishiq Marketplace – Agricultural Marketplace`
  - `/agritech` → `Krishiq Agritech – Technology for Modern Farming`
  - `/about` → `About Krishiq – Agritech Platform Developed by Ankish`
- **Rule**: SeoManager writes `<meta og:title>` and `<meta twitter:title>` for each route equal to the same title (inherits automatically through current `seo.title` plumbing — verify via code inspection, no behavioral change needed).
- **Rule**: WebSite JSON-LD `alternateName` array stays exactly `["Krishiq AI", "Krishiq Agritech", "KRISHIQ"]` (the logo wordmark "KRISHIQ" in alternateName is valid per Req 19 exception "unless required for a specific technical reason"). `name: "Krishiq"`.

### §3 Krishiq AI Page (/krishiq-ai)
- **Rule**: PageHero H1 reads exactly `Krishiq AI` (shorten from current long-title H1). Keep existing eyebrow + subheading paragraph unchanged for context.
- **Rule**: Content sections H2:
  - "What Krishiq AI does today" (exist)
  - "Where farmers see it" (exist)
  - Rename last H2 from "Related parts of Krishiq" to "Related Krishiq offerings" for flow; keep links in next AC.
- **Rule**: Internal links section at page end lists exactly 3 destinations with descriptive anchors matching §8: "Homepage" → `/`, "Krishiq for Farmers" → `/for-farmers`, "Krishiq Agritech" → `/agritech`. No extra links outside these 3; no missing.

### §4 For Farmers Page (/for-farmers)
- **Rule**: PageHero H1 reads exactly `Krishiq for Farmers`. Existing eyebrow and subheading unchanged.
- **Rule**: Content sections: last H2 rename "How to start" → "Get started on Krishiq". Other 2 H2s keep current wording.
- **Rule**: Final internal links list (inside last ContentSection paragraph) contains exactly: "Krishiq AI" → `/krishiq-ai`, "Krishiq Marketplace" → `/marketplace`, "Homepage" → `/`. Keep anchor verbs natural (e.g., "Learn more about Krishiq AI, explore the Krishiq Marketplace, or return to the Krishiq homepage."). No Agritech/About extra links per §8.
- **Rule**: Body copy includes the following 3 targeted phrases at least once each, naturally: "Krishiq for farmers", "Krishiq AI for farmers", "Krishiq agritech platform". No sentence rewritten solely to shoehorn them; only plug them in where sentences already allude to the concept.

### §5 Marketplace Page (/marketplace)
- **Rule**: H1 reads exactly `Krishiq Marketplace` (replace current "Explore fresh produce"; keep the existing eyebrow + subheading paragraph where they explain discover/listing).
- **Rule**: Page `<title>` from site.js publicSeo = "Krishiq Marketplace – Agricultural Marketplace" (per publicSeo update AC §2).
- **Rule**: Related-links `<nav>` at L25-L27 currently lists 4 pages; replace with exactly: "Krishiq for Farmers" → `/for-farmers`, "Krishiq Agritech" → `/agritech`, "Homepage" → `/`. Keep label prefix "Related: " descriptive.
- **Rule**: ProductCard component `<img>` alt attribute changes from generic `${cropName} produce` to entity-aware: `Krishiq Marketplace listing: ${product.cropName} produce`. No stuffing.
- **Rule**: PreviewLot alt on Home.jsx changes from `${product.name} produce` → `Krishiq Marketplace: ${product.name} produce`.

### §6 Agritech Page (/agritech)
- **Rule**: PageHero H1 reads exactly `Krishiq Agritech`. Eyebrow/subheading preserved.
- **Rule**: Last ContentSection H2 rename "Continue on Krishiq" → "Explore more on Krishiq".
- **Rule**: Internal links paragraph contains exactly 4 items per §8: "Krishiq AI" → `/krishiq-ai`, "Krishiq for Farmers" → `/for-farmers`, "Krishiq Marketplace" → `/marketplace`, "Homepage" → `/`.
- **Rule**: At least one body sentence naturally uses "Krishiq agriculture technology" or close paraphrase "agriculture technology at the core of Krishiq". And at least one sentence naturally contains "Krishiq farming platform". Plug where adjacent content already fits.

### §7 About + Ankish Page (/about)
- **Rule**: PageHero H1 reads exactly `About Krishiq`. Eyebrow preserved as "About Krishiq". Subheading kept.
- **Rule**: Developer ContentSection (current H2 "Developer") keep heading. Update body paragraphs:
  - Para 1: `Krishiq is developed by Ankish.` (existing)
  - Para 2: `Ankish is the developer behind Krishiq.` (insert NEW between para 1 and para 3)
  - Para 3 (current second): existing working-agritech-app paragraph, no changes.
  Total: 3 paragraphs total in the Developer section. No more than 2 mentions of "Ankish" in body copy + 1 mention in the title suffix (so 3 Ankish mentions max site-wide besides JSON-LD founder). No bio invented.
- **Rule**: Closing "Explore the platform" section rename H2 → "Learn more about Krishiq". Link list paragraph updates to exactly: link to Krishiq AI, Krishiq for Farmers, Krishiq Agritech, Krishiq Marketplace, Homepage (5 items; Homepage explicitly added vs current).

### §8 Internal Linking Strategy (matrix check)
- **Rule**: After all page edits above are applied, the cross-link matrix below holds exactly (links appear in closing "Related" block per page; homepage uses PlatformOverview card links plus About-section link):
  | Source page | Must link to (exact set) |
  |---|---|
  | / (Home) | /krishiq-ai, /for-farmers, /marketplace, /agritech, /about |
  | /krishiq-ai | /, /for-farmers, /agritech |
  | /for-farmers | /krishiq-ai, /marketplace, / |
  | /marketplace | /for-farmers, /, /agritech |
  | /agritech | /krishiq-ai, /for-farmers, /marketplace, / |
  | /about | /, /krishiq-ai, /for-farmers, /agritech, /marketplace |
  Home already satisfies via PlatformOverview (4 cards) + About section inline link (1 link) → combined covers all 5.
- **Rubric Anchor text quality (0-2)**: 2 = anchors use exact branded names where user requested ("Krishiq AI", "Krishiq for Farmers", "Krishiq Marketplace", "Krishiq Agritech"); "Homepage" anchor allowed for `/`. No generic "click here"; no stuffed anchor repetition. Threshold ≥ 2.

### §9 Page Titles Uniqueness
- **Rule**: Extract `title` field from each of 6 entries in `publicSeo` map; after lowercasing, the 6 strings are pairwise distinct (no duplicates).

### §10 Meta Descriptions Uniqueness
- **Rule**: Extract `description` field from 6 publicSeo entries. After trimming whitespace, 6 strings are pairwise distinct, non-empty, each 120–170 characters long.
- **Rule**: Write/update meta descriptions per user's tighter phrasing where supplied in §3-7 implicit context. Specifically:
  - `/krishiq-ai` description = *"Discover how Krishiq AI puts demand forecasts, price insights, match scores and delivery planning directly into farmer and buyer workspaces."* (original is similar but this is tighter per user's "only real features" mandate)
  - `/for-farmers` description = *"List produce, manage orders and track deliveries with Krishiq for Farmers, a smart agricultural solution built for growers and FPOs."*
  - `/marketplace` description = *"Browse a direct agricultural marketplace of fresh produce listings from farmers and FPOs on the Krishiq Marketplace."*
  - `/agritech` description = *"Krishiq Agritech unites marketplace tools, order tracking and AI-assisted insights for modern farming."*
  Keep `/about` and `/` descriptions as specified in §1 and §7 rules above.

### §11 Headings (structural)
- **Rule**: For each of 6 public pages: parse returned JSX mount, count exactly one `<h1>` element at PageHero or inline H1 point. No 0 or 2+ H1s on any route.
- **Rule**: No H3 appears before the first H2 on any public page.
- **Rubric Heading hierarchy flow (0-2)**: 2 = each page's headings read like a scannable outline (H1 → themed H2 → optional H3 subcards); 1 = one page has an H3 that precedes its sibling H2; 0 = hierarchy broken with skipped levels across 2+ pages. Threshold ≥ 2.

### §12 Image SEO
- **Rule**: Every non-decorative `<img>` rendered on 6 public routes has non-empty alt attribute.
- **Rule**: No alt attribute equals "image1", "photo", "IMG123", or empty string for non-decorative imagery.
- **Rule**: The following specific alt strings are set (entity-aware, not generic, non-stuffed):
  - Home About section image (settings.aboutImage) currently `alt="About KRISHIQ"` → change to `alt="About Krishiq agritech platform"`.
  - Home Hero default media fallback brand image slot default alt currently `"KRISHIQ farm marketplace"` (via default settings.heroImage if Media fn alt is set) → normalize any hardcoded alt strings in Home.jsx Media calls that use ALLCAPS to sentence-case entity "Krishiq farm-to-market platform".
  - Marketplace PublicPage ProductCard alt → "Krishiq Marketplace listing: {cropName} produce" per §5 rule.
  - Home PreviewLot alt → "Krishiq Marketplace: {product.name} produce" per §5 rule.
  - NotFound BrandLogo alt currently `alt="Krishiq logo"` → acceptable (decorative-ish brand mark alt). No change.

### §13 Structured Data (WebSite, Organization, BreadcrumbList, Ankish as creator)
- **Rule**: Static index.html JSON-LD WebSite node exists with `name = "Krishiq"` and alt names as specified.
- **Rule**: Static index.html Organization node has `founder = Person { "@type":"Person", "name":"Ankish" }` — no extra keys, no sibling `address`/`telephone`/`sameAs`/`award`/`aggregateRating`.
- **Rule**: BreadcrumbList per public page via breadcrumbJsonLd helper is injected. ListItem count: Home page = 1; every sub page = 2. Sub page ListItem(1) = Home, ListItem(2) = current branded H1.
- **Rule**: No new structured data types added beyond the 3 (WebSite, Organization, BreadcrumbList) during this pass. No new unsubstantiated claims in graph.

### §14 OG + Social
- **Rule**: SeoManager upserts og:type, og:site_name=Krishiq, og:title, og:description, og:image=https://krishiq-beta.vercel.app/og-image.png, og:url on every route change. og:image URL uses HTTPS production URL, no localhost. Verbatim same implementation as previous pass (verify no regression).
- **Rule**: Twitter card=summary_large_image, title/description/image all mirror OG (existing plumbing; verify no edits reversed it).

### §15 Canonical URLs
- **Rule**: For 6 public pages, SeoManager canonical = SITE_URL + normalized path; SITE_URL = `https://krishiq-beta.vercel.app`. No `/` sub-paths point canonical to `/`. No "localhost" substring in any SeoManager output template.
- **Rule**: Private routes still get canonicals (as fallback) but carry meta noindex,nofollow so canonicals don't matter for indexing.

### §16 Robots + Sitemap
- **Rule**: `public/robots.txt` kept identical, unchanged. Sitemap line references `https://krishiq-beta.vercel.app/sitemap.xml`.
- **Rule**: `public/sitemap.xml` kept identical — 6 HTTPS public URLs only. No login/signup/dashboard/profile/private routes added. No `/api/` in sitemap.
- **Rule**: `vercel.json` headers block for /sitemap.xml and /robots.txt preserved unchanged.

### §17 Indexability
- **Rule**: After build, vite preview HTTP GET → 200 for /, /about, /krishiq-ai, /for-farmers, /marketplace, /agritech, /robots.txt, /sitemap.xml.
- **Rule**: All 6 public pages have meta robots index,follow (SeoManager via publicSeo). All exact private routes + role prefixes have noindex,nofollow.
- **Rule**: Internal links matrix (§8) connects 6 public pages → crawl coverage through internal links.

### §18 Content Quality
- **Rubric Clarity & usefulness (0-2)**: 2 = each page's copy directly explains real platform capabilities without promise inflation; no paragraphs are keyword-rewritten synonyms of another paragraph. 1 = one section has duplicate-sentence feel; 0 = ≥ 2 pages have duplicate filler content. Threshold ≥ 2.

### §19 Brand Spelling Consistency
- **Rule**: Case-insensitive grep of H2, eyebrow, alt, related-link anchor text, and in-content brand mentions for "KRISHIQ" allcaps finds zero matches EXCEPT for brandName prop default strings "KRISHIQ" used inside Navbar+Footer visual wordmark components and WebSite JSON-LD `alternateName: ["KRISHIQ"]`. Zero occurrences of "KrishiQ", "Krishik", "Krishiq.com" in any prose/alt/heading.

### §20 Search Intent Alignment
- **Rule**: For each of the 7 branded search phrases in user §20 matrix, at least one public page with that entity as its primary H1 exists:
  - "Krishiq" → / (H1)
  - "Krishiq AI" → /krishiq-ai (H1)
  - "Krishiq for Farmer(s)" → /for-farmers (H1)
  - "Krishiq Marketplace" → /marketplace (H1)
  - "Krishiq Agritech" → /agritech (H1)
  - "Ankish Krishiq" → /about H1 suffix title + Ankish sentence pair + JSON-LD founder node
  Each page's H1 + first paragraph together explicitly answer "this page is about X" for the target query.

### §21 Technical Performance (no design changes)
- **Rule**: All below-fold `<img>` on public routes retain `loading="lazy"`. No regressions.
- **Rule**: Hero `<img>` above fold stays non-lazy. `preconnect` for Google Fonts stays.
- **Rule**: `<script>` tag stays at end of `<body>`; no new scripts added.
- **Rule**: Semantic HTML tag usage preserved or improved (header, nav, main, section, article, footer). New Features H2 in Features band must wrap inside `<section>` (already in landing-band `<section>`) with H2 as first element heading, not a generic div — keep semantics.
- **Rubric A11y improvements (0-2)**: 2 = every newly written H2 and its Eyebrow sibling correctly order (Eyebrow paragraph first, H2 second); images with alt now describe entities; internal nav links have descriptive aria-labeledby or use text anchors as accessible names. Threshold ≥ 2.

### §22 Final Audit
- **Rule**: No duplicate page titles across publicSeo.
- **Rule**: No duplicate meta descriptions.
- **Rule**: No missing titles / descriptions / H1s.
- **Rule**: No multiple H1s per route.
- **Rule**: No missing alt for non-decorative public images.
- **Rule**: No broken internal links (every `to=` target matches AppRoutes.jsx public or private routes correctly; anchors resolved via preview smoke test 200).
- **Rule**: Sitemap and robots.xml status: 200 preview HTTP; contents unchanged.
- **Rule**: OG + Twitter tag coverage: SeoManager code inspection confirms both blocks upserted for every route.
- **Rule**: Mobile responsiveness: Tailwind `sm:`, `lg:` breakpoints remain intact; no new class removed that would collapse mobile layout.

### §23 De-Risk Homepage Index
- **Rule**: Homepage meta robots = index,follow both static in index.html and dynamic in SeoManager.
- **Rule**: Homepage not listed in any robots.txt Disallow pattern.
- **Rule**: Homepage listed first in sitemap.xml priority=1.0.
- **Rule**: GSC tag rollback applied (top AC).

### §24 Final Report (deliverable)
- **Rubric Report completeness (0-2)**: 2 = report covers all 13 user-numbered items with concrete path URLs, exact before→after strings for titles/meta/H1s/H2s/links/alt changes, itemized pages optimized, 2-sentence remaining issues, exact git add/commit/push commands. Threshold ≥ 2.
