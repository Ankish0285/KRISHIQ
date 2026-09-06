import { LayoutDashboard, Users, Building2, Boxes, ShoppingBag, Truck, BarChart3 } from "lucide-react";
import DashboardShell from "./DashboardShell.jsx";

const items = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/farmers", label: "Farmers", icon: Users },
  { to: "/admin/buyers", label: "Buyers", icon: Building2 },
  { to: "/admin/products", label: "Products", icon: Boxes },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/logistics", label: "Logistics", icon: Truck },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminLayout() {
  return <DashboardShell items={items} />;
}
