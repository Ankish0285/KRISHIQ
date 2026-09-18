import { useState } from "react";
import { BRAND_LOGO } from "../../brand.js";

/**
 * BrandLogo
 * ---------
 * Renders the official Krishiq brand logo everywhere in the app.
 * The single source of truth is `BRAND_LOGO` in src/brand.js.
 *
 * Fallback chain (top → bottom, stops at first success):
 *   1. CMS override URL   — passed via the optional `src` prop
 *   2. BRAND_LOGO         — the static asset defined in src/brand.js
 *   3. "K" text badge     — last resort; never shows a broken-image icon
 *
 * This component has ZERO knowledge of user profile state.
 * It must never be used as, or replaced by, a user avatar.
 */

/** Accept only non-empty strings that look like a real URL or path. */
function isValidSrc(value) {
  if (!value || typeof value !== "string") return false;
  const t = value.trim();
  return t.startsWith("https://") || t.startsWith("http://") || t.startsWith("/");
}

export default function BrandLogo({
  /** Optional CMS / settings override. Falls back to BRAND_LOGO when absent or broken. */
  src,
  className = "h-12 w-12",
  alt = "Krishiq logo",
}) {
  const primary = isValidSrc(src) ? src.trim() : BRAND_LOGO;

  const [current, setCurrent] = useState(primary);
  const [triedFallback, setTriedFallback] = useState(false);
  const [failed, setFailed] = useState(false);

  // Keep in sync when the CMS reloads a new src without unmounting.
  const resolved = isValidSrc(src) ? src.trim() : BRAND_LOGO;
  if (resolved !== current && !triedFallback && !failed) {
    setCurrent(resolved);
  }

  const onError = () => {
    if (!triedFallback) {
      // Step 1 failed — try the guaranteed static brand logo.
      setTriedFallback(true);
      setCurrent(BRAND_LOGO);
    } else {
      // Step 2 failed — render text badge so nothing is broken.
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
      key={current}           // forces remount on src change to clear browser error cache
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
