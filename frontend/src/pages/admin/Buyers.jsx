import { ADMIN_BUYERS } from "../../utils/mockData.js";
import DataTable from "../../components/common/DataTable.jsx";
import { PageHeader, StatusBadge } from "../../components/common/ui.jsx";

export default function AdminBuyers() {
  return (
    <div>
      <PageHeader title="Buyers" subtitle="Business accounts sourcing through KRISHIQ." />
      <DataTable
        rows={ADMIN_BUYERS}
        columns={[
          { key: "name", label: "Name" },
          { key: "business", label: "Business" },
          { key: "location", label: "Location" },
          { key: "orders", label: "Orders" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
    </div>
  );
}
