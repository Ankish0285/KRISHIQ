import { useState } from "react";
import { buyerApi } from "../../api/buyerApi.js";
import useFetch from "../../hooks/useFetch.js";
import SearchFilter from "../../components/buyer/SearchFilter.jsx";
import ProductCard from "../../components/buyer/ProductCard.jsx";
import { EmptyState, Loader, PageHeader } from "../../components/common/ui.jsx";

export default function Marketplace() {
  const [filters, setFilters] = useState({
    q: "",
    crop: "All",
    category: "All",
    maxPrice: "",
    minQty: "",
    location: "All",
    quality: "All",
  });
  const [applied, setApplied] = useState(filters);
  const { data, loading } = useFetch(() => buyerApi.marketplace(applied), [JSON.stringify(applied)]);

  return (
    <div>
      <PageHeader title="Marketplace" subtitle="Source verified farm lots with AI match scores and delivery estimates." />
      <SearchFilter filters={filters} setFilters={setFilters} onApply={() => setApplied(filters)} />
      {loading ? (
        <Loader />
      ) : !data?.length ? (
        <EmptyState className="mt-6" title="No lots match these filters" text="Try widening crop, location or price." />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
