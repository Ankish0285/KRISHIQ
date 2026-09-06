import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import BrandLogo from "./BrandLogo.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { Button } from "./ui.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useTheme } from "../../context/ThemeContext.jsx";
import { clsx } from "./cn.js";

const links = [
  { href: "/", label: "Home" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#features", label: "Features" },
  { href: "/#ai", label: "AI Intelligence" },
  { href: "/#about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, homeFor } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const loginVariant = isDark ? "onDark" : "secondary";

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-[100] h-[76px] border-b transition-colors duration-300",
        scrolled
          ? "border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#06150F]/92 dark:shadow-none"
          : "border-transparent bg-white/70 backdrop-blur-md dark:border-transparent dark:bg-[#06150F]/55"
      )}
    >
      <div className="page-wrap flex h-full items-center justify-between gap-4">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <BrandLogo className="h-11 w-11 shrink-0" />
          <div className="min-w-0">
            <p className="text-[17px] font-extrabold leading-none tracking-tight text-ink dark:text-[#F8FAFC]">
              KRISH<span className="text-ai-blue">IQ</span>
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-[#94A3B8]">AgriTech</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[15px] font-medium text-slate-600 transition hover:text-primary-green dark:text-[#94A3B8] dark:hover:text-leaf"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle showLabel />
          {currentUser ? (
            <Button onClick={() => navigate(homeFor(currentUser.role))}>Go to dashboard</Button>
          ) : (
            <>
              <NavLink to="/login">
                <Button variant={loginVariant}>Login</Button>
              </NavLink>
              <NavLink to="/register">
                <Button>Get Started</Button>
              </NavLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-ink dark:border-white/15 dark:text-[#F8FAFC]"
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[110] lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[min(100%,320px)] flex-col bg-white p-5 shadow-2xl dark:bg-panel">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-bold text-ink dark:text-[#F8FAFC]">Menu</span>
              <button type="button" aria-label="Close menu" className="text-ink dark:text-[#F8FAFC]" onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>
            <div className="grid gap-4 text-[16px] text-ink dark:text-[#F8FAFC]">
              {links.map((l) => (
                <a key={l.label} href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              ))}
              <NavLink to="/login" onClick={() => setOpen(false)}>
                <Button variant={loginVariant} className="w-full">Login</Button>
              </NavLink>
              <NavLink to="/register" onClick={() => setOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
