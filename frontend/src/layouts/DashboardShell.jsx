import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Bell, Menu, Search, X } from "lucide-react";
import Sidebar from "../components/common/Sidebar.jsx";
import ThemeToggle from "../components/common/ThemeToggle.jsx";
import { Avatar } from "../components/common/ui.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { NOTIFICATIONS } from "../utils/mockData.js";
import { clsx } from "../components/common/cn.js";

export default function DashboardShell({ items }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState(false);
  const [notes, setNotes] = useState(false);
  const [query, setQuery] = useState("");

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-canvas dark:bg-[#07140d]">
      <div className="hidden h-screen md:grid md:grid-cols-[260px_1fr]">
        <Sidebar items={items} user={currentUser} onLogout={onLogout} />
        <div className="flex min-w-0 flex-col">
          <Topbar
            user={currentUser}
            query={query}
            setQuery={setQuery}
            notes={notes}
            setNotes={setNotes}
            onMenu={() => setDrawer(true)}
            showMenu={false}
          />
          <main className="min-w-0 flex-1 overflow-y-auto p-4 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>

      <div className="md:hidden">
        <Topbar
          user={currentUser}
          query={query}
          setQuery={setQuery}
          notes={notes}
          setNotes={setNotes}
          onMenu={() => setDrawer(true)}
          showMenu
        />
        <main className="min-h-[calc(100vh-128px)] p-4 pb-24">
          <Outlet />
        </main>
        <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-slate-200 bg-white py-2 dark:border-slate-800 dark:bg-[#0c1c14]">
          {items.slice(0, 4).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx("flex flex-col items-center gap-1 text-[11px]", isActive ? "text-primary-green" : "text-slate-500")
              }
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button className="absolute inset-0 bg-black/40" aria-label="Close menu" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-white dark:bg-[#0c1c14]">
            <div className="flex justify-end p-3">
              <button type="button" aria-label="Close" onClick={() => setDrawer(false)}>
                <X />
              </button>
            </div>
            <div className="h-[calc(100%-48px)]">
              <Sidebar items={items} user={currentUser} onLogout={onLogout} onNavigate={() => setDrawer(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Topbar({ user, query, setQuery, notes, setNotes, onMenu, showMenu }) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-emerald-900/40 dark:bg-[#0c1c14]/90">
      {showMenu && (
        <button type="button" onClick={onMenu} aria-label="Open navigation">
          <Menu />
        </button>
      )}
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search produce, orders, buyers..."
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm dark:border-slate-700 dark:bg-slate-900"
        />
      </div>
      <ThemeToggle />
      <button type="button" className="relative" aria-label="Notifications" onClick={() => setNotes((v) => !v)}>
        <Bell className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-ai-blue" />
      </button>
      <Avatar name={user?.name} size="sm" />
      {notes && (
        <div className="absolute right-4 top-16 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-card dark:border-slate-700 dark:bg-slate-900">
          {NOTIFICATIONS.map((n) => (
            <div key={n.id} className="border-b border-slate-100 py-2 last:border-0 dark:border-slate-800">
              <p className="text-sm font-semibold">{n.title}</p>
              <p className="text-xs text-slate-500">{n.text}</p>
              <p className="text-[11px] text-slate-400">{n.time}</p>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
