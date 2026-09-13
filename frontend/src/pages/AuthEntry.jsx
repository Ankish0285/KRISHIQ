import { useLocation, useNavigate } from "react-router-dom";
import AuthModal from "../components/common/AuthModal.jsx";

export default function AuthEntry() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialTab = location.pathname === "/register" ? "signup" : "login";

  return <AuthModal open initialTab={initialTab} onClose={() => navigate("/")} />;
}
