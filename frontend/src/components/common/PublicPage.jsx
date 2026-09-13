import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import SeoJsonLd from "../../seo/SeoJsonLd.jsx";

export default function PublicPage({ children, jsonLd }) {
  return (
    <div className="landing-page min-h-screen overflow-x-hidden bg-night text-[#F8FAFC]">
      {jsonLd ? <SeoJsonLd data={jsonLd} /> : null}
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export function PageHero({ eyebrow, title, text }) {
  return (
    <section className="page-wrap pt-28 pb-10 lg:pt-32 lg:pb-12">
      {eyebrow ? <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-leaf">{eyebrow}</p> : null}
      <h1 className="mt-3 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">{title}</h1>
      {text ? <p className="mt-5 max-w-3xl text-[16px] leading-relaxed text-[#A7B8B0] sm:text-[18px]">{text}</p> : null}
    </section>
  );
}

export function ContentSection({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="page-wrap py-10 lg:py-14">
      {eyebrow ? <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-leaf">{eyebrow}</p> : null}
      {title ? <h2 className="mt-3 max-w-3xl text-2xl font-black sm:text-4xl">{title}</h2> : null}
      <div className="mt-5 max-w-3xl space-y-4 text-[16px] leading-relaxed text-[#A7B8B0]">{children}</div>
    </section>
  );
}
