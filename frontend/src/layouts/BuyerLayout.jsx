import { LayoutDashboard, Store, Brain, ShoppingBag, Truck, User } from "lucide-react";
import DashboardShell from "./DashboardShell.jsx";

const items = [
  { to: "/buyer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/buyer/marketplace", label: "Marketplace", icon: Store },
  { to: "/buyer/recommendations", label: "AI Recommendations", icon: Brain },
  { to: "/buyer/orders", label: "Orders", icon: ShoppingBag },
  { to: "/buyer/track-order", label: "Track Order", icon: Truck },
  { to: "/buyer/profile", label: "Profile", icon: User },
];

export default function BuyerLayout() {
  return <DashboardShell items={items} />;
}
