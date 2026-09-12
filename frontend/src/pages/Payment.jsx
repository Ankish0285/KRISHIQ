import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, CreditCard, Landmark, Smartphone, WalletCards } from "lucide-react";
import Navbar from "../components/common/Navbar.jsx";
import Footer from "../components/common/Footer.jsx";
import { Button } from "../components/common/ui.jsx";
import { useCart } from "../context/CartContext.jsx";
import { orderApi } from "../api/orderApi.js";
import { OrderSummary } from "./Checkout.jsx";

const methods = [["UPI", "upi", Smartphone], ["Card", "card", CreditCard], ["Net Banking", "bank", Landmark], ["Wallet", "wallet", WalletCards]];

export default function Payment() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [method, setMethod] = useState("upi");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!items.length) return <div className="grid min-h-screen place-items-center">Your cart is empty.</div>;

  const placeOrder = async () => {
    try {
      setSubmitting(true);
      setError("");

      const order = await orderApi.create({
        items: items.map((item) => ({
          productId: item.id || item._id,
          quantity: item.quantity,
        })),
        shippingAddress: `${state?.address?.line || ""}, ${state?.address?.city || ""} ${state?.address?.postalCode || ""}`.trim(),
        address: state?.address,
      });

      clear();
      navigate("/order-confirmation", { state: { orderId: order.id || order._id, address: state?.address, total, items } });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to place order right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return <div className="min-h-screen bg-canvas text-ink dark:bg-night dark:text-white"><Navbar /><main className="page-wrap max-w-5xl pt-28 pb-16"><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-green dark:text-leaf">Secure checkout</p><h1 className="mt-2 text-3xl font-black">Choose a payment method</h1><div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]"><section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-panel"><div className="grid gap-3 sm:grid-cols-2">{methods.map(([label, value, Icon]) => <button key={value} type="button" onClick={() => setMethod(value)} className={`flex items-center gap-3 rounded-xl border p-4 text-left ${method === value ? "border-primary-green bg-light-green/50 dark:border-leaf dark:bg-leaf/10" : "border-slate-200 dark:border-white/10"}`}><Icon className="h-5 w-5 text-primary-green dark:text-leaf" /><span className="flex-1 font-semibold">{label}</span>{method === value && <Check className="h-4 w-4 text-primary-green dark:text-leaf" />}</button>)}</div><div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300"><p className="font-semibold">Payment provider ready</p><p className="mt-1">This frontend flow selects a method without collecting or storing payment credentials. Connect Razorpay, Stripe or another provider on the server before enabling live payments.</p></div>{error && <p className="mt-4 text-sm text-rose-600">{error}</p>}<Button className="mt-6" onClick={placeOrder} disabled={submitting}>{submitting ? "Placing order..." : `Pay Securely · ₹${total.toLocaleString("en-IN")}`}</Button></section><OrderSummary total={total} items={items} /></div></main><Footer /></div>;
}
