import { Boxes, IndianRupee, ShoppingBag, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fpoApi } from "../../api/fpoApi.js";
import useFetch from "../../hooks/useFetch.js";
import InventoryCard from "../../components/fpo/InventoryCard.jsx";
import { Card, Loader, PageHeader, StatCard } from "../../components/common/ui.jsx";
import { formatINR } from "../../utils/formatPrice.js";

export default function FpoDashboard() {
  const { data, loading } = useFetch(() => fpoApi.dashboard(), []);
  if (loading || !data) return <Loader />;
  return (
    <div>
      <PageHeader title="FPO Dashboard" subtitle="Aggregated member inventory, orders and revenue." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Registered Farmers" value={data.stats.farmers} />
        <StatCard icon={Boxes} label="Total Inventory" value={`${data.stats.inventory.toLocaleString("en-IN")} kg`} />
        <StatCard icon={ShoppingBag} label="Active Orders" value={data.stats.orders} />
        <StatCard icon={IndianRupee} label="Revenue" value={formatINR(data.stats.revenue)} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-bold">Inventory analytics</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.inventory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="crop" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <div className="space-y-3">
          {data.inventory.map((item) => (
            <InventoryCard key={item.crop} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
