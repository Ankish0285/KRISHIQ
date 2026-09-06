import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { clsx } from "./cn.js";

export default function ThemeToggle({ className = "", showLabel = false }) {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to day mode" : "Switch to night mode"}
      className={clsx(
        "inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-semibold transition",
        "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
        "dark:border-white/15 dark:bg-white/5 dark:text-[#F8FAFC] dark:hover:bg-white/10",
        className
      )}
    >
      {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-primary-green" />}
      {showLabel && <span>{isDark ? "Day" : "Night"}</span>}
    </button>
  );
}
