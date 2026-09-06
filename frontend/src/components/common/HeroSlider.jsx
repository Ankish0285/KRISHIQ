import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_SLIDES } from "../../utils/heroSlides.js";

const INTERVAL = 5000;
const DURATION = 0.85;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const timer = useRef(null);
  const isDesktop = useRef(false);

  useEffect(() => {
    isDesktop.current = window.matchMedia("(min-width: 768px)").matches;
  }, []);

  const goTo = useCallback((next, dir = 1) => {
    setDirection(dir);
    setIndex((i) => (typeof next === "number" ? next : (i + dir + HERO_SLIDES.length) % HERO_SLIDES.length));
  }, []);

  useEffect(() => {
    if (paused) return undefined;
    timer.current = setInterval(() => goTo(null, 1), INTERVAL);
    return () => clearInterval(timer.current);
  }, [paused, index, goTo]);

  const manual = (dir) => {
    clearInterval(timer.current);
    goTo(null, dir);
  };

  const slide = HERO_SLIDES[index];

  return (
    <div
      className="relative h-[380px] w-full overflow-hidden rounded-2xl border border-white/10 sm:h-[440px] lg:h-[520px]"
      onMouseEnter={() => {
        if (isDesktop.current) setPaused(true);
      }}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={slide.id}
          custom={direction}
          initial={{ opacity: 0, x: direction * 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -28 }}
          transition={{ duration: DURATION, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={slide.src}
            alt={slide.alt}
            className="h-full w-full object-cover"
            loading={index === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06150F]/80 via-[#06150F]/25 to-[#06150F]/10" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute left-4 top-4 z-10 max-w-[min(100%-2rem,260px)] rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-md">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#93C5FD]">{slide.kicker}</p>
        <p className="mt-1 text-[15px] font-semibold text-[#F8FAFC]">{slide.value}</p>
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => manual(-1)}
        className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[#06150F]/55 text-white backdrop-blur hover:bg-[#06150F]/80"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => manual(1)}
        className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[#06150F]/55 text-white backdrop-blur hover:bg-[#06150F]/80"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => {
              clearInterval(timer.current);
              goTo(i, i > index ? 1 : -1);
            }}
            className={`h-2 rounded-full transition-all ${i === index ? "w-7 bg-leaf" : "w-2 bg-white/40 hover:bg-white/70"}`}
          />
        ))}
      </div>
    </div>
  );
}
