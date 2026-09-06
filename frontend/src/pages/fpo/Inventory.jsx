import { fpoApi } from "../../api/fpoApi.js";
import useFetch from "../../hooks/useFetch.js";
import InventoryCard from "../../components/fpo/InventoryCard.jsx";
import { Loader, PageHeader } from "../../components/common/ui.jsx";

export default function FpoInventory() {
  const { data, loading } = useFetch(() => fpoApi.inventory(), []);
  if (loading) return <Loader />;
  return (
    <div>
      <PageHeader title="Inventory" subtitle="Aggregated crop pool ready for bulk buyers." />
      <div className="grid gap-3">
        {(data || []).map((item) => (
          <InventoryCard key={item.crop} item={item} />
        ))}
      </div>
    </div>
  );
}
