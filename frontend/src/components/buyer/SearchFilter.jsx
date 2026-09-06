import { CATEGORIES, CROPS, LOCATIONS, QUALITIES } from "../../utils/mockData.js";
import { Input, Select, SearchBar, Button, Card } from "../common/ui.jsx";

export default function SearchFilter({ filters, setFilters, onApply }) {
  const set = (key) => (e) => setFilters((f) => ({ ...f, [key]: typeof e === "string" ? e : e.target.value }));
  return (
    <Card>
      <SearchBar value={filters.q} onChange={(v) => setFilters((f) => ({ ...f, q: v }))} placeholder="Search crops, farmers, FPOs..." />
      <div className="mt-4 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Select id="crop" label="Crop" value={filters.crop} onChange={set("crop")}>
          <option>All</option>
          {CROPS.map((c) => <option key={c}>{c}</option>)}
        </Select>
        <Select id="category" label="Category" value={filters.category} onChange={set("category")}>
          <option>All</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </Select>
        <Input id="maxPrice" label="Max price ₹/kg" type="number" value={filters.maxPrice} onChange={set("maxPrice")} />
        <Input id="minQty" label="Min quantity" type="number" value={filters.minQty} onChange={set("minQty")} />
        <Select id="location" label="Location" value={filters.location} onChange={set("location")}>
          <option>All</option>
          {LOCATIONS.map((c) => <option key={c}>{c}</option>)}
        </Select>
        <Select id="quality" label="Quality" value={filters.quality} onChange={set("quality")}>
          <option>All</option>
          {QUALITIES.map((c) => <option key={c}>{c}</option>)}
        </Select>
      </div>
      <Button className="mt-4" onClick={onApply}>Apply filters</Button>
    </Card>
  );
}
