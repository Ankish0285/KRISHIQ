import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Image as ImageIcon, Play } from "lucide-react";

const IMAGE_DURATION = 5000;

export default function HeroMediaCarousel({ items = [], legacyImage = "", fullBleed = false }) {
  const activeItems = useMemo(() => {
    const normalized = items.filter((item) => item?.active !== false && item?.cloudinaryUrl).sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
    if (normalized.length) return normalized;
    return legacyImage ? [{ id: "legacy-hero", type: "image", cloudinaryUrl: legacyImage, active: true, order: 0 }] : [];
  }, [items, legacyImage]);
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const videoRef = useRef(null);
  const current = activeItems[index] || null;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener?.("change", update);
    return () => mediaQuery.removeEventListener?.("change", update);
  }, []);

  useEffect(() => { setIndex((value) => Math.min(value, Math.max(activeItems.length - 1, 0))); }, [activeItems.length]);

  useEffect(() => {
    if (!current || current.type === "video" || reducedMotion || activeItems.length < 2) return undefined;
    const timer = window.setTimeout(() => setIndex((value) => (value + 1) % activeItems.length), IMAGE_DURATION);
    return () => window.clearTimeout(timer);
  }, [current, activeItems.length, reducedMotion]);

  useEffect(() => {
    if (current?.type === "video" && videoRef.current) videoRef.current.play().catch(() => {});
  }, [current]);

  const next = () => setIndex((value) => activeItems.length ? (value + 1) % activeItems.length : 0);
  const previous = () => setIndex((value) => activeItems.length ? (value - 1 + activeItems.length) % activeItems.length : 0);

  return <div className={fullBleed ? "relative h-full w-full overflow-hidden bg-[#0B2418]" : "relative h-[330px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0B2418] shadow-[0_20px_60px_rgba(0,0,0,0.24)] sm:h-[430px] lg:h-[500px]"}>
    {current ? <AnimatePresence initial={false} mode="sync">
      <motion.div key={current.id || current.cloudinaryUrl} initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }} animate={{ opacity: 1 }} exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.7 }} className="absolute inset-0">
        {current.type === "video" ? <video ref={videoRef} src={current.cloudinaryUrl} poster={current.posterUrl || undefined} className="h-full w-full object-cover" autoPlay muted playsInline loop={current.playback === "loop"} onEnded={current.playback === "loop" ? undefined : next} /> : <img src={current.cloudinaryUrl} alt={current.alt || "KRISHIQ farm marketplace"} className="h-full w-full object-cover" fetchPriority={index === 0 ? "high" : "auto"} />}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06150F]/80 via-[#06150F]/10 to-transparent" />
      </motion.div>
    </AnimatePresence> : <div className="grid h-full place-items-center bg-[linear-gradient(135deg,#0a2c1c,#123e2a_52%,#123255)]"><SproutFallback /></div>}
    {activeItems.length > 1 && <>
      <button type="button" aria-label="Previous hero media" onClick={previous} className="absolute left-4 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[#06150F]/55 text-white backdrop-blur hover:bg-[#06150F]/80"><ChevronLeft className="h-5 w-5" /></button>
      <button type="button" aria-label="Next hero media" onClick={next} className="absolute right-4 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[#06150F]/55 text-white backdrop-blur hover:bg-[#06150F]/80"><ChevronRight className="h-5 w-5" /></button>
      <div className="absolute bottom-4 left-0 right-0 z-10 flex items-center justify-center gap-2"><span className="sr-only">Hero media {index + 1} of {activeItems.length}</span>{activeItems.map((item, itemIndex) => <button key={item.id || item.cloudinaryUrl} type="button" aria-label={`Show hero media ${itemIndex + 1}`} aria-current={itemIndex === index} onClick={() => setIndex(itemIndex)} className={`h-1.5 rounded-full transition-all ${itemIndex === index ? "w-7 bg-leaf" : "w-1.5 bg-white/50"}`} />)}</div>
    </>}
    {current?.type === "video" && <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur"><Play className="h-3 w-3 fill-current" /> Video</span>}
  </div>;
}

function SproutFallback() { return <div className="text-center text-leaf/60"><ImageIcon className="mx-auto h-16 w-16" /><p className="mt-3 text-xs uppercase tracking-[0.18em]">KRISHIQ marketplace</p></div>; }
