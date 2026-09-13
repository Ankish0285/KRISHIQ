import { useEffect, useState } from "react";
import { Card, Button, Input, PageHeader } from "../../components/common/ui.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import adminApi from "../../api/adminApi.js";
import { useLocation } from "react-router-dom";
import { useToast } from "../../context/ToastContext.jsx";

const labels = { "/admin/marketplace": "Marketplace", "/admin/content": "Content Management", "/admin/notifications": "Notifications", "/admin/settings": "Website Settings", "/admin/audit-logs": "Audit Logs", "/admin/admins": "Admin Management" };

export default function AdminTools() {
  const { pathname } = useLocation();
  const { toast } = useToast();
  const title = labels[pathname] || "Admin Tools";
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState({ websiteName: "KRISHIQ", contactEmail: "", contactPhone: "" });
  const [admin, setAdmin] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (pathname === "/admin/audit-logs") adminApi.auditLogs().then(setRows).catch((err) => setError(err.response?.data?.message || "Unable to load audit logs."));
    if (pathname === "/admin/settings") adminApi.settings().then((items) => setSettings(Object.fromEntries(items.map((item) => [item.key, item.value])))).catch((err) => setError(err.response?.data?.message || "Unable to load settings."));
  }, [pathname]);

  const saveSettings = async () => { try { await adminApi.updateSettings(settings); toast("Settings updated."); } catch (err) { setError(err.response?.data?.message || "Unable to update settings."); } };
  const createAdmin = async (event) => { event.preventDefault(); try { await adminApi.createAdmin(admin); setAdmin({ name: "", email: "", password: "" }); toast("Admin created."); } catch (err) { setError(err.response?.data?.message || "Unable to create admin."); } };

  return <div><PageHeader title={title} subtitle="Controlled through protected KRISHIQ admin APIs." />{error && <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
    {pathname === "/admin/audit-logs" && <DataTable rowKey="_id" rows={rows} columns={[{ key: "action", label: "Action" }, { key: "resourceType", label: "Resource" }, { key: "actor", label: "Actor", render: (row) => row.actor?.email || "Admin" }, { key: "createdAt", label: "Time", render: (row) => new Date(row.createdAt).toLocaleString() }]} />}
    {pathname === "/admin/settings" && <Card className="max-w-xl space-y-4"><Input id="setting-name" label="Website name" value={settings.websiteName || ""} onChange={(e) => setSettings({ ...settings, websiteName: e.target.value })} /><Input id="setting-email" label="Contact email" value={settings.contactEmail || ""} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} /><Input id="setting-phone" label="Contact phone" value={settings.contactPhone || ""} onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })} /><Button onClick={saveSettings}>Save settings</Button></Card>}
    {pathname === "/admin/admins" && <Card className="max-w-xl"><p className="mb-4 text-sm text-slate-500">Only a super admin can create admins. Server permissions are enforced.</p><form className="space-y-4" onSubmit={createAdmin}><Input id="admin-name" label="Name" value={admin.name} onChange={(e) => setAdmin({ ...admin, name: e.target.value })} /><Input id="admin-email" label="Email" type="email" value={admin.email} onChange={(e) => setAdmin({ ...admin, email: e.target.value })} /><Input id="admin-password" label="Temporary password" type="password" value={admin.password} onChange={(e) => setAdmin({ ...admin, password: e.target.value })} /><Button type="submit">Create admin</Button></form></Card>}
    {pathname !== "/admin/audit-logs" && pathname !== "/admin/settings" && pathname !== "/admin/admins" && <Card><p className="text-slate-500">This admin workspace is ready for existing marketplace content and notification records. No unsafe server controls are exposed here.</p></Card>}
  </div>;
}
