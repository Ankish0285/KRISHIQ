import { LayoutDashboard, Users, Boxes, Package, User } from "lucide-react";
import DashboardShell from "./DashboardShell.jsx";

const items = [
  { to: "/fpo/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/fpo/farmers", label: "Farmers", icon: Users },
  { to: "/fpo/inventory", label: "Inventory", icon: Boxes },
  { to: "/fpo/bulk-orders", label: "Bulk Orders", icon: Package },
  { to: "/fpo/profile", label: "Profile", icon: User },
];

export default function FPOLayout() {
  return <DashboardShell items={items} />;
}
