import DataTable from "../common/DataTable.jsx";
import { StatusBadge, Button } from "../common/ui.jsx";

export default function FarmerTable({ rows, onAdd }) {
  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={onAdd}>Add Farmer</Button>
      </div>
      <DataTable
        rows={rows}
        columns={[
          { key: "name", label: "Farmer" },
          { key: "location", label: "Location" },
          { key: "crop", label: "Crop" },
          { key: "quantity", label: "Quantity", render: (r) => `${r.quantity} kg` },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          { key: "contact", label: "Contact" },
        ]}
      />
    </div>
  );
}
