/**
 * KRISHIQ STATIC BRAND FALLBACK
 * ==============================
 * BRAND_LOGO is the last-resort fallback used when:
 *   a) The SiteSettingsContext has not yet loaded (first render / SSR).
 *   b) The admin has not saved a custom logo to the database.
 *   c) The admin-saved Cloudinary URL is broken or unreachable.
 *
 * The LIVE brand logo (the one that changes when the super admin saves a new
 * logo in Website Control) comes from:
 *   SiteSettingsContext → publicApi.siteSettings() → GET /public/site-settings
 *   → MongoDB key "logoUrl"
 *
 * To update the static fallback (e.g. initial deploy):
 *   1. Place your logo file in /public (e.g. /public/logo.png).
 *   2. Change BRAND_LOGO below to match.
 *   3. Redeploy the frontend.
 *
 * DO NOT use this constant as the primary logo source in components.
 * Use useSiteSettings().brandLogo or the <BrandLogo> component instead.
 */

export const BRAND_LOGO = "/logo.png";

export const BRAND_NAME = "Krishiq";
