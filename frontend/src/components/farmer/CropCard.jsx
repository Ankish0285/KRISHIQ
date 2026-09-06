import { Pencil, Trash2 } from "lucide-react";
import { Card, StatusBadge, Button } from "../common/ui.jsx";
import MatchScore from "../common/MatchScore.jsx";
import { formatPricePerKg } from "../../utils/formatPrice.js";

export default function CropCard({ item, onEdit, onDelete }) {
  return (
    <Card className="overflow-hidden p-0">
      <img src={item.image} alt={item.cropName} className="h-40 w-full object-cover" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold">{item.cropName}</h3>
            <p className="text-sm text-slate-500">{item.location} · {item.quality}</p>
          </div>
          <MatchScore score={item.demandScore} size={64} />
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span>{item.quantity} {item.unit}</span>
          <span className="font-semibold">{formatPricePerKg(item.price)}</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">Harvest {item.harvestDate}</p>
        <div className="mt-3 flex items-center justify-between">
          <StatusBadge status={item.status} />
          <div className="flex gap-2">
            {onEdit && (
              <Button size="sm" variant="ghost" onClick={() => onEdit(item)} aria-label="Edit produce">
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button size="sm" variant="ghost" onClick={() => onDelete(item)} aria-label="Delete produce">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
