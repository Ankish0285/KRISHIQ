import { CATEGORIES, CROPS, LOCATIONS, QUALITIES } from "../../utils/mockData.js";
import { Button, Input, Select } from "../common/ui.jsx";

export default function ProduceForm({ values, errors, onChange, onSubmit, submitLabel = "Add Produce" }) {
  const set = (key) => (e) => onChange({ ...values, [key]: e.target.value });
  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
      <Select id="cropName" label="Crop Name" value={values.cropName} onChange={set("cropName")} error={errors.cropName}>
        <option value="">Select crop</option>
        {CROPS.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </Select>
      <Select id="category" label="Category" value={values.category} onChange={set("category")} error={errors.category}>
        <option value="">Select category</option>
        {CATEGORIES.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </Select>
      <Input id="quantity" label="Quantity" type="number" value={values.quantity} onChange={set("quantity")} error={errors.quantity} />
      <Select id="unit" label="Unit" value={values.unit} onChange={set("unit")} error={errors.unit}>
        <option value="kg">kg</option>
        <option value="quintal">quintal</option>
        <option value="tonne">tonne</option>
      </Select>
      <Input id="harvestDate" label="Expected Harvest Date" type="date" value={values.harvestDate} onChange={set("harvestDate")} error={errors.harvestDate} />
      <Input id="minPrice" label="Minimum Price (₹/kg)" type="number" value={values.minPrice} onChange={set("minPrice")} error={errors.minPrice} />
      <Select id="quality" label="Quality / Grade" value={values.quality} onChange={set("quality")} error={errors.quality}>
        <option value="">Select grade</option>
        {QUALITIES.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </Select>
      <Select id="location" label="Location" value={values.location} onChange={set("location")} error={errors.location}>
        <option value="">Select location</option>
        {LOCATIONS.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </Select>
      <label className="md:col-span-2 block space-y-1.5" htmlFor="description">
        <span className="text-sm font-medium">Description</span>
        <textarea
          id="description"
          rows={4}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          value={values.description}
          onChange={set("description")}
        />
      </label>
      <Input id="image" label="Crop Image URL" className="md:col-span-2" value={values.image} onChange={set("image")} placeholder="Optional image URL" />
      <div className="md:col-span-2">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
