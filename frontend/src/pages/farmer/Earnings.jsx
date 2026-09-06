import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { farmerApi } from "../../api/farmerApi.js";
import useFetch from "../../hooks/useFetch.js";
import { Card, Loader, PageHeader, StatCard } from "../../components/common/ui.jsx";
import { IndianRupee, Clock, CheckCircle2, Wallet } from "lucide-react";
import { formatINR } from "../../utils/formatPrice.js";
import { EARNINGS_MONTHLY } from "../../utils/mockData.js";

export default function Earnings() {
  const { data, loading } = useFetch(() => farmerApi.earnings(), []);
  if (loading || !data) return <Loader />;
  return (
    <div>
      <PageHeader title="Earnings" subtitle="Farm-gate collections, pending payouts and completed lots." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Wallet} label="Total Earnings" value={formatINR(data.total)} />
        <StatCard icon={IndianRupee} label="This Month" value={formatINR(data.month)} />
        <StatCard icon={Clock} label="Pending Payments" value={formatINR(data.pending)} tone="blue" />
        <StatCard icon={CheckCircle2} label="Completed Orders" value={data.completed} />
      </div>
      <Card className="mt-6">
        <h3 className="mb-4 font-bold">Monthly earnings</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={EARNINGS_MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => formatINR(v)} />
              <Bar dataKey="earnings" fill="#166534" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
