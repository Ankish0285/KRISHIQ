/**
 * KRISHIQ BRAND CONFIGURATION
 * ============================
 * This is the ONE place to change the brand logo for the entire application.
 *
 * BRAND_LOGO is automatically used by:
 *   - Header / Navbar
 *   - Sidebar (dashboard + admin)
 *   - Footer
 *   - Login page
 *   - Register page
 *   - 404 / error pages
 *   - Mobile navigation
 *   - Browser favicon / tab icon
 *   - Apple touch icon
 *   - SEO / JSON-LD structured data
 *
 * HOW TO CHANGE THE LOGO:
 *   1. Drop your new logo file into /public  (e.g. /public/logo.png)
 *   2. Update BRAND_LOGO below to the new path or URL.
 *   3. Redeploy — every location updates automatically.
 *
 * RULES:
 *   - Use a path starting with "/" for files in /public (Vite serves them as-is).
 *   - Or use a full https:// URL (e.g. a Cloudinary permanent URL).
 *   - NEVER reference this constant from user-profile/avatar code.
 *   - The CMS logoUrl (from admin settings) is an *optional override* layered
 *     on top; if it is missing or broken, this value is always the fallback.
 */

export const BRAND_LOGO = "/logo.png";

export const BRAND_NAME = "Krishiq";
