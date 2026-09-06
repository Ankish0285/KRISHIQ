import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { orderApi } from "../../api/orderApi.js";
import useFetch from "../../hooks/useFetch.js";
import DataTable from "../../components/common/DataTable.jsx";
import { Button, Loader, PageHeader, StatusBadge } from "../../components/common/ui.jsx";
import { formatINR } from "../../utils/formatPrice.js";

const tabs = [
  { id: "active", label: "Active", match: (s) => !["Delivered", "Cancelled"].includes(s) },
  { id: "completed", label: "Completed", match: (s) => s === "Delivered" },
  { id: "cancelled", label: "Cancelled", match: (s) => s === "Cancelled" },
];

export default function BuyerOrders() {
  const { data, loading } = useFetch(() => orderApi.list("buyer"), []);
  const [tab, setTab] = useState("active");
  const rows = useMemo(() => (data || []).filter((o) => tabs.find((t) => t.id === tab)?.match(o.status)), [data, tab]);
  if (loading) return <Loader />;
  return (
    <div>
      <PageHeader title="Orders" subtitle="Active, completed and cancelled procurement." />
      <div className="mb-4 flex gap-2">
        {tabs.map((t) => (
          <Button key={t.id} variant={tab === t.id ? "primary" : "secondary"} size="sm" onClick={() => setTab(t.id)}>
            {t.label}
          </Button>
        ))}
      </div>
      <DataTable
        rows={rows}
        columns={[
          { key: "id", label: "Order" },
          { key: "crop", label: "Crop" },
          { key: "farmer", label: "Supplier" },
          { key: "qty", label: "Qty", render: (r) => `${r.qty} kg` },
          { key: "value", label: "Value", render: (r) => formatINR(r.value) },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          { key: "track", label: "", render: (r) => (
            <Link to={`/buyer/track-order/${r.id}`} className="text-sm font-semibold text-ai-blue">Track</Link>
          ) },
        ]}
      />
    </div>
  );
}
