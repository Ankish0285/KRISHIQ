import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import BrandLogo from "./BrandLogo.jsx";

const cols = [
  {
    title: "Platform",
    links: [
      { to: "/login", label: "Marketplace" },
      { to: "/login", label: "AI Recommendations" },
      { to: "/login", label: "Demand Forecast" },
      { to: "/login", label: "Smart Logistics" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/#about", label: "About", hash: true },
      { to: "/#how-it-works", label: "How It Works", hash: true },
      { to: "/#features", label: "Features", hash: true },
      { to: "mailto:hello@krishiq.in", label: "Contact", external: true },
    ],
  },
  {
    title: "For Farmers",
    links: [
      { to: "/login", label: "Add Produce" },
      { to: "/login", label: "My Produce" },
      { to: "/login", label: "Orders" },
      { to: "/login", label: "Earnings" },
    ],
  },
  {
    title: "For Buyers",
    links: [
      { to: "/login", label: "Marketplace" },
      { to: "/login", label: "Recommendations" },
      { to: "/login", label: "Orders" },
      { to: "/login", label: "Track Order" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-night text-[#F8FAFC]">
      <div className="page-wrap grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <BrandLogo className="h-14 w-14" />
            <div>
              <p className="text-xl font-extrabold">KRISH<span className="text-ai-blue">IQ</span></p>
              <p className="mt-1 text-[14px] text-[#94A3B8]">Smart Farming. Direct Markets. Better Future.</p>
            </div>
          </div>
          <div className="mt-5 flex gap-3 text-[#94A3B8]">
            <a href="https://twitter.com" aria-label="Twitter" className="hover:text-leaf"><Twitter className="h-4 w-4" /></a>
            <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-leaf"><Linkedin className="h-4 w-4" /></a>
            <a href="https://instagram.com" aria-label="Instagram" className="hover:text-leaf"><Instagram className="h-4 w-4" /></a>
            <a href="https://facebook.com" aria-label="Facebook" className="hover:text-leaf"><Facebook className="h-4 w-4" /></a>
          </div>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <p className="text-[15px] font-semibold">{col.title}</p>
            <div className="mt-3 grid gap-2 text-[14px] text-[#94A3B8]">
              {col.links.map((l) =>
                l.external ? (
                  <a key={l.label} href={l.to}>{l.label}</a>
                ) : l.hash ? (
                  <a key={l.label} href={l.to}>{l.label}</a>
                ) : (
                  <Link key={l.label} to={l.to}>{l.label}</Link>
                )
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-4 text-center text-[13px] text-[#94A3B8]">
        © {new Date().getFullYear()} KRISHIQ. Built for SIH 2026. All rights reserved.
      </div>
    </footer>
  );
}
