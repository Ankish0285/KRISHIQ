import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function ProtectedRoute({ roles }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(currentUser.role)) {
    const homes = {
      farmer: "/farmer/dashboard",
      buyer: "/buyer/dashboard",
      fpo: "/fpo/dashboard",
      admin: "/admin/dashboard",
    };
    return <Navigate to={homes[currentUser.role] || "/"} replace />;
  }
  return <Outlet />;
}
