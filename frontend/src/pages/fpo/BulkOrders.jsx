import { fpoApi } from "../../api/fpoApi.js";
import useFetch from "../../hooks/useFetch.js";
import MatchScore from "../../components/common/MatchScore.jsx";
import { Card, Loader, PageHeader, StatusBadge } from "../../components/common/ui.jsx";
import { formatPricePerKg } from "../../utils/formatPrice.js";

export default function BulkOrders() {
  const { data, loading } = useFetch(() => fpoApi.bulkOrders(), []);
  if (loading) return <Loader />;
  return (
    <div>
      <PageHeader title="Bulk Orders" subtitle="Buyer RFQs matched against pooled FPO inventory." />
      <div className="grid gap-4">
        {(data || []).map((b) => (
          <Card key={b.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-slate-400">{b.id}</p>
              <h3 className="text-lg font-bold">{b.buyer}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Requirement: {b.qty.toLocaleString("en-IN")} kg {b.crop}
              </p>
              <p className="text-sm">Max price {formatPricePerKg(b.maxPrice)} · Delivery {b.delivery}</p>
              <div className="mt-2"><StatusBadge status={b.status} /></div>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold text-ai-blue">AI Match {b.match}%</p>
              <MatchScore score={b.match} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
