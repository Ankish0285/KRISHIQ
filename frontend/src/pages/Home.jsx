import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, Brain, CheckCircle2, Leaf, MapPin, Package, ShoppingCart, Sprout, Truck, TrendingUp, Users, BarChart3, Boxes,
} from "lucide-react";
import Navbar from "../components/common/Navbar.jsx";
import Footer from "../components/common/Footer.jsx";
import BrandLogo from "../components/common/BrandLogo.jsx";
import HeroSlider from "../components/common/HeroSlider.jsx";
import { Badge, Button, Card } from "../components/common/ui.jsx";
import DemandForecastChart from "../components/common/DemandForecastChart.jsx";
import { DEMAND_SERIES } from "../utils/mockData.js";

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
const LANDING_WEEKS = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"];

export default function Home() {
  return (
    <div className="overflow-x-hidden bg-night text-[#F8FAFC]">
      <Navbar />
      <Hero />
      <Stats />
      <HowItWorks />
      <Features />
      <AISection />
      <Benefits />
      <About />
      <CTA />
      <Footer />
    </div>
  );
}

function SectionReveal({ children, className = "" }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      variants={fadeUp}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(34,197,94,0.16),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(37,99,235,0.14),transparent_30%)]" />
      <div className="page-wrap relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-14 lg:py-24">
        <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.55 }}>
          <Badge className="mb-5 bg-[#14532D] text-leaf">SIH 2026 · AgriTech · Direct Markets</Badge>
          <h1 className="max-w-xl text-[40px] font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[64px]">
            From Farm to Market.
            <span className="mt-2 block">
              <span className="text-leaf">Smarter.</span>{" "}
              <span className="text-ai-blue">Direct.</span>{" "}
              <span className="text-leaf">Fair.</span>
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-[#94A3B8] sm:text-[17px]">
            KRISHIQ connects farmers and FPOs directly with buyers using AI-powered recommendations, demand forecasting, transparent pricing and smart logistics.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate("/register")}>
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="onDark" className="w-full sm:w-auto" onClick={() => navigate("/login")}>
              Explore Marketplace
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-4 text-[15px] text-[#94A3B8]">
            <BrandLogo className="h-12 w-12" />
            <p>Trusted by farmers, FPOs and bulk buyers across Rajasthan and NCR.</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
          <HeroSlider />
        </motion.div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { value: 10000, suffix: "+", label: "Farmers", icon: Users, tone: "green" },
    { value: 500, suffix: "+", label: "Buyers", icon: ShoppingCart, tone: "blue" },
    { value: 25, suffix: "+", label: "Crop Categories", icon: Boxes, tone: "green" },
    { value: 94, suffix: "%", label: "AI-Powered Matching", icon: Brain, tone: "blue" },
  ];
  return (
    <section className="page-wrap py-20">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Stat key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
}

