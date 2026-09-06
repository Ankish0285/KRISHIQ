import { createContext, useContext, useMemo, useState } from "react";
import { authApi } from "../api/authApi.js";
import { STORAGE_KEYS, readJSON, writeJSON } from "../utils/storage.js";

const AuthContext = createContext(null);

const ROLE_HOME = {
  farmer: "/farmer/dashboard",
  buyer: "/buyer/dashboard",
  fpo: "/fpo/dashboard",
  admin: "/admin/dashboard",
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => readJSON(STORAGE_KEYS.user, null));
  const [loading, setLoading] = useState(false);

  const persist = (user) => {
    setCurrentUser(user);
    if (user) writeJSON(STORAGE_KEYS.user, user);
    else localStorage.removeItem(STORAGE_KEYS.user);
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { user } = await authApi.login(credentials);
      persist(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { user } = await authApi.register(payload);
      persist(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => persist(null);

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      login,
      register,
      logout,
      homeFor: (role) => ROLE_HOME[role] || "/",
    }),
    [currentUser, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
