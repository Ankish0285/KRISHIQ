import { useState } from "react";
import { fpoApi } from "../../api/fpoApi.js";
import useFetch from "../../hooks/useFetch.js";
import FarmerTable from "../../components/fpo/FarmerTable.jsx";
import Modal from "../../components/common/Modal.jsx";
import { Button, Input, Loader, PageHeader, Select } from "../../components/common/ui.jsx";
import { CROPS, LOCATIONS } from "../../utils/mockData.js";
import { useToast } from "../../context/ToastContext.jsx";

export default function FpoFarmers() {
  const { data, loading, reload } = useFetch(() => fpoApi.farmers(), []);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", location: "Jaipur", crop: "Tomato", quantity: 200, contact: "" });
  const { toast } = useToast();

  const add = async () => {
    await fpoApi.addFarmer(form);
    toast("Farmer added to the FPO roster.");
    setOpen(false);
    reload();
  };

  if (loading) return <Loader />;
  return (
    <div>
      <PageHeader title="Farmers" subtitle="Member farms contributing to aggregated KRISHIQ lots." />
      <FarmerTable rows={data || []} onAdd={() => setOpen(true)} />
      <Modal
        open={open}
        title="Add Farmer"
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={add}>Save farmer</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input id="fn" label="Farmer" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Select id="fl" label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}>
            {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
          </Select>
          <Select id="fc" label="Crop" value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })}>
            {CROPS.map((c) => <option key={c}>{c}</option>)}
          </Select>
          <Input id="fq" label="Quantity (kg)" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
          <Input id="ft" label="Contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}