function Stat({ value, suffix, label, icon: Icon, tone }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 900);
      setN(Math.round(value * p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);
  return (
    <Card
      ref={ref}
      className="border-white/10 bg-panel p-6 text-left shadow-none transition duration-300 hover:-translate-y-1"
    >
      <div className={`mb-4 grid h-11 w-11 place-items-center rounded-xl ${tone === "blue" ? "bg-ai-blue/15 text-ai-blue" : "bg-[#14532D] text-leaf"}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-[32px] font-extrabold tracking-tight text-[#F8FAFC]">
        {n.toLocaleString("en-IN")}
        {suffix}
      </p>
      <p className="mt-1 text-[15px] text-[#94A3B8]">{label}</p>
    </Card>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Farmer Lists Produce", text: "Add crop, quantity, quality and farm-gate price in minutes.", icon: Leaf },
    { n: "02", title: "AI Finds the Best Buyer", text: "Matching considers location, demand, price band and reliability.", icon: Brain },
    { n: "03", title: "Smart Logistics Plans Delivery", text: "Optimized pickup routes from farm to FPO warehouse to buyer.", icon: Truck },
    { n: "04", title: "Farmer Gets Better Market Access", text: "Fewer intermediaries, clearer prices, faster payments.", icon: TrendingUp },
  ];
  return (
    <section id="how-it-works" className="page-wrap py-20">
      <SectionReveal>
        <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-leaf">How KRISHIQ Works</p>
        <h2 className="mt-3 max-w-2xl text-[32px] font-extrabold tracking-tight sm:text-4xl lg:text-[44px]">A direct path from harvest to purchase.</h2>
        <div className="relative mt-12">
          <div className="pointer-events-none absolute left-[12%] right-[12%] top-8 hidden h-px bg-gradient-to-r from-leaf via-ai-blue to-leaf lg:block" />
          <div className="relative space-y-6 border-l border-white/15 pl-6 lg:grid lg:grid-cols-4 lg:space-y-0 lg:border-0 lg:pl-0 lg:gap-6">
            {steps.map((s) => (
              <div key={s.n} className="relative">
                <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-leaf lg:hidden" />
                <div className="border border-white/10 bg-panel p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <s.icon className="h-5 w-5 text-leaf" />
                    <span className="text-2xl font-extrabold text-ai-blue">{s.n}</span>
                  </div>
                  <h3 className="text-[18px] font-bold">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#94A3B8]">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Brain, title: "AI Recommendations", text: "Ranked suppliers and buyers with explainable match scores.", tone: "blue" },
    { icon: TrendingUp, title: "Demand Forecasting", text: "Week-ahead demand signals by crop and district.", tone: "green" },
    { icon: BarChart3, title: "Smart Price Intelligence", text: "Transparent price bands so farmers never sell blind.", tone: "green" },
    { icon: ShoppingCart, title: "Direct Marketplace", text: "Buyers source from verified farms and FPOs without mandi hops.", tone: "blue" },
    { icon: Users, title: "FPO Aggregation", text: "Pool small lots into buyer-ready bulk consignments.", tone: "green" },
    { icon: Truck, title: "Smart Logistics", text: "Multi-stop routes that cut fuel, time and spoilage.", tone: "blue" },
    { icon: Package, title: "Order Tracking", text: "Harvest-ready to delivered, visible to both sides.", tone: "green" },
    { icon: CheckCircle2, title: "Transparent Transactions", text: "Quantities, grades and prices stay on the record.", tone: "blue" },
  ];
  return (
    <section id="features" className="bg-[#071910] py-20">
      <div className="page-wrap">
        <SectionReveal>
          <h2 className="text-[32px] font-extrabold tracking-tight sm:text-4xl lg:text-[44px]">Core features built for real supply chains</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((f) => (
              <article
                key={f.title}
                className="group border border-white/10 bg-panel p-6 transition duration-300 hover:-translate-y-1 hover:border-leaf"
              >
                <div className={`grid h-11 w-11 place-items-center rounded-xl transition ${f.tone === "blue" ? "bg-ai-blue/15 text-ai-blue group-hover:bg-ai-blue group-hover:text-white" : "bg-[#14532D] text-leaf group-hover:bg-leaf group-hover:text-deep"}`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 flex items-center justify-between text-[18px] font-bold">
                  {f.title}
                  <ArrowRight className="h-4 w-4 text-[#94A3B8] transition group-hover:text-leaf" />
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#94A3B8]">{f.text}</p>
              </article>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

function AISection() {
  return (
    <section id="ai" className="page-wrap py-20">
      <SectionReveal>
        <Badge tone="blue" className="bg-ai-blue/15 text-[#93C5FD]">AI Intelligence</Badge>
        <h2 className="mt-4 max-w-3xl text-[32px] font-extrabold tracking-tight sm:text-4xl lg:text-[44px]">
          Intelligence Behind Every Agricultural Decision
        </h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-5">
          <div className="border border-white/10 bg-panel p-6 lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[13px] uppercase tracking-[0.16em] text-leaf">Demand Forecast</p>
                <h3 className="mt-1 text-[20px] font-bold">Tomato · Jaipur</h3>
              </div>
              <Sprout className="h-5 w-5 text-leaf" />
            </div>
            <DemandForecastChart weeks={LANDING_WEEKS} series={DEMAND_SERIES.Tomato.slice(0, 7)} dark />
          </div>
          <div className="grid gap-4 lg:col-span-2">
            <div className="border border-white/10 bg-panel p-6">
              <p className="text-[13px] uppercase tracking-[0.16em] text-leaf">Price Prediction</p>
              <p className="mt-2 text-[28px] font-extrabold">₹28 → ₹31/kg</p>
              <p className="text-[15px] text-[#94A3B8]">Expected next 7 days</p>
            </div>
            <div className="border border-white/10 bg-panel p-6">
              <p className="text-[13px] uppercase tracking-[0.16em] text-ai-blue">AI Match</p>
              <p className="mt-2 text-[28px] font-extrabold text-ai-blue">94%</p>
              <p className="text-[15px] text-[#94A3B8]">Best supplier match · Ramesh Singh, 12 km</p>
            </div>
            <div className="border border-white/10 bg-panel p-6">
              <p className="text-[13px] uppercase tracking-[0.16em] text-ai-blue">Route Optimization</p>
              <p className="mt-2 flex items-center gap-2 text-[28px] font-extrabold">18%</p>
              <p className="flex items-center gap-1 text-[15px] text-[#94A3B8]"><MapPin className="h-4 w-4" /> Distance saved · Jaipur to Delhi</p>
            </div>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}

function Benefits() {
  const farmer = ["Better market access", "Reduced dependency on intermediaries", "Transparent pricing", "Demand visibility", "Direct buyers"];
  const buyer = ["Verified suppliers", "Compare prices", "Bulk procurement", "AI recommendations", "Delivery tracking"];
  return (
    <section className="bg-[#071910] py-20">
      <div className="page-wrap grid gap-6 lg:grid-cols-2">
        <SectionReveal>
          <div className="relative overflow-hidden border border-white/10 bg-panel p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-leaf/10" />
            <h3 className="text-[28px] font-extrabold">Farmer Benefits</h3>
            <ul className="mt-6 space-y-4">
              {farmer.map((b) => (
                <li key={b} className="flex items-center gap-3 text-[16px] text-[#F8FAFC]">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-leaf" /> {b}
                </li>
              ))}
            </ul>
          </div>
        </SectionReveal>
        <SectionReveal>
          <div className="relative overflow-hidden border border-white/10 bg-panel p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-ai-blue/10" />
            <h3 className="text-[28px] font-extrabold">Buyer Benefits</h3>
            <ul className="mt-6 space-y-4">
              {buyer.map((b) => (
                <li key={b} className="flex items-center gap-3 text-[16px] text-[#F8FAFC]">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-ai-blue" /> {b}
                </li>
              ))}
            </ul>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="page-wrap py-20">
      <SectionReveal>
        <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-leaf">About KRISHIQ</p>
        <h2 className="mt-3 max-w-3xl text-[32px] font-extrabold tracking-tight sm:text-4xl lg:text-[44px]">
          Technology that brings farmers closer to opportunity.
        </h2>
        <p className="mt-6 max-w-3xl text-[16px] leading-relaxed text-[#94A3B8] sm:text-[17px]">
          KRISHIQ is an AI-powered agricultural marketplace and smart supply-chain platform designed to connect farmers and FPOs directly with buyers. It combines AI matching, demand forecasting, price intelligence and smart logistics so produce moves from farm gate to business with more clarity and less waste.
        </p>
      </SectionReveal>
    </section>
  );
}

function CTA() {
  const navigate = useNavigate();
  return (
    <section className="page-wrap pb-24">
      <SectionReveal>
        <div className="border border-white/10 bg-[#14532D] px-6 py-14 text-center sm:px-12">
          <h2 className="text-[32px] font-extrabold tracking-tight text-white sm:text-4xl lg:text-[44px]">
            Build a Smarter Agricultural Supply Chain
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[16px] text-[#DCFCE7] sm:text-[17px]">
            Join farmers, FPOs and buyers already moving toward a more connected and intelligent agricultural marketplace.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="white" onClick={() => navigate("/register")}>
              Get Started
            </Button>
            <Button size="lg" variant="onDark" onClick={() => navigate("/login")}>
              Explore Marketplace
            </Button>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
