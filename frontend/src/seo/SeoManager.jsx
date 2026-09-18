import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  seoForPath,
  websiteJsonLd,
} from "./site.js";
import { BRAND_LOGO } from "../brand.js";

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

function upsertLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
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

    // Keep the browser favicon in sync with BRAND_LOGO (the single source of truth).
    // This covers route changes and SPA navigation — the <link> tags in index.html
    // only fire once on initial load, so we keep them current here.
    upsertLink("icon", BRAND_LOGO);
    upsertLink("apple-touch-icon", BRAND_LOGO);
  }, [canonical, robots, seo.description, seo.path, seo.title]);
  return null;
}
