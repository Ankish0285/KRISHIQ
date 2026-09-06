import { orderApi } from "../../api/orderApi.js";
import useFetch from "../../hooks/useFetch.js";
import DataTable from "../../components/common/DataTable.jsx";
import { Button, Loader, PageHeader, StatusBadge } from "../../components/common/ui.jsx";
import { ORDER_STEPS } from "../../utils/mockData.js";
import { formatINR } from "../../utils/formatPrice.js";
import { useToast } from "../../context/ToastContext.jsx";

export default function AdminOrders() {
  const { data, loading, reload } = useFetch(() => orderApi.list(), []);
  const { toast } = useToast();

  const advance = async (row) => {
    const i = ORDER_STEPS.indexOf(row.status);
    const next = ORDER_STEPS[Math.min(ORDER_STEPS.length - 1, i + 1)] || row.status;
    await orderApi.updateStatus(row.id, next);
    toast(`${row.id} moved to ${next}.`);
    reload();
  };

  if (loading) return <Loader />;
  return (
    <div>
      <PageHeader title="Orders" subtitle="Advance consignments through the KRISHIQ fulfilment timeline." />
      <DataTable
        rows={data || []}
        columns={[
          { key: "id", label: "Order" },
          { key: "crop", label: "Crop" },
          { key: "farmer", label: "Farmer" },
          { key: "buyer", label: "Buyer" },
          { key: "value", label: "Value", render: (r) => formatINR(r.value) },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          { key: "actions", label: "Actions", render: (r) => (
            <Button size="sm" variant="secondary" onClick={() => advance(r)}>Advance</Button>
          ) },
        ]}
      />
    </div>
  );
}
