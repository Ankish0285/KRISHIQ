import { useState } from "react";
import { farmerApi } from "../../api/farmerApi.js";
import useFetch from "../../hooks/useFetch.js";
import CropCard from "../../components/farmer/CropCard.jsx";
import ProduceForm from "../../components/farmer/ProduceForm.jsx";
import Modal from "../../components/common/Modal.jsx";
import { Button, EmptyState, Loader, PageHeader } from "../../components/common/ui.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export default function MyProduce() {
  const { data, loading, reload } = useFetch(() => farmerApi.listProduce(), []);
  const { toast } = useToast();
  const [edit, setEdit] = useState(null);

  const onDelete = async (item) => {
    await farmerApi.deleteProduce(item.id);
    toast(`${item.cropName} listing removed.`);
    reload();
  };

  const save = async (e) => {
    e.preventDefault();
    await farmerApi.updateProduce(edit.id, {
      quantity: Number(edit.quantity),
      price: Number(edit.minPrice || edit.price),
      quality: edit.quality,
      location: edit.location,
      description: edit.description,
    });
    toast("Produce updated.");
    setEdit(null);
    reload();
  };

  if (loading) return <Loader />;
  return (
    <div>
      <PageHeader title="My Produce" subtitle="Manage listed lots, demand scores and farm-gate prices." />
      {!data?.length ? (
        <EmptyState title="No produce listed" text="Add your first crop lot to start matching." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((item) => (
            <CropCard
              key={item.id}
              item={item}
              onEdit={(i) => setEdit({ ...i, minPrice: i.price })}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
      <Modal
        open={Boolean(edit)}
        title="Edit produce"
        onClose={() => setEdit(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEdit(null)}>Cancel</Button>
          </>
        }
      >
        {edit && (
          <ProduceForm
            values={edit}
            errors={{}}
            onChange={setEdit}
            onSubmit={save}
            submitLabel="Save changes"
          />
        )}
      </Modal>
    </div>
  );
}
