import { BarChart3, Boxes, IndianRupee, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ADMIN_CHARTS, ADMIN_FARMERS, ADMIN_BUYERS, PRODUCTS, ORDERS } from "../../utils/mockData.js";
import { Card, PageHeader, StatCard } from "../../components/common/ui.jsx";
import { formatINR } from "../../utils/formatPrice.js";

export default function AdminDashboard() {
  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Platform health across farmers, buyers, GMV and growth." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={Users} label="Total Farmers" value="10,240" />
        <StatCard icon={Users} label="Total Buyers" value="512" tone="blue" />
        <StatCard icon={Boxes} label="Total Products" value={PRODUCTS.length + 118} />
        <StatCard icon={ShoppingBag} label="Orders" value="1,362" />
        <StatCard icon={IndianRupee} label="GMV" value={formatINR(41200000)} />
        <StatCard icon={TrendingUp} label="Platform Growth" value="+18%" tone="blue" />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-bold">Orders over time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADMIN_CHARTS.orders}>
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
              <LineChart data={ADMIN_CHARTS.revenue}>
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
              <BarChart data={ADMIN_CHARTS.crops}>
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
              <LineChart data={ADMIN_CHARTS.users}>
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
      <p className="mt-4 flex items-center gap-2 text-xs text-slate-400"><BarChart3 className="h-3 w-3" /> Live admin demo · {ADMIN_FARMERS.length} sample farmers · {ADMIN_BUYERS.length} sample buyers · {ORDERS.length} sample orders</p>
    </div>
  );
}
