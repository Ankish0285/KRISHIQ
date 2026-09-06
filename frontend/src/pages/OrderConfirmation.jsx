import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, MapPin } from "lucide-react";
import Navbar from "../components/common/Navbar.jsx";
import Footer from "../components/common/Footer.jsx";
import { Button } from "../components/common/ui.jsx";

export default function OrderConfirmation() {
  const { state } = useLocation();
  const items = state?.items || [];
  return <div className="min-h-screen bg-canvas text-ink dark:bg-night dark:text-white"><Navbar /><main className="page-wrap max-w-3xl pt-28 pb-16"><div className="rounded-2xl border border-emerald-200 bg-white p-6 text-center dark:border-leaf/30 dark:bg-panel sm:p-10"><CheckCircle2 className="mx-auto h-14 w-14 text-primary-green dark:text-leaf" /><p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-primary-green dark:text-leaf">Order confirmed</p><h1 className="mt-2 text-3xl font-black">Order placed successfully</h1><p className="mt-3 text-slate-500 dark:text-slate-300">Your order is ready for seller confirmation.</p><p className="mt-5 text-sm text-slate-500">Order ID: <strong className="text-ink dark:text-white">{state?.orderId || "Pending"}</strong></p><div className="mx-auto mt-8 max-w-md border-y border-slate-200 py-5 text-left dark:border-white/10">{items.map((item) => <div key={item.id} className="flex justify-between py-2 text-sm"><span>{item.cropName} × {item.quantity} {item.unit}</span><span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span></div>)}<div className="mt-2 flex items-center gap-2 text-sm text-slate-500"><MapPin className="h-4 w-4" />{state?.address?.city || "Delivery address received at checkout"}</div></div><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/buyer/track-order"><Button>Track Order</Button></Link><Link to="/marketplace"><Button variant="secondary">Continue Shopping</Button></Link></div></div></main><Footer /></div>;
}
