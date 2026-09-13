import { Boxes, IndianRupee, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, PageHeader, StatCard } from "../../components/common/ui.jsx";
import { formatINR } from "../../utils/formatPrice.js";
import adminApi from "../../api/adminApi.js";

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    adminApi.overview().then(setOverview).catch((err) => setError(err.response?.data?.message || "Unable to load admin data."));
  }, []);
  const data = overview || { totalUsers: 0, activeUsers: 0, farmers: 0, buyers: 0, products: 0, orders: 0, revenue: 0, pendingProducts: 0, roleBreakdown: [], orderStatus: [], recentActivity: [] };
  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Live platform health from the KRISHIQ database." />
      {error && <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={Users} label="Total Users" value={data.totalUsers} />
        <StatCard icon={Users} label="Active Users" value={data.activeUsers} tone="blue" />
        <StatCard icon={Users} label="Farmers / Sellers" value={data.farmers} />
        <StatCard icon={Users} label="Buyers" value={data.buyers} tone="blue" />
        <StatCard icon={Boxes} label="Products" value={data.products} />
        <StatCard icon={ShoppingBag} label="Orders" value={data.orders} />
        <StatCard icon={IndianRupee} label="Paid Revenue" value={formatINR(data.revenue)} />
        <StatCard icon={TrendingUp} label="Pending Product Review" value={data.pendingProducts} tone="blue" />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-bold">Orders over time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.orderStatus.map((item) => ({ month: item._id, orders: item.count }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area dataKey="orders" stroke="#166534" fill="#DCFCE7" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="mb-3 font-bold">Revenue (₹ Cr)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[{ month: "Paid revenue", gmv: data.revenue / 10000000 }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line dataKey="gmv" stroke="#2563EB" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="mb-3 font-bold">Crop demand</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.roleBreakdown.map((item) => ({ crop: item._id, demand: item.count }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="crop" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="demand" fill="#22C55E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="mb-3 font-bold">User growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.roleBreakdown.map((item) => ({ month: item._id, farmers: item._id === "farmer" ? item.count : 0, buyers: item._id === "buyer" ? item.count : 0 }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line dataKey="farmers" stroke="#166534" />
                <Line dataKey="buyers" stroke="#2563EB" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <Card className="mt-6"><h3 className="font-bold">Recent admin activity</h3>{data.recentActivity.length ? data.recentActivity.map((entry) => <p key={entry._id} className="mt-2 text-sm text-slate-500">{entry.action} · {entry.actor?.name || "Admin"}</p>) : <p className="mt-2 text-sm text-slate-500">No admin activity recorded yet.</p>}</Card>
    </div>
  );
}
