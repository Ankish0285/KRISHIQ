import { Activity, BarChart3, Bell, Boxes, Building2, FileText, LayoutDashboard, LifeBuoy, ListTree, NotebookTabs, PackageCheck, ScrollText, Settings, ShoppingBag, Store, User, UserCog, Users } from "lucide-react";
import DashboardShell from "./DashboardShell.jsx";

const items = [
  { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/content", label: "Website Control", icon: FileText },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/farmers", label: "Farmers / Sellers", icon: Store },
  { to: "/admin/buyers", label: "Buyers", icon: Building2 },
  { to: "/admin/products", label: "Products", icon: Boxes },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
  { to: "/admin/profile", label: "Profile", icon: User },
];

export default function AdminLayout() {
  return <DashboardShell items={items} />;
}
