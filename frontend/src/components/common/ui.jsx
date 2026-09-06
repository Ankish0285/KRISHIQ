import { forwardRef } from "react";
import { clsx } from "./cn.js";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}) {
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };
  const variants = {
    primary:
      "bg-primary-green text-white hover:bg-[#14532D] shadow-soft",
    secondary:
      "border border-emerald-200 bg-white text-primary-green hover:bg-light-green dark:border-emerald-800 dark:bg-transparent dark:text-leaf",
    onDark:
      "border border-white/25 bg-transparent text-white hover:bg-white/10",
    white:
      "bg-white text-[#14532D] hover:bg-light-green",
    blue: "bg-ai-blue text-white hover:bg-blue-700",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
  };
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export const Card = forwardRef(function Card({ children, className = "", as: Tag = "div", ...props }, ref) {
  return (
    <Tag
      ref={ref}
      className={clsx(
        "rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-emerald-900/40 dark:bg-slate-900/70",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
});

export function Badge({ children, tone = "green", className = "" }) {
  const tones = {
    green: "bg-light-green text-deep dark:bg-emerald-900/50 dark:text-leaf",
    blue: "bg-light-blue text-ai-blue dark:bg-blue-900/40 dark:text-blue-300",
    amber: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
    slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
  };
  return (
    <span className={clsx("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone], className)}>
      {children}
    </span>
  );
}

export function Input({ label, id, error, className = "", ...props }) {
  return (
    <label className="block space-y-1.5" htmlFor={id}>
      {label && <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>}
      <input
        id={id}
        className={clsx(
          "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none ring-primary-green/20 transition focus:ring-4 dark:border-slate-700 dark:bg-slate-900",
          error && "border-rose-400",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </label>
  );
}

export function Select({ label, id, error, children, className = "", ...props }) {
  return (
    <label className="block space-y-1.5" htmlFor={id}>
      {label && <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>}
      <select
        id={id}
        className={clsx(
          "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none ring-primary-green/20 transition focus:ring-4 dark:border-slate-700 dark:bg-slate-900",
          error && "border-rose-400",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </label>
  );
}

export function SearchBar({ value, onChange, placeholder = "Search...", className = "" }) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className={clsx(
        "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none ring-primary-green/20 focus:bg-white focus:ring-4 dark:border-slate-700 dark:bg-slate-900",
        className
      )}
    />
  );
}

export function Avatar({ name = "User", src, size = "md" }) {
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-12 w-12 text-base" };
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  if (src) {
    return <img src={src} alt={name} className={clsx(sizes[size], "rounded-full object-cover")} />;
  }
  return (
    <div className={clsx(sizes[size], "grid place-items-center rounded-full bg-light-green font-bold text-deep")}>
      {initials}
    </div>
  );
}

export function Loader({ label = "Loading KRISHIQ..." }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-slate-500">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-light-green border-t-primary-green" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({ title = "Nothing here yet", text, action, className = "" }) {
  return (
    <div className={clsx("rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700", className)}>
      <h3 className="text-lg font-semibold">{title}</h3>
      {text && <p className="mt-1 text-sm text-slate-500">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ title = "Unable to load", text, onRetry }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-900 dark:bg-rose-950/40">
      <h3 className="text-lg font-semibold text-rose-700">{title}</h3>
      {text && <p className="mt-1 text-sm text-rose-600">{text}</p>}
      {onRetry && (
        <Button className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, hint, tone = "green" }) {
  return (
    <Card className="flex items-start gap-4">
      <div
        className={clsx(
          "grid h-12 w-12 place-items-center rounded-2xl",
          tone === "blue" ? "bg-light-blue text-ai-blue" : "bg-light-green text-primary-green"
        )}
      >
        {Icon && <Icon className="h-5 w-5" />}
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-extrabold tracking-tight">{value}</p>
        {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      </div>
    </Card>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    Listed: "green",
    Active: "green",
    Verified: "green",
    Delivered: "green",
    Confirmed: "blue",
    "In Transit": "blue",
    "Order Placed": "slate",
    "Harvest Ready": "amber",
    "Pickup Scheduled": "amber",
    Pending: "amber",
    Onboarded: "blue",
    Open: "blue",
    Negotiating: "amber",
    Matched: "green",
    Cancelled: "rose",
    Delayed: "rose",
    Inactive: "slate",
    Suspended: "rose",
    Review: "amber",
    Loading: "amber",
  };
  return <Badge tone={map[status] || "slate"}>{status}</Badge>;
}
