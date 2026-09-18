import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import BrandLogo from "./BrandLogo.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { Avatar, Button } from "./ui.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useTheme } from "../../context/ThemeContext.jsx";
import { clsx } from "./cn.js";
import AuthModal from "./AuthModal.jsx";

const links = [
  { href: "/", label: "Home" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/krishiq-ai", label: "Krishiq AI" },
  { href: "/for-farmers", label: "For Farmers" },
  { href: "/agritech", label: "Agritech" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
];

function navLabel(link, settings) {
  if (link.label === "Marketplace") return settings.navMarketplaceLabel || link.label;
  if (link.label === "How It Works") return settings.navHowLabel || link.label;
  if (link.label === "For Farmers") return settings.navFarmerLabel || link.label;
  if (link.label === "Agritech") return settings.navAgritechLabel || link.label;
  if (link.label === "About") return settings.navAboutLabel || link.label;
  return link.label;
}

function isNavActive(href, location) {
  if (href.includes("#")) {
    return location.pathname === "/" && location.hash === `#${href.split("#")[1]}`;
  }
  if (href === "/") return location.pathname === "/" && !location.hash;
  return location.pathname === href;
}

function NavItem({ link, settings, className, onClick }) {
  const location = useLocation();
  const active = isNavActive(link.href, location);
  const classes = className || clsx(
    "relative py-2 text-[15px] font-medium text-slate-600 transition hover:text-primary-green dark:text-[#94A3B8] dark:hover:text-leaf",
    active && "text-primary-green dark:text-leaf after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:bg-leaf after:content-['']"
  );
  const label = navLabel(link, settings);
  if (link.href.includes("#")) {
    return <a href={link.href} onClick={onClick} className={classes} aria-current={active ? "page" : undefined}>{label}</a>;
  }
  return <Link to={link.href} onClick={onClick} className={classes} aria-current={active ? "page" : undefined}>{label}</Link>;
}

export default function Navbar({ settings = {} }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authTab, setAuthTab] = useState(null);
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
          <BrandLogo src={settings.logoUrl || undefined} className="h-11 w-11 shrink-0" />
          <div className="min-w-0">
            <p className="text-[17px] font-extrabold leading-none tracking-tight text-ink dark:text-[#F8FAFC]">{settings.brandName || "Krishiq"}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-[#94A3B8]">{settings.brandLine || "Agritech"}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {links.map((l) => (
            <NavItem key={l.label} link={l} settings={settings} />
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle showLabel />
          {currentUser ? (
            <button
              type="button"
              onClick={() => navigate(homeFor(currentUser.role))}
              className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 py-1 pl-1 pr-3 shadow-sm transition hover:border-primary-green/40 hover:shadow-md dark:border-white/10 dark:bg-white/5"
              title="Go to dashboard"
            >
              <Avatar user={currentUser} size="sm" />
              <span className="text-sm font-semibold text-slate-700 group-hover:text-primary-green dark:text-slate-200 dark:group-hover:text-leaf">
                {currentUser.name?.split(" ")[0] || currentUser.email?.split("@")[0] || "Dashboard"}
              </span>
            </button>
          ) : (
            <>
              <Button variant={loginVariant} onClick={() => setAuthTab("login")}>Login</Button>
              <Button onClick={() => setAuthTab("signup")}>Sign Up</Button>
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
                <NavItem key={l.label} link={l} settings={settings} className="text-[16px] text-ink dark:text-[#F8FAFC]" onClick={() => setOpen(false)} />
              ))}
              <Button variant={loginVariant} className="w-full" onClick={() => { setOpen(false); setAuthTab("login"); }}>Login</Button>
              <Button className="w-full" onClick={() => { setOpen(false); setAuthTab("signup"); }}>Sign Up</Button>
            </div>
          </div>
        </div>
      )}
      <AuthModal open={Boolean(authTab)} initialTab={authTab || "login"} onClose={() => setAuthTab(null)} />
    </header>
  );
}
