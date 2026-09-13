import { createContext, useContext, useMemo, useState } from "react";
import { authApi } from "../api/authApi.js";
import { STORAGE_KEYS, readJSON, writeJSON } from "../utils/storage.js";

const AuthContext = createContext(null);

export const ROLE_HOME = {
  farmer: "/farmer/dashboard",
  seller: "/farmer/dashboard",
  buyer: "/buyer/dashboard",
  fpo: "/fpo/dashboard",
  admin: "/admin/dashboard",
  super_admin: "/admin/dashboard",
  superadmin: "/admin/dashboard",
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => readJSON(STORAGE_KEYS.user, null));
  const [loading, setLoading] = useState(false);

  const persist = (user, token = null) => {
    setCurrentUser(user);

    if (user) {
      writeJSON(STORAGE_KEYS.user, user);
      if (token) {
        localStorage.setItem("krishiq_token", token);
      }
    } else {
      localStorage.removeItem(STORAGE_KEYS.user);
      localStorage.removeItem("krishiq_token");
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const result = await authApi.login(credentials);
      if (result.requiresOtp) return result;
      const { user, token } = result;
      persist(user, token);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const verifyLoginOtp = async (credentials) => {
    setLoading(true);
    try {
      const { user, token } = await authApi.verifyLoginOtp(credentials);
      persist(user, token);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (email) => {
    setLoading(true);
    try {
      return await authApi.sendOtp(email);
    } finally {
      setLoading(false);
    }
  };

  const signupWithOtp = async (payload) => {
    setLoading(true);
    try {
      const { user, token } = await authApi.verifySignupOtp(payload.email, payload.otp);
      persist(user, token);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const sendSignupOtp = async (payload) => {
    setLoading(true);
    try { return await authApi.sendSignupOtp(payload); } finally { setLoading(false); }
  };
  const sendPasswordResetOtp = async (email) => {
    setLoading(true);
    try { return await authApi.sendPasswordResetOtp(email); } finally { setLoading(false); }
  };
  const verifyPasswordResetOtp = async (email, otp) => {
    setLoading(true);
    try { return await authApi.verifyPasswordResetOtp(email, otp); } finally { setLoading(false); }
  };
  const resetPassword = async (payload) => {
    setLoading(true);
    try {
      const { user, token } = await authApi.resetPassword(payload);
      persist(user, token);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { user, token } = await authApi.register(payload);
      persist(user, token);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => persist(null, null);
  const updateCurrentUser = (user) => persist(user);

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      login,
      verifyLoginOtp,
      sendOtp,
      sendSignupOtp,
      signupWithOtp,
      sendPasswordResetOtp,
      verifyPasswordResetOtp,
      resetPassword,
      register,
      logout,
      updateCurrentUser,
      homeFor: (role) => ROLE_HOME[String(role || "").toLowerCase()] || "/",
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
