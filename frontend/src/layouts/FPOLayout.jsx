import { LayoutDashboard, Users, Boxes, Package } from "lucide-react";
import DashboardShell from "./DashboardShell.jsx";

const items = [
  { to: "/fpo/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/fpo/farmers", label: "Farmers", icon: Users },
  { to: "/fpo/inventory", label: "Inventory", icon: Boxes },
  { to: "/fpo/bulk-orders", label: "Bulk Orders", icon: Package },
];

export default function FPOLayout() {
  return <DashboardShell items={items} />;
}
