export const SITE_URL = "https://krishiq-beta.vercel.app";
export const SITE_NAME = "Krishiq";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
export const DEFAULT_LOGO = `${SITE_URL}/logo.png`;

export const HOME_TITLE = "Krishiq – AI-Powered Agritech Platform for Farmers";
export const HOME_DESCRIPTION =
  "Krishiq is an AI-powered agritech platform for farmers, bringing smart agricultural solutions, technology and marketplace services together in one platform.";

export const publicSeo = {
  "/": {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    robots: "index,follow",
  },
  "/marketplace": {
    title: "Krishiq Marketplace – Agricultural Marketplace | Krishiq",
    description:
      "Discover the Krishiq Marketplace, a direct agricultural marketplace connecting farmers and FPOs with buyers for fresh vegetables, grains, and cash crops.",
    robots: "index,follow",
  },
  "/krishiq-ai": {
    title: "Krishiq AI – AI-Powered Technology for Farmers | Krishiq",
    description:
      "Explore Krishiq AI – smart agricultural technology delivering crop demand forecasts, fair price insights, and lot matching for farmers and agricultural buyers.",
    robots: "index,follow",
  },
  "/for-farmers": {
    title: "Krishiq for Farmers – Smart Agricultural Solutions | Krishiq",
    description:
      "Krishiq for Farmers empowers growers and FPOs with direct marketplace selling, order tracking, transparent pricing, and smart agritech tools.",
    robots: "index,follow",
  },
  "/agritech": {
    title: "Krishiq Agritech – Technology for Modern Farming | Krishiq",
    description:
      "Krishiq Agritech bridges technology and modern agriculture through real-time order tracking, digital listings, secure workflows, and intelligent farming tools.",
    robots: "index,follow",
  },
  "/about": {
    title: "About Krishiq – Agritech Platform Developed by Ankish",
    description:
      "Learn about Krishiq, an AI-powered agritech platform developed by Ankish to connect farmers, FPOs, and buyers with transparent market technology.",
    robots: "index,follow",
  },
};

const noindexExact = new Set([
  "/login",
  "/register",
  "/cart",
  "/checkout",
  "/payment",
  "/order-confirmation",
  "/dashboard",
]);

const noindexPrefixes = [
  "/farmer",
  "/buyer",
  "/fpo",
  "/admin",
  "/super-admin",
];

export function isNoindexPath(pathname) {
  if (noindexExact.has(pathname)) return true;
  return noindexPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function seoForPath(pathname) {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (publicSeo[normalized]) {
    return { ...publicSeo[normalized], path: normalized, noindex: false };
  }
  if (isNoindexPath(normalized)) {
    return {
      title: `${SITE_NAME} account`,
      description: HOME_DESCRIPTION,
      path: normalized,
      robots: "noindex,nofollow",
      noindex: true,
    };
  }
  if (normalized.startsWith("/product/")) {
    return {
      title: `Produce listing | ${SITE_NAME}`,
      description: "View a produce listing on the Krishiq Marketplace, sourced from farmers and FPOs.",
      path: normalized,
      robots: "index,follow",
      noindex: false,
    };
  }
  return {
    title: `${SITE_NAME} – page not found`,
    description: HOME_DESCRIPTION,
    path: normalized,
    robots: "noindex,nofollow",
    noindex: true,
  };
}

export const sitemapPaths = ["/", "/marketplace", "/krishiq-ai", "/for-farmers", "/agritech", "/about"];

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        alternateName: ["Krishiq AI", "Krishiq for Farmers", "Krishiq Marketplace", "Krishiq Agritech", "KRISHIQ"],
        url: `${SITE_URL}/`,
        description: HOME_DESCRIPTION,
        inLanguage: "en",
        author: {
          "@type": "Person",
          name: "Ankish",
          description: "Developer of Krishiq",
        },
        creator: {
          "@type": "Person",
          name: "Ankish",
        },
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: DEFAULT_LOGO,
        description: HOME_DESCRIPTION,
        founder: {
          "@type": "Person",
          name: "Ankish",
        },
      },
      {
        "@type": "WebApplication",
        "@id": `${SITE_URL}/#webapp`,
        name: "Krishiq",
        url: `${SITE_URL}/`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "All",
        author: {
          "@type": "Person",
          name: "Ankish",
        },
        description: HOME_DESCRIPTION,
      },
    ],
  };
}

export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
