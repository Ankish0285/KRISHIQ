import { Link, useParams } from "react-router-dom";
import { orderApi } from "../../api/orderApi.js";
import { logisticsApi } from "../../api/logisticsApi.js";
import useFetch from "../../hooks/useFetch.js";
import DeliveryTracker from "../../components/logistics/DeliveryTracker.jsx";
import RouteMap from "../../components/logistics/RouteMap.jsx";
import RouteOptimizationCard from "../../components/common/RouteOptimizationCard.jsx";
import { Card, Loader, PageHeader, StatusBadge } from "../../components/common/ui.jsx";
import { Clock, MapPin, Truck, User } from "lucide-react";

export default function TrackOrder() {
  const { id } = useParams();
  const orders = useFetch(() => orderApi.list("buyer"), []);
  const selected = useFetch(() => orderApi.get(id || "ORD-2401"), [id]);
  const plan = useFetch(() => logisticsApi.routePlan(), []);
  if (orders.loading || selected.loading) return <Loader />;
  const order = selected.data;
  if (!id) {
    return (
      <div>
        <PageHeader title="Track Order" subtitle="Select a consignment to follow harvest, pickup and delivery." />
        <div className="grid gap-3">
          {(orders.data || []).filter((o) => o.status !== "Cancelled").map((o) => (
            <Link key={o.id} to={`/buyer/track-order/${o.id}`}>
              <Card className="flex items-center justify-between hover:border-leaf">
                <div>
                  <p className="font-bold">{o.id} · {o.crop}</p>
                  <p className="text-sm text-slate-500">{o.location}</p>
                </div>
                <StatusBadge status={o.status} />
              </Card>
            </Link>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div>
      <PageHeader title={`Track ${order.id}`} subtitle={`${order.crop} · ${order.farmer} → ${order.buyer}`} />
      <div className="mb-4 flex items-center gap-3">
        <StatusBadge status={order.status} />
        <span className="text-sm text-slate-500">ETA {order.eta}</span>
      </div>
      <DeliveryTracker status={order.status} />
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <RouteMap currentLocation={order.currentLocation} destination={order.location.split("→").pop()?.trim()} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Card><p className="text-xs text-slate-500">Current location</p><p className="mt-1 flex items-center gap-2 font-semibold"><MapPin className="h-4 w-4" /> {order.currentLocation}</p></Card>
            <Card><p className="text-xs text-slate-500">Estimated delivery</p><p className="mt-1 flex items-center gap-2 font-semibold"><Clock className="h-4 w-4" /> {order.eta}</p></Card>
            <Card><p className="text-xs text-slate-500">Driver</p><p className="mt-1 flex items-center gap-2 font-semibold"><User className="h-4 w-4" /> {order.driver}</p></Card>
            <Card><p className="text-xs text-slate-500">Vehicle · Distance</p><p className="mt-1 flex items-center gap-2 font-semibold"><Truck className="h-4 w-4" /> {order.vehicle} · {order.distance}</p></Card>
          </div>
        </div>
        {plan.data && <RouteOptimizationCard plan={plan.data} />}
      </div>
    </div>
  );
}
