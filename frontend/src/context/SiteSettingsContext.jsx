import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { publicApi } from "../api/publicApi.js";
import { BRAND_LOGO } from "../brand.js";

/**
 * SiteSettingsContext
 * -------------------
 * Fetches published site settings from the backend ONCE at app startup and
 * exposes them to every component in the tree.
 *
 * KEY EXPORT: `brandLogo`
 *   - The resolved brand logo URL for the current admin-saved setting.
 *   - Falls back to BRAND_LOGO ("/logo.png") if the API hasn't loaded yet
 *     or if the admin has not set a custom logo.
 *   - This is the SINGLE SOURCE OF TRUTH for the Krishiq brand logo.
 *   - It has ZERO connection to user profile images.
 *
 * DATA FLOW:
 *   Admin → /admin/settings → MongoDB (key: "logoUrl")
 *   → GET /public/site-settings
 *   → SiteSettingsContext.brandLogo
 *   → BrandLogo component, Sidebar, Login, Register, SeoManager (favicon)
 */

const SiteSettingsContext = createContext(null);

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    publicApi
      .siteSettings()
      .then((data) => {
        setSettings(data || {});
      })
      .catch(() => {
        // Silently fall back to static defaults — site still works.
      })
      .finally(() => {
        setLoaded(true);
      });
  }, []);

  const value = useMemo(() => {
    // brandLogo: use the admin-saved Cloudinary URL when valid; fall back to
    // the static /logo.png from the public folder.
    const saved = settings.logoUrl;
    const brandLogo =
      saved && typeof saved === "string" && saved.trim().length > 0
        ? saved.trim()
        : BRAND_LOGO;

    return {
      settings,   // full raw settings object for consumers that need other fields
      brandLogo,  // the resolved brand logo — the one true source
      loaded,     // true once the first API response has resolved
    };
  }, [settings, loaded]);

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  return ctx;
}

export default SiteSettingsContext;
