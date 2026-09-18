import { useState } from "react";
import { useSiteSettings } from "../../context/SiteSettingsContext.jsx";
import { BRAND_LOGO } from "../../brand.js";

/**
 * BrandLogo
 * ---------
 * The ONLY component that renders the Krishiq brand logo anywhere in the app.
 *
 * Source of truth (priority order):
 *   1. `brandLogo` from SiteSettingsContext  ← admin-saved Cloudinary URL from DB
 *   2. BRAND_LOGO constant in brand.js       ← static /logo.png from /public
 *   3. "K" text badge                        ← absolute last resort, never broken image
 *
 * The optional `src` prop is kept for backward compatibility only (e.g. if a
 * caller explicitly passes a local override). In practice every BrandLogo
 * instance now auto-reads the correct logo from context — no prop needed.
 *
 * This component has ZERO knowledge of user profile images.
 * It must NEVER be fed user.profileImage or any auth-user field.
 */

function isValidSrc(value) {
  if (!value || typeof value !== "string") return false;
  const t = value.trim();
  return t.startsWith("https://") || t.startsWith("http://") || t.startsWith("/");
}

export default function BrandLogo({ src, className = "h-12 w-12", alt = "Krishiq logo" }) {
  // Pull the admin-saved logo URL from the global context.
  // Falls back gracefully if context is unavailable (e.g. during testing).
  let contextLogo = BRAND_LOGO;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { brandLogo } = useSiteSettings();
    contextLogo = brandLogo;
  } catch {
    // outside provider — use static fallback
  }

  // Priority: explicit prop > context (admin DB value) > static fallback
  const primary = isValidSrc(src) ? src.trim() : isValidSrc(contextLogo) ? contextLogo : BRAND_LOGO;

  const [current, setCurrent] = useState(primary);
  const [triedFallback, setTriedFallback] = useState(false);
  const [failed, setFailed] = useState(false);

  // Sync when the context value updates (admin saves new logo, page re-renders).
  const resolved = isValidSrc(src) ? src.trim() : isValidSrc(contextLogo) ? contextLogo : BRAND_LOGO;
  if (resolved !== current && !triedFallback && !failed) {
    setCurrent(resolved);
  }

  const onError = () => {
    if (!triedFallback) {
      setTriedFallback(true);
      setCurrent(BRAND_LOGO);
    } else {
      setFailed(true);
    }
  };

  if (failed) {
    return (
      <span
        aria-label={alt}
        role="img"
        className={`inline-flex items-center justify-center rounded-full bg-primary-green font-extrabold text-white ${className}`}
      >
        K
      </span>
    );
  }

  return (
    <img
      key={current}
      src={current}
      alt={alt}
      width="48"
      height="48"
      decoding="async"
      className={`rounded-full bg-black object-cover shadow-soft ${className}`}
      onError={onError}
    />
  );
}
