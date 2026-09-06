import { useState } from "react";
import { productApi } from "../../api/productApi.js";
import useFetch from "../../hooks/useFetch.js";
import DataTable from "../../components/common/DataTable.jsx";
import Modal from "../../components/common/Modal.jsx";
import { Button, Input, Loader, PageHeader, Select, StatusBadge } from "../../components/common/ui.jsx";
import { CROPS, CATEGORIES, LOCATIONS } from "../../utils/mockData.js";
import { useToast } from "../../context/ToastContext.jsx";
import { formatPricePerKg } from "../../utils/formatPrice.js";

export default function AdminProducts() {
  const { data, loading, reload, setData } = useFetch(() => productApi.list(), []);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ cropName: "Tomato", category: "Vegetables", farmer: "New Farm", location: "Jaipur", quantity: 500, price: 28, quality: "A Grade" });

  const create = async () => {
    const item = await productApi.create(form);
    setData([item, ...(data || [])]);
    toast("Product listed.");
    setOpen(false);
  };

  const remove = async (id) => {
    await productApi.remove(id);
    toast("Product removed.");
    reload();
  };

  if (loading) return <Loader />;
  return (
    <div>
      <PageHeader title="Products" subtitle="CRUD for marketplace lots." actions={<Button onClick={() => setOpen(true)}>Add product</Button>} />
      <DataTable
        rows={data || []}
        columns={[
          { key: "cropName", label: "Crop" },
          { key: "farmer", label: "Farmer / FPO" },
          { key: "location", label: "Location" },
          { key: "quantity", label: "Qty", render: (r) => `${r.quantity} kg` },
          { key: "price", label: "Price", render: (r) => formatPricePerKg(r.price) },
          { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
          { key: "actions", label: "Actions", render: (r) => (
            <Button size="sm" variant="ghost" onClick={() => remove(r.id)}>Delete</Button>
          ) },
        ]}
      />
      <Modal open={open} title="Add product" onClose={() => setOpen(false)} footer={<Button onClick={create}>Save</Button>}>
        <div className="grid gap-3">
          <Select id="ac" label="Crop" value={form.cropName} onChange={(e) => setForm({ ...form, cropName: e.target.value })}>
            {CROPS.map((c) => <option key={c}>{c}</option>)}
          </Select>
          <Select id="acat" label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </Select>
          <Input id="af" label="Farmer" value={form.farmer} onChange={(e) => setForm({ ...form, farmer: e.target.value })} />
          <Select id="al" label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}>
            {LOCATIONS.map((c) => <option key={c}>{c}</option>)}
          </Select>
          <Input id="aq" label="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
          <Input id="ap" label="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        </div>
      </Modal>
    </div>
  );
}
