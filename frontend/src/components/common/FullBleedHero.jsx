import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "./ui.jsx";
import HeroMediaCarousel from "./HeroMediaCarousel.jsx";

export default function FullBleedHero({ settings }) {
  const navigate = useNavigate();

  return <section className="relative min-h-[720px] overflow-hidden pt-[76px] lg:min-h-[82vh]">
    <div className="absolute inset-0">
      <HeroMediaCarousel items={settings.heroMedia} legacyImage={settings.heroImage} fullBleed />
    </div>
    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(3,18,11,0.88)_0%,rgba(3,18,11,0.62)_34%,rgba(3,18,11,0.18)_68%,rgba(3,18,11,0.08)_100%)]" />
    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(3,18,11,0.74)_0%,transparent_32%,rgba(3,18,11,0.12)_100%)]" />
    <div className="page-wrap relative z-10 flex min-h-[644px] items-center py-14 lg:min-h-[calc(82vh-76px)] lg:py-20">
      <div className="max-w-3xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-leaf/30 bg-[#06150F]/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-leaf backdrop-blur-md"><Sparkles className="h-3.5 w-3.5" /> {settings.heroBadge}</div>
        <h1 className="max-w-3xl text-[clamp(2.75rem,6vw,5.8rem)] font-black leading-[1.02] tracking-[-0.035em] text-white">{highlightHeading(settings.heroHeading)}</h1>
        <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-[#F1F5F3] sm:text-[18px]">{settings.heroSubheading}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button size="lg" className="w-full sm:w-auto" onClick={() => navigate(settings.heroCtaLink || "/register")}>{settings.heroCtaText} <ArrowRight className="h-4 w-4" /></Button><Button size="lg" variant="onDark" className="border-white/35 bg-[#06150F]/35 text-white backdrop-blur-md hover:bg-white/15 w-full sm:w-auto" onClick={() => navigate(settings.heroSecondaryCtaLink || "/marketplace")}>{settings.heroSecondaryCtaText}</Button></div>
        <div className="mt-6 text-sm text-[#E2EAE5]"><span className="drop-shadow-md">{settings.brandSubtitle || "Built to simplify the journey from produce to purchase."}</span></div>
      </div>
    </div>
  </section>;
}

function highlightHeading(heading = "") {
  return heading.split(/(Smarter\.?|Direct\.?)/gi).map((part, index) => {
    if (/^smarter\.?$/i.test(part)) return <span key={index} className="text-leaf">{part}</span>;
    if (/^direct\.?$/i.test(part)) return <span key={index} className="text-[#93C5FD]">{part}</span>;
    return part;
  });
}
