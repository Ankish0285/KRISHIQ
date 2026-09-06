import { Card, Input, PageHeader, Button } from "../../components/common/ui.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useToast } from "../../context/ToastContext.jsx";

export default function FarmerProfile() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  return (
    <div>
      <PageHeader title="Profile" subtitle="Farm identity used for marketplace matching." />
      <Card className="max-w-xl space-y-4">
        <Input id="name" label="Name" defaultValue={currentUser?.name} readOnly />
        <Input id="email" label="Email" defaultValue={currentUser?.email} readOnly />
        <Input id="mobile" label="Mobile" defaultValue={currentUser?.mobile} readOnly />
        <Input id="location" label="Location" defaultValue={currentUser?.location} readOnly />
        <Button onClick={() => toast("Profile saved for this demo session.")}>Save profile</Button>
      </Card>
    </div>
  );
}
