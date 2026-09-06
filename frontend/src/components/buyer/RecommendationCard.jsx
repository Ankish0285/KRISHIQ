import { MapPin } from "lucide-react";
import { Card, Badge } from "../common/ui.jsx";
import MatchScore from "../common/MatchScore.jsx";
import { formatPricePerKg } from "../../utils/formatPrice.js";

export default function RecommendationCard({ supplier }) {
  return (
    <Card className="flex items-center gap-4">
      <MatchScore score={supplier.match} />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-bold">{supplier.name}</h3>
          <Badge tone="blue">AI MATCH {supplier.match}%</Badge>
        </div>
        <p className="text-sm text-slate-500">{supplier.org}</p>
        <p className="mt-2 text-sm">
          {supplier.qty} kg · {formatPricePerKg(supplier.price)} · {supplier.distance} km away
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="h-3 w-3" /> {supplier.location}
        </p>
      </div>
    </Card>
  );
}
