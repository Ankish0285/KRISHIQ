import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  seoForPath,
  websiteJsonLd,
} from "./site.js";
import { useSiteSettings } from "../context/SiteSettingsContext.jsx";

function upsertMeta(attr, key, content) {
  if (!content) return;
  const selector = `meta[${attr}="${key}"]`;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertLink(rel, href, type) {
  // Match on both rel and (optionally) type so multiple icon variants coexist.
  const selector = type
    ? `link[rel="${rel}"][type="${type}"]`
    : `link[rel="${rel}"]`;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    if (type) element.setAttribute("type", type);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

function upsertJsonLd(id, data) {
  let element = document.getElementById(id);
  if (!element) {
    element = document.createElement("script");
    element.id = id;
    element.type = "application/ld+json";
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(data);
}

export default function SeoManager() {
  const { pathname } = useLocation();
  const seo = seoForPath(pathname);
  const canonical = `${SITE_URL}${seo.path === "/" ? "/" : seo.path}`;
  const robots = seo.robots || (seo.noindex ? "noindex,nofollow" : "index,follow");

  // Get the admin-saved brand logo from the global context.
  // This is the same value BrandLogo uses — one source of truth for all logo locations.
  const { brandLogo } = useSiteSettings();

  useEffect(() => {
    document.title = seo.title;
    upsertMeta("name", "description", seo.description);
    upsertMeta("name", "robots", robots);
    upsertMeta("name", "googlebot", robots);
    upsertLink("canonical", canonical);
    upsertMeta("property", "og:type", seo.path === "/" ? "website" : "article");
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:title", seo.title);
    upsertMeta("property", "og:description", seo.description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:image", DEFAULT_OG_IMAGE);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", seo.title);
    upsertMeta("name", "twitter:description", seo.description);
    upsertMeta("name", "twitter:image", DEFAULT_OG_IMAGE);
    upsertJsonLd("krishiq-website-jsonld", websiteJsonLd());

    // ── Favicon sync ──────────────────────────────────────────────────────────
    // Always keep the browser tab icon in sync with the admin-saved brand logo.
    // We update the DOM directly because index.html only sets the initial value;
    // after the SPA boots and settings load, this keeps it current on every
    // route change AND whenever brandLogo changes (admin saves a new logo).
    upsertLink("icon", brandLogo, "image/png");
    upsertLink("apple-touch-icon", brandLogo);
    // ─────────────────────────────────────────────────────────────────────────
  }, [canonical, robots, seo.description, seo.path, seo.title, brandLogo]);

  return null;
}
