import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productApi } from "../../api/productApi.js";
import useFetch from "../../hooks/useFetch.js";
import MatchScore from "../../components/common/MatchScore.jsx";
import { Button, Card, Input, Loader, PageHeader } from "../../components/common/ui.jsx";
import { formatPricePerKg } from "../../utils/formatPrice.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useCart } from "../../context/CartContext.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const { data, loading } = useFetch(() => productApi.get(id), [id]);
  const { toast } = useToast();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ quantity: 200, deliveryLocation: "Delhi", preferredDate: "2026-09-10" });

  if (loading) return <Loader />;
  if (!data) {
    return (
      <div>
        <PageHeader title="Lot not found" />
        <Button onClick={() => navigate("/buyer/marketplace")}>Back to marketplace</Button>
      </div>
    );
  }

  const request = async (e) => {
    e.preventDefault();
    addItem(data, Number(form.quantity));
    toast(`${data.cropName} added to your cart.`);
    navigate("/cart");
  };

  return (
    <div>
      <PageHeader title={data.cropName} subtitle={`${data.farmer} · ${data.fpo}`} />
      <div className="grid gap-6 lg:grid-cols-2">
        <img src={data.image} alt={data.cropName} className="h-80 w-full rounded-3xl object-cover" />
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">{data.location} · Harvest {data.harvestDate}</p>
              <p className="mt-2 text-3xl font-extrabold">{formatPricePerKg(data.price)}</p>
              <p className="mt-1 text-sm">{data.quantity} {data.unit} available · {data.quality}</p>
            </div>
            <MatchScore score={data.match} />
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{data.description}</p>
          <form className="mt-6 space-y-3" onSubmit={request}>
            <Input id="qty" label="Quantity (kg)" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            <Input id="loc" label="Delivery location" value={form.deliveryLocation} onChange={(e) => setForm({ ...form, deliveryLocation: e.target.value })} />
            <Input id="date" label="Preferred delivery date" type="date" value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} />
            <Button type="submit" className="w-full">Buy Now</Button>
            <Button type="button" variant="secondary" className="w-full" onClick={() => toast("Seller contact will be available after sign-in.")}>Contact Seller</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
