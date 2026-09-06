import { IndianRupee, TrendingUp } from "lucide-react";
import { Card, Badge } from "./ui.jsx";
import { formatPricePerKg } from "../../utils/formatPrice.js";

export default function PricePredictionCard({ crop, current, predicted }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="font-bold">Smart Price Intelligence</h3>
        <Badge tone="blue">AI Powered</Badge>
      </div>
      <p className="mt-1 text-sm text-slate-500">{crop} expected mandi movement</p>
      <div className="mt-4 flex items-end gap-6">
        <div>
          <p className="text-xs text-slate-500">Current</p>
          <p className="text-2xl font-extrabold">{formatPricePerKg(current)}</p>
        </div>
        <TrendingUp className="mb-2 h-5 w-5 text-leaf" />
        <div>
          <p className="text-xs text-slate-500">Predicted</p>
          <p className="text-2xl font-extrabold text-ai-blue">{formatPricePerKg(predicted)}</p>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1 text-xs text-slate-500">
        <IndianRupee className="h-3 w-3" /> Transparent farm-gate pricing, not mandi averages alone.
      </p>
    </Card>
  );
}
