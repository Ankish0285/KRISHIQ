import { useState } from "react";
import { aiApi } from "../../api/aiApi.js";
import RecommendationCard from "../../components/buyer/RecommendationCard.jsx";
import { Button, Card, Input, PageHeader, Select } from "../../components/common/ui.jsx";
import { CROPS, LOCATIONS } from "../../utils/mockData.js";
import { formatPricePerKg } from "../../utils/formatPrice.js";

export default function Recommendations() {
  const [form, setForm] = useState({
    crop: "Tomato",
    quantity: 1200,
    maxPrice: 30,
    location: "Delhi",
    deadline: "2026-09-08",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const find = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await aiApi.matchSuppliers(form);
    setResult(data);
    setLoading(false);
  };

  return (
    <div>
      <PageHeader title="AI-Powered Supplier Recommendations" subtitle="Combine lots across farmers and FPOs to hit quantity without overpaying." />
      <Card>
        <form className="grid gap-4 md:grid-cols-2 lg:grid-cols-5" onSubmit={find}>
          <Select id="crop" label="Crop" value={form.crop} onChange={set("crop")}>
            {CROPS.map((c) => <option key={c}>{c}</option>)}
          </Select>
          <Input id="qty" label="Required Quantity" type="number" value={form.quantity} onChange={set("quantity")} />
          <Input id="max" label="Maximum Price ₹/kg" type="number" value={form.maxPrice} onChange={set("maxPrice")} />
          <Select id="loc" label="Buyer Location" value={form.location} onChange={set("location")}>
            {LOCATIONS.map((c) => <option key={c}>{c}</option>)}
          </Select>
          <Input id="dead" label="Delivery Deadline" type="date" value={form.deadline} onChange={set("deadline")} />
          <div className="md:col-span-2 lg:col-span-5">
            <Button type="submit" disabled={loading}>{loading ? "Matching..." : "Find Best Suppliers"}</Button>
          </div>
        </form>
      </Card>
      {result && (
        <div className="mt-6 space-y-4">
          {result.suppliers.map((s, i) => (
            <RecommendationCard key={s.id} supplier={{ ...s, name: `Supplier ${i + 1} · ${s.name}` }} />
          ))}
          <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/40 dark:to-blue-950/20">
            <h3 className="text-xl font-extrabold">Recommended Procurement Plan</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{result.plan.note}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-4 dark:bg-slate-900">
                <p className="text-xs text-slate-500">Total quantity</p>
                <p className="text-xl font-bold">{result.plan.totalQty} kg</p>
              </div>
              <div className="rounded-xl bg-white p-4 dark:bg-slate-900">
                <p className="text-xs text-slate-500">Blended price</p>
                <p className="text-xl font-bold">{formatPricePerKg(result.plan.blendedPrice)}</p>
              </div>
              <div className="rounded-xl bg-white p-4 dark:bg-slate-900">
                <p className="text-xs text-slate-500">Farms / FPOs</p>
                <p className="text-xl font-bold">{result.plan.farms}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
