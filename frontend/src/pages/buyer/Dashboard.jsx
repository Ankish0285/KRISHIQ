import { Brain, IndianRupee, ShoppingBag, Users } from "lucide-react";
import { buyerApi } from "../../api/buyerApi.js";
import useFetch from "../../hooks/useFetch.js";
import { Loader, PageHeader, StatCard } from "../../components/common/ui.jsx";
import ProductCard from "../../components/buyer/ProductCard.jsx";
import RecommendationCard from "../../components/buyer/RecommendationCard.jsx";
import { formatINR } from "../../utils/formatPrice.js";
import { useAuth } from "../../hooks/useAuth.js";

export default function BuyerDashboard() {
  const { currentUser } = useAuth();
  const { data, loading } = useFetch(() => buyerApi.dashboard(), []);
  if (loading || !data) return <Loader />;
  return (
    <div>
      <PageHeader title={`Welcome, ${currentUser?.name?.split(" ")[0] || "Buyer"}`} subtitle="Recommended lots and supplier matches for this week." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ShoppingBag} label="Active Orders" value={data.stats.activeOrders} />
        <StatCard icon={IndianRupee} label="Total Purchases" value={formatINR(data.stats.purchases)} />
        <StatCard icon={Users} label="Saved Suppliers" value={data.stats.savedSuppliers} />
        <StatCard icon={Brain} label="AI Match Score" value={data.stats.matchScore} tone="blue" />
      </div>
      <h2 className="mb-3 mt-8 font-bold">Recommended crops</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.recommended.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <h2 className="mb-3 mt-8 font-bold">AI supplier recommendation</h2>
      <RecommendationCard supplier={data.supplier} />
    </div>
  );
}
