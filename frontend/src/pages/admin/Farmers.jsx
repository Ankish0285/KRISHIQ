import { ADMIN_FARMERS } from "../../utils/mockData.js";
import DataTable from "../../components/common/DataTable.jsx";
import { Button, PageHeader, StatusBadge } from "../../components/common/ui.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export default function AdminFarmers() {
  const { toast } = useToast();
  return (
    <div>
      <PageHeader title="Farmers" subtitle="Verification and produce snapshot for on-platform growers." />
      <DataTable
        rows={ADMIN_FARMERS}
        columns={[
          { key: "name", label: "Name" },
          { key: "location", label: "Location" },
          { key: "produce", label: "Produce" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          { key: "joined", label: "Joined" },
          { key: "actions", label: "Actions", render: (r) => (
            <Button size="sm" variant="secondary" onClick={() => toast(`${r.name} marked as reviewed.`)}>Review</Button>
          ) },
        ]}
      />
    </div>
  );
}
