import { useEffect } from "react";

export default function SeoJsonLd({ id = "krishiq-page-jsonld", data }) {
  useEffect(() => {
    if (!data) {
      document.getElementById(id)?.remove();
      return undefined;
    }
    let element = document.getElementById(id);
    if (!element) {
      element = document.createElement("script");
      element.id = id;
      element.type = "application/ld+json";
      document.head.appendChild(element);
    }
    element.textContent = JSON.stringify(data);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, [data, id]);
  return null;
}
