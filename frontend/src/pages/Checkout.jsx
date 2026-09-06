import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar.jsx";
import Footer from "../components/common/Footer.jsx";
import { Button, Input } from "../components/common/ui.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Checkout() {
  const { items, total } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ name: "", phone: "", line: "", city: "", postalCode: "" });
  const update = (key) => (event) => setAddress((current) => ({ ...current, [key]: event.target.value }));
  if (!items.length) return <RedirectEmpty />;
  return <div className="min-h-screen bg-canvas text-ink dark:bg-night dark:text-white"><Navbar /><main className="page-wrap max-w-5xl pt-28 pb-16"><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-green dark:text-leaf">Checkout</p><h1 className="mt-2 text-3xl font-black">Where should we deliver?</h1><div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]"><form onSubmit={(event) => { event.preventDefault(); navigate("/payment", { state: { address } }); }} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-panel"><h2 className="text-lg font-bold">Delivery address</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><Input id="name" label="Full name" required value={address.name} onChange={update("name")} /><Input id="phone" label="Phone number" required inputMode="tel" value={address.phone} onChange={update("phone")} /><Input id="line" label="Address" required className="sm:col-span-2" value={address.line} onChange={update("line")} /><Input id="city" label="City" required value={address.city} onChange={update("city")} /><Input id="postalCode" label="Postal code" required inputMode="numeric" value={address.postalCode} onChange={update("postalCode")} /></div><Button type="submit" className="mt-6">Continue to Payment</Button></form><OrderSummary total={total} items={items} /></div></main><Footer /></div>;
}

export function OrderSummary({ total, items }) { return <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-panel"><h2 className="font-bold">Order summary</h2><div className="mt-4 space-y-3 text-sm">{items.map((item) => <div key={item.id} className="flex justify-between gap-4"><span>{item.cropName} × {item.quantity}</span><span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span></div>)}<div className="border-t border-slate-200 pt-3 font-bold dark:border-white/10"><div className="flex justify-between"><span>Total</span><span>₹{total.toLocaleString("en-IN")}</span></div></div></div></aside>; }
function RedirectEmpty() { return <div className="grid min-h-screen place-items-center p-6"><div className="text-center"><h1 className="text-2xl font-bold">Your cart is empty.</h1><Button className="mt-4" onClick={() => window.location.assign("/marketplace")}>Explore Marketplace</Button></div></div>; }
