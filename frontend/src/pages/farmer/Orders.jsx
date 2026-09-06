import { orderApi } from "../../api/orderApi.js";
import useFetch from "../../hooks/useFetch.js";
import DataTable from "../../components/common/DataTable.jsx";
import DeliveryTracker from "../../components/logistics/DeliveryTracker.jsx";
import { Card, Loader, PageHeader, StatusBadge } from "../../components/common/ui.jsx";
import { formatINR } from "../../utils/formatPrice.js";
import { useState } from "react";

export default function FarmerOrders() {
  const { data, loading } = useFetch(() => orderApi.list("farmer"), []);
  const [active, setActive] = useState(null);
  if (loading) return <Loader />;
  const selected = active || data?.[0];
  return (
    <div>
      <PageHeader title="Orders" subtitle="Track harvest-to-delivery progress for every confirmed lot." />
      <DataTable
        rows={data || []}
        columns={[
          { key: "id", label: "Order", render: (r) => (
            <button type="button" className="font-semibold text-primary-green" onClick={() => setActive(r)}>{r.id}</button>
          ) },
          { key: "crop", label: "Crop" },
          { key: "buyer", label: "Buyer" },
          { key: "qty", label: "Qty", render: (r) => `${r.qty} kg` },
          { key: "value", label: "Value", render: (r) => formatINR(r.value) },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
      {selected && (
        <Card className="mt-6">
          <h3 className="mb-3 font-bold">Timeline · {selected.id}</h3>
          <DeliveryTracker status={selected.status} />
        </Card>
      )}
    </div>
  );
}
