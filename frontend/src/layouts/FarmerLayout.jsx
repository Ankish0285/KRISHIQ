import { LayoutDashboard, PackagePlus, ShoppingBag, Wallet, TrendingUp, User, Boxes } from "lucide-react";
import DashboardShell from "./DashboardShell.jsx";

const items = [
  { to: "/farmer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/farmer/my-produce", label: "My Produce", icon: Boxes },
  { to: "/farmer/add-produce", label: "Add Produce", icon: PackagePlus },
  { to: "/farmer/orders", label: "Orders", icon: ShoppingBag },
  { to: "/farmer/earnings", label: "Earnings", icon: Wallet },
  { to: "/farmer/demand-forecast", label: "Demand Forecast", icon: TrendingUp },
  { to: "/farmer/profile", label: "Profile", icon: User },
];

export default function FarmerLayout() {
  return <DashboardShell items={items} />;
}
