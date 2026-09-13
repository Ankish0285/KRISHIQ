import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Search, ShoppingCart } from "lucide-react";
import Navbar from "../components/common/Navbar.jsx";
import Footer from "../components/common/Footer.jsx";
import { Button, EmptyState } from "../components/common/ui.jsx";
import { PRODUCTS } from "../utils/mockData.js";
import { useCart } from "../context/CartContext.jsx";
import SeoJsonLd from "../seo/SeoJsonLd.jsx";
import { breadcrumbJsonLd } from "../seo/site.js";

const categories = ["All", "Vegetables", "Grains", "Cash Crops"];

export default function Marketplace() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const { count } = useCart();
  const products = useMemo(() => PRODUCTS.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const text = `${product.cropName} ${product.location} ${product.fpo}`.toLowerCase();
    return matchesCategory && text.includes(query.toLowerCase());
  }).slice(0, 8), [category, query]);

  return (
    <div className="min-h-screen bg-canvas text-ink dark:bg-night dark:text-white">
      <SeoJsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Krishiq Marketplace", path: "/marketplace" },
        ])}
      />
      <Navbar />
      <main className="page-wrap pt-28 pb-16">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-green dark:text-leaf">
              Agricultural Marketplace
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
              Krishiq Marketplace
            </h1>
            <p className="mt-3 max-w-xl text-slate-500 dark:text-[#94A3B8]">
              A direct agricultural marketplace connecting verified farmers and FPOs with buyers. Discover fresh vegetables, grains, and cash crops, compare lots, and source produce with transparent pricing.
            </p>
          </div>
          <Link to="/cart">
            <Button variant="secondary">
              <ShoppingCart className="h-4 w-4" /> Cart ({count})
            </Button>
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search crops, produce or location..."
              aria-label="Search crops, produce or location"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 outline-none focus:ring-4 focus:ring-primary-green/15 dark:border-white/10 dark:bg-panel"
            />
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-xl border px-4 text-sm font-semibold ${
                  category === item
                    ? "border-primary-green bg-primary-green text-white"
                    : "border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-panel dark:text-slate-300"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {products.length ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-8"
            title="No matching produce found"
            text="Try another crop, category or location."
          />
        )}

        <section className="mt-16 rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-white/10 dark:bg-panel sm:p-8">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            How the Krishiq Agricultural Marketplace Works
          </h2>
          <div className="mt-4 grid gap-6 text-sm leading-relaxed text-slate-600 dark:text-[#94A3B8] sm:grid-cols-3">
            <div>
              <h3 className="font-semibold text-ink dark:text-white">Direct Farm Sourcing</h3>
              <p className="mt-1">
                Produce listed on the Krishiq platform comes directly from registered growers and Farmer Producer Organizations (FPOs), cutting out unnecessary intermediaries.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-ink dark:text-white">Transparent Pricing</h3>
              <p className="mt-1">
                Each listing specifies clear pricing per unit with verified quantity and origin. Integrated with <Link className="font-semibold text-primary-green dark:text-leaf hover:underline" to="/krishiq-ai">Krishiq AI</Link> for market fair-price insights.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-ink dark:text-white">End-to-End Fulfillment</h3>
              <p className="mt-1">
                Buyers can order required lots, schedule deliveries, and track logistics status from farm pickup to destination delivery.
              </p>
            </div>
          </div>
        </section>

        <nav className="mt-12 text-sm text-slate-500 dark:text-[#94A3B8]" aria-label="Related pages">
          <p>
            Related:{" "}
            <Link className="font-semibold text-primary-green dark:text-leaf hover:underline" to="/">
              Krishiq Homepage
            </Link>{" "}
            ·{" "}
            <Link className="font-semibold text-primary-green dark:text-leaf hover:underline" to="/for-farmers">
              Krishiq for Farmers
            </Link>{" "}
            ·{" "}
            <Link className="font-semibold text-primary-green dark:text-leaf hover:underline" to="/krishiq-ai">
              Krishiq AI
            </Link>{" "}
            ·{" "}
            <Link className="font-semibold text-primary-green dark:text-leaf hover:underline" to="/agritech">
              Krishiq Agritech
            </Link>{" "}
            ·{" "}
            <Link className="font-semibold text-primary-green dark:text-leaf hover:underline" to="/about">
              About Krishiq
            </Link>
          </p>
        </nav>
      </main>
      <Footer />
    </div>
  );
}

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const buyNow = () => {
    addItem(product, 1);
    navigate("/cart");
  };
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card dark:border-white/10 dark:bg-panel dark:shadow-none">
      <img
        src={product.image}
        alt={`${product.cropName} fresh produce on Krishiq Marketplace`}
        loading="lazy"
        width="400"
        height="176"
        className="h-44 w-full object-cover"
      />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-bold">{product.cropName}</h2>
          <span className="rounded-full bg-light-green px-2 py-1 text-[10px] font-bold text-deep dark:bg-leaf/10 dark:text-leaf">
            Available
          </span>
        </div>
        <p className="mt-2 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
          <MapPin className="h-3.5 w-3.5" />
          {product.location}, Rajasthan
        </p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          {product.quantity} {product.unit} available · {product.fpo}
        </p>
        <div className="mt-auto pt-5">
          <p className="text-lg font-black">
            ₹{product.price}
            <span className="text-xs font-normal text-slate-500"> / {product.unit}</span>
          </p>
          <div className="mt-3 flex gap-2">
            <Link to={`/product/${product.id}`} className="flex-1">
              <Button size="sm" variant="secondary" className="w-full">
                View Details
              </Button>
            </Link>
            <Button size="sm" className="flex-1" onClick={buyNow}>
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
