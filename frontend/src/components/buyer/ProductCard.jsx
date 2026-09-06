import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Button, Card, Badge } from "../common/ui.jsx";
import MatchScore from "../common/MatchScore.jsx";
import { formatPricePerKg } from "../../utils/formatPrice.js";

export default function ProductCard({ product }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden p-0">
      <img src={product.image} alt={product.cropName} className="h-44 w-full object-cover" />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold">{product.cropName}</h3>
            <p className="text-sm text-slate-500">{product.farmer} · {product.fpo}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="h-3 w-3" /> {product.location}
            </p>
          </div>
          <MatchScore score={product.match} size={68} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <span>{product.quantity} {product.unit}</span>
          <span className="text-right font-semibold">{formatPricePerKg(product.price)}</span>
          <Badge>{product.quality}</Badge>
          <span className="text-right text-xs text-slate-500">{product.delivery}</span>
        </div>
        <div className="mt-4 flex gap-2">
          <Link to={`/buyer/product/${product.id}`} className="flex-1">
            <Button variant="secondary" className="w-full" size="sm">View Details</Button>
          </Link>
          <Link to={`/buyer/product/${product.id}`} className="flex-1">
            <Button className="w-full" size="sm">Request Quote</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
