import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ADMIN_CHARTS } from "../../utils/mockData.js";
import { Card, PageHeader, StatCard } from "../../components/common/ui.jsx";
import { Clock, IndianRupee, ShoppingBag, TrendingUp } from "lucide-react";

export default function AdminAnalytics() {
  return (
    <div>
      <PageHeader title="Analytics" subtitle="Growth, demand, pricing and delivery efficiency." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={TrendingUp} label="Farmer growth" value="+12%" />
        <StatCard icon={TrendingUp} label="Buyer growth" value="+18%" tone="blue" />
        <StatCard icon={IndianRupee} label="Average price" value="₹31/kg" />
        <StatCard icon={Clock} label="Delivery efficiency" value="92%" />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-bold">Farmer & buyer growth</h3>
          <div className="h-64">
            <ResponsiveContainer>
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
        <Card>
          <h3 className="mb-3 font-bold">Crop demand</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={ADMIN_CHARTS.crops}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="crop" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="demand" fill="#22C55E" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="mb-3 font-bold">Orders</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={ADMIN_CHARTS.orders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area dataKey="orders" stroke="#166534" fill="#DBEAFE" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="mb-3 font-bold">Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={ADMIN_CHARTS.revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area dataKey="gmv" stroke="#2563EB" fill="#DCFCE7" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <StatCard icon={ShoppingBag} label="Orders this quarter" value="712" />
        <StatCard icon={IndianRupee} label="Revenue this quarter" value="₹10.6 Cr" tone="blue" />
      </div>
    </div>
  );
}
