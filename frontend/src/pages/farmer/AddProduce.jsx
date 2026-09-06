import { useState } from "react";
import ProduceForm from "../../components/farmer/ProduceForm.jsx";
import { Card, PageHeader } from "../../components/common/ui.jsx";
import { farmerApi } from "../../api/farmerApi.js";
import { validateProduce } from "../../utils/validation.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useNavigate } from "react-router-dom";

const empty = {
  cropName: "Tomato",
  category: "Vegetables",
  quantity: "",
  unit: "kg",
  harvestDate: "",
  minPrice: "",
  quality: "A Grade",
  location: "Jaipur",
  description: "",
  image: "",
};

export default function AddProduce() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = validateProduce(values);
    setErrors(next);
    if (Object.keys(next).length) return;
    await farmerApi.addProduce(values);
    toast("Produce listed successfully.");
    navigate("/farmer/my-produce");
  };

  return (
    <div>
      <PageHeader title="Add Produce" subtitle="List a crop lot for AI matching and buyer discovery." />
      <Card>
        <ProduceForm values={values} errors={errors} onChange={setValues} onSubmit={onSubmit} />
      </Card>
    </div>
  );
}
