import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { orderApi } from "../../api/orderApi.js";
import useFetch from "../../hooks/useFetch.js";
import DataTable from "../../components/common/DataTable.jsx";
import { Button, Loader, PageHeader, StatusBadge } from "../../components/common/ui.jsx";
import { formatINR } from "../../utils/formatPrice.js";
import { useToast } from "../../context/ToastContext.jsx";

const tabs = [
  { id: "active", label: "Active", match: (s) => !["Delivered", "Cancelled"].includes(s) },
  { id: "completed", label: "Completed", match: (s) => s === "Delivered" },
  { id: "cancelled", label: "Cancelled", match: (s) => s === "Cancelled" },
];

export default function BuyerOrders() {
  const { data, loading } = useFetch(() => orderApi.list("buyer"), []);
  const [tab, setTab] = useState("active");
  const [reviewOrder, setReviewOrder] = useState(null);
  const rows = useMemo(() => (data || []).filter((o) => tabs.find((t) => t.id === tab)?.match(o.status)), [data, tab]);
  if (loading) return <Loader />;
  return (
    <div>
      <PageHeader title="Orders" subtitle="Active, completed and cancelled procurement." />
      <div className="mb-4 flex gap-2">
        {tabs.map((t) => (
          <Button key={t.id} variant={tab === t.id ? "primary" : "secondary"} size="sm" onClick={() => setTab(t.id)}>
            {t.label}
          </Button>
        ))}
      </div>
      <DataTable
        rows={rows}
        columns={[
          { key: "id", label: "Order" },
          { key: "crop", label: "Crop" },
          { key: "farmer", label: "Supplier" },
          { key: "qty", label: "Qty", render: (r) => `${r.qty} kg` },
          { key: "value", label: "Value", render: (r) => formatINR(r.value) },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          { key: "track", label: "", render: (r) => <div className="flex items-center gap-3"><Link to={`/buyer/track-order/${r.id}`} className="text-sm font-semibold text-ai-blue">Track</Link>{r.status === "Delivered" && <Button size="sm" variant="secondary" onClick={() => setReviewOrder(r)}>Review</Button>}</div> },
        ]}
      />
      {reviewOrder && <ReviewForm order={reviewOrder} onClose={() => setReviewOrder(null)} />}
    </div>
  );
}

function ReviewForm({ order, onClose }) {
  const { toast } = useToast();
  const [rating, setRating] = useState(5); const [comment, setComment] = useState(""); const [saving, setSaving] = useState(false);
  const product = order.items?.[0]?.product;
  const submit = async (event) => { event.preventDefault(); if (!product?._id) { toast("This order has no reviewable product.", "info"); return; } setSaving(true); try { await orderApi.submitReview({ order: order._id, product: product._id, rating, comment }); toast("Review submitted successfully."); onClose(); } catch (error) { toast(error.response?.data?.message || "Unable to submit review.", "info"); } finally { setSaving(false); } };
  return <div className="mt-5 max-w-xl rounded-2xl border border-emerald-200 bg-white p-5 shadow-card"><div className="flex items-center justify-between"><h3 className="font-bold">Share your experience</h3><Button size="sm" variant="ghost" onClick={onClose}>Close</Button></div><form className="mt-4 space-y-4" onSubmit={submit}><label className="block text-sm font-medium">Rating<select className="mt-1 block h-10 w-full rounded-xl border border-slate-200 px-3" value={rating} onChange={(event) => setRating(Number(event.target.value))}>{[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} stars</option>)}</select></label><label className="block text-sm font-medium">Review<textarea className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2" minLength={3} maxLength={600} required value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Tell other KRISHIQ users about this order" /></label><Button type="submit" disabled={saving}>Submit review</Button></form></div>;
}
