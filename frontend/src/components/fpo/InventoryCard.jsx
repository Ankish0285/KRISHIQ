import { Card, Badge } from "../common/ui.jsx";
import { formatPricePerKg } from "../../utils/formatPrice.js";
import { CROP_IMAGES } from "../../utils/mockData.js";

export default function InventoryCard({ item }) {
  const tone = item.demand.includes("High") ? "green" : item.demand.includes("Medium") ? "amber" : "slate";
  return (
    <Card className="flex items-center gap-4">
      <img src={CROP_IMAGES[item.crop]} alt={item.crop} className="h-16 w-16 rounded-xl object-cover" />
      <div className="flex-1">
        <h3 className="font-bold">{item.crop}</h3>
        <p className="text-sm text-slate-500">{item.quantity.toLocaleString("en-IN")} kg · {formatPricePerKg(item.price)}</p>
      </div>
      <Badge tone={tone}>{item.demand}</Badge>
    </Card>
  );
}
