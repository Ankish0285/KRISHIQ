import { Boxes, IndianRupee, ShoppingBag, Sparkles } from "lucide-react";
import { farmerApi } from "../../api/farmerApi.js";
import { orderApi } from "../../api/orderApi.js";
import useFetch from "../../hooks/useFetch.js";
import { useAuth } from "../../hooks/useAuth.js";
import { Loader, PageHeader, StatCard, StatusBadge } from "../../components/common/ui.jsx";
import DemandAlert from "../../components/farmer/DemandAlert.jsx";
import CropCard from "../../components/farmer/CropCard.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import { formatINR } from "../../utils/formatPrice.js";

export default function FarmerDashboard() {
  const { currentUser } = useAuth();
  const { data, loading } = useFetch(() => farmerApi.dashboard(), []);
  const orders = useFetch(() => orderApi.list("farmer"), []);
  if (loading || !data) return <Loader />;
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      <PageHeader title={`${greet}, ${currentUser?.name?.split(" ")[0] || "Farmer"}`} subtitle="Your farm-gate performance and AI demand signals." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Boxes} label="Total Produce" value={`${data.stats.totalProduce} kg`} />
        <StatCard icon={ShoppingBag} label="Active Orders" value={data.stats.activeOrders} />
        <StatCard icon={IndianRupee} label="Total Earnings" value={formatINR(data.stats.earnings)} />
        <StatCard icon={Sparkles} label="AI Demand Score" value={data.stats.aiDemandScore} tone="blue" />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 font-bold">Recent Orders</h2>
          <DataTable
            rows={(orders.data || []).slice(0, 5)}
            columns={[
              { key: "id", label: "Order" },
              { key: "crop", label: "Crop" },
              { key: "buyer", label: "Buyer" },
              { key: "qty", label: "Qty", render: (r) => `${r.qty} kg` },
              { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
            ]}
          />
        </div>
        <DemandAlert insight={data.insight} />
      </div>
      <h2 className="mb-3 mt-8 font-bold">My Produce</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.produce.map((p) => (
          <CropCard key={p.id} item={p} />
        ))}
      </div>
    </div>
  );
}
