import { Fuel, Clock, MapPin, Truck } from "lucide-react";
import { Card, Badge } from "./ui.jsx";

export default function RouteOptimizationCard({ plan }) {
  if (!plan) return null;
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold">Route Optimization</h3>
        <Badge tone="blue">AI Powered</Badge>
      </div>
      <ol className="space-y-3">
        {plan.stops.map((s, i) => (
          <li key={i} className="flex gap-3">
            <div className="mt-1 h-3 w-3 rounded-full bg-leaf" />
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">{s.label}</p>
              <p className="font-semibold">{s.name}</p>
              <p className="text-sm text-slate-500">{s.place}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary-green" /> {plan.distance}</p>
        <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-ai-blue" /> {plan.eta}</p>
        <p className="flex items-center gap-2"><Fuel className="h-4 w-4 text-amber-500" /> {plan.fuel}</p>
        <p className="flex items-center gap-2"><Truck className="h-4 w-4" /> {plan.capacity}</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-xl bg-light-green p-2 font-semibold text-deep">Distance saved {plan.saved.distance}</div>
        <div className="rounded-xl bg-light-blue p-2 font-semibold text-ai-blue">Fuel saved {plan.saved.fuel}</div>
        <div className="rounded-xl bg-slate-100 p-2 font-semibold dark:bg-slate-800">Time saved {plan.saved.time}</div>
      </div>
    </Card>
  );
}
