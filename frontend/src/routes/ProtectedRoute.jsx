import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { ROLE_HOME } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ roles }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  const role = String(currentUser.role || "").toLowerCase();
  const hasRole = roles?.includes(role) || (role === "super_admin" && roles?.includes("admin"));
  if (roles && !hasRole) {
    return <Navigate to={ROLE_HOME[role] || "/"} replace />;
  }
  return <Outlet />;
}
