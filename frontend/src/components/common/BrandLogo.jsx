import { useState } from "react";

/**
 * BrandLogo – the official Krishiq brand mark.
 *
 * Rules:
 *  - The static `/logo.png` from the public folder is always the ultimate fallback.
 *  - A CMS-supplied `src` (e.g. a Cloudinary URL) is tried first when provided.
 *  - If the CMS URL fails, we immediately fall back to `/logo.png`.
 *  - If even `/logo.png` fails we render the text "K" so the page never shows
 *    a broken-image icon.
 *  - This component NEVER reads from user profile state. It is brand-only.
 */

/** The canonical static brand logo served from the public folder. */
const STATIC_LOGO = "/logo.png";

/** Returns true only for non-empty strings that look like a real URL. */
function isValidUrl(value) {
  if (!value || typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  // Must start with http(s):// or / (relative path)
  return trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/");
}

export default function BrandLogo({
  className = "h-12 w-12",
  alt = "Krishiq logo",
  /** Optional CMS override URL (e.g. settings.logoUrl). Falls back to static logo. */
  src,
}) {
  // Determine the primary source: use CMS URL only when it looks valid.
  const primarySrc = isValidUrl(src) ? src.trim() : STATIC_LOGO;

  // Track whether we have already attempted the static fallback so we never
  // enter an infinite onError loop.
  const [imgSrc, setImgSrc] = useState(primarySrc);
  const [usedFallback, setUsedFallback] = useState(false);
  const [hardFailed, setHardFailed] = useState(false);

  // If the src prop changes (CMS reload), reset state.
  // We do this by using the src as a key at the call site (see note below),
  // but we also sync here for safety.
  const expectedPrimary = isValidUrl(src) ? src.trim() : STATIC_LOGO;
  if (imgSrc !== expectedPrimary && !usedFallback && !hardFailed) {
    setImgSrc(expectedPrimary);
  }

  const handleError = () => {
    if (!usedFallback) {
      // First failure: try the static logo from public/
      setUsedFallback(true);
      setImgSrc(STATIC_LOGO);
    } else {
      // Both the CMS URL and the static logo failed. Show text fallback.
      setHardFailed(true);
    }
  };

  if (hardFailed) {
    // Last-resort text badge — never shows a broken image icon.
    return (
      <span
        aria-label={alt}
        className={`inline-flex items-center justify-center rounded-full bg-primary-green font-extrabold text-white ${className}`}
      >
        K
      </span>
    );
  }

  return (
    <img
      // key forces React to remount when the resolved src changes, which
      // clears any previous error state from the browser.
      key={imgSrc}
      src={imgSrc}
      alt={alt}
      width="48"
      height="48"
      decoding="async"
      className={`rounded-full bg-black object-cover shadow-soft ${className}`}
      onError={handleError}
    />
  );
}
