import { useEffect, useState } from "react";
import { Button, Input, PageHeader, StatusBadge } from "../../components/common/ui.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import adminApi from "../../api/adminApi.js";
import { useToast } from "../../context/ToastContext.jsx";

export default function AdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const load = () => adminApi.users({ search }).then((data) => setUsers(data.users || [])).catch((err) => setError(err.response?.data?.message || "Unable to load users."));
  useEffect(() => { load(); }, []);
  const toggle = async (user) => {
    if (!window.confirm(`${user.isActive ? "Deactivate" : "Activate"} ${user.name}?`)) return;
    try { await adminApi.updateUser(user._id, { isActive: !user.isActive }); toast("User status updated."); load(); } catch (err) { setError(err.response?.data?.message || "Unable to update user."); }
  };
  return <div><PageHeader title="Users" subtitle="Manage accounts using server-side permissions." /><div className="mb-4 flex gap-2"><Input id="admin-user-search" label="Search users" value={search} onChange={(e) => setSearch(e.target.value)} /><Button className="mt-6" onClick={load}>Search</Button></div>{error && <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}<DataTable rowKey="_id" rows={users} columns={[{ key: "name", label: "Name" }, { key: "email", label: "Email" }, { key: "role", label: "Role" }, { key: "isActive", label: "Status", render: (user) => <StatusBadge status={user.isActive ? "Active" : "Inactive"} /> }, { key: "actions", label: "Actions", render: (user) => <Button size="sm" variant="secondary" onClick={() => toggle(user)}>{user.isActive ? "Deactivate" : "Activate"}</Button> }]} /></div>;
}
