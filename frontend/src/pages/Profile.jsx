import { useEffect, useState } from "react";
import { Camera, Save } from "lucide-react";
import { Avatar, Button, Card, Input, PageHeader, resolveUserAvatarSrc } from "../components/common/ui.jsx";
import { authApi } from "../api/authApi.js";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../context/ToastContext.jsx";

export default function Profile() {
  const { currentUser, updateCurrentUser } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", location: "", address: "", city: "", state: "", pincode: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      name: currentUser?.name || "",
      phone: currentUser?.phone || currentUser?.mobile || "",
      location: currentUser?.location || "",
      address: currentUser?.address || "",
      city: currentUser?.city || "",
      state: currentUser?.state || "",
      pincode: currentUser?.pincode || "",
    });
  }, [currentUser]);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const user = await authApi.updateProfile(form);
      updateCurrentUser(user);
      toast("Profile updated successfully.");
    } catch (error) {
      toast(error.response?.data?.message || "Unable to update profile.", "info");
    } finally {
      setSaving(false);
    }
  };

  const upload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setSaving(true);
    try {
      const user = await authApi.uploadProfileImage(file);
      updateCurrentUser(user);
      toast("Profile photo updated.");
    } catch (error) {
      toast(error.response?.data?.message || "Unable to upload profile photo.", "info");
    } finally {
      setSaving(false);
    }
  };

  const resolvedImage = resolveUserAvatarSrc({ user: currentUser });

  return (
    <div>
      <PageHeader title="Profile" subtitle="Keep your KRISHIQ identity and contact details up to date." />
      <Card className="max-w-3xl">
        <form className="space-y-5" onSubmit={save}>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            {resolvedImage ? (
              <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full border-4 border-emerald-100 bg-emerald-50 dark:border-leaf/40 dark:bg-[#0c1c14]">
                <img
                  key={resolvedImage}
                  src={resolvedImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.currentTarget.replaceWith(
                      Object.assign(document.createElement("div"), {
                        className:
                          "grid h-24 w-24 place-items-center rounded-full bg-light-green text-2xl font-bold text-deep",
                        textContent: (form.name?.slice(0, 1) || currentUser?.name?.slice(0, 1) || "U").toUpperCase(),
                      })
                    );
                  }}
                />
              </div>
            ) : (
              <div className="h-24 w-24 [&>*]:!h-full [&>*]:!w-full [&>*]:!text-2xl">
                <Avatar user={currentUser} size="lg" />
              </div>
            )}
            <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-primary-green px-3 text-sm font-semibold text-white">
              <Camera className="h-4 w-4" /> Upload profile photo
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                disabled={saving}
                onChange={upload}
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            <Input label="Email" value={currentUser?.email || ""} readOnly />
            <Input label="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            <Input label="Location" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} />
            <Input label="Address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
            <Input label="City" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
            <Input label="State" value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} />
            <Input label="Pincode" value={form.pincode} onChange={(event) => setForm({ ...form, pincode: event.target.value })} />
          </div>
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4" /> Save profile
          </Button>
        </form>
      </Card>
    </div>
  );
}
