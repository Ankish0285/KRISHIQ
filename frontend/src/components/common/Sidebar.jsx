import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import BrandLogo from "./BrandLogo.jsx";
import { Avatar } from "./ui.jsx";
import { clsx } from "./cn.js";

export default function Sidebar({ items, user, onLogout, onNavigate }) {
  return (
    <aside className="flex h-full flex-col border-r border-slate-200 bg-white dark:border-emerald-900/40 dark:bg-[#0c1c14]">
      <div className="flex items-center gap-3 px-5 py-5">
        <BrandLogo className="h-11 w-11" />
        <div>
          <p className="font-extrabold leading-none">KRISH<span className="text-ai-blue">IQ</span></p>
          <p className="text-[11px] uppercase tracking-wider text-slate-500">{user?.role}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                isActive
                  ? "bg-light-green text-deep dark:bg-emerald-900/50 dark:text-leaf"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60"
              )
            }
          >
            {item.icon && <item.icon className="h-4 w-4" />}
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-100 p-4 dark:border-slate-800">
        <div className="mb-3 flex items-center gap-3">
          <Avatar name={user?.name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user?.name}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-sm font-medium text-slate-600 dark:border-slate-700"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
