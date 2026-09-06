import { Card, Input, PageHeader, Button } from "../../components/common/ui.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useToast } from "../../context/ToastContext.jsx";

export default function BuyerProfile() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  return (
    <div>
      <PageHeader title="Profile" subtitle="Buyer organization used for procurement matching." />
      <Card className="max-w-xl space-y-4">
        <Input id="name" label="Name" defaultValue={currentUser?.name} readOnly />
        <Input id="org" label="Business" defaultValue={currentUser?.organization} readOnly />
        <Input id="email" label="Email" defaultValue={currentUser?.email} readOnly />
        <Input id="location" label="Location" defaultValue={currentUser?.location} readOnly />
        <Button onClick={() => toast("Buyer profile updated.")}>Save</Button>
      </Card>
    </div>
  );
}
