import { logisticsApi } from "../../api/logisticsApi.js";
import useFetch from "../../hooks/useFetch.js";
import DataTable from "../../components/common/DataTable.jsx";
import RouteMap from "../../components/logistics/RouteMap.jsx";
import RouteOptimizationCard from "../../components/common/RouteOptimizationCard.jsx";
import { Loader, PageHeader, StatusBadge } from "../../components/common/ui.jsx";
import { ORDERS } from "../../utils/mockData.js";

export default function AdminLogistics() {
  const vehicles = useFetch(() => logisticsApi.vehicles(), []);
  const plan = useFetch(() => logisticsApi.routePlan(), []);
  if (vehicles.loading || plan.loading) return <Loader />;
  const delayed = ORDERS.filter((o) => o.status === "Delayed" || o.id === "ORD-2405");
  return (
    <div>
      <PageHeader title="Logistics" subtitle="Active deliveries, vehicles and AI route optimization." />
      <div className="grid gap-4 lg:grid-cols-2">
        <RouteMap />
        {plan.data && <RouteOptimizationCard plan={plan.data} />}
      </div>
      <h3 className="mb-3 mt-8 font-bold">Vehicles</h3>
      <DataTable
        rows={vehicles.data || []}
        columns={[
          { key: "vehicle", label: "Vehicle" },
          { key: "driver", label: "Driver" },
          { key: "route", label: "Route" },
          { key: "load", label: "Capacity" },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
      <h3 className="mb-3 mt-8 font-bold">Delivery status / delayed risk</h3>
      <DataTable
        rows={delayed.length ? delayed : ORDERS.filter((o) => o.status === "In Transit")}
        columns={[
          { key: "id", label: "Order" },
          { key: "location", label: "Route" },
          { key: "driver", label: "Driver" },
          { key: "status", label: "Delivery status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
    </div>
  );
}
