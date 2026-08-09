import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("gh_user")) || null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("gh_token") || null);
  const [loading, setLoading] = useState(!!localStorage.getItem("gh_token"));

  const saveSession = useCallback((t, u) => {
    localStorage.setItem("gh_token", t);
    localStorage.setItem("gh_user", JSON.stringify(u));
    setToken(t);
    setUser(u);
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/profile");
      setUser(data);
      localStorage.setItem("gh_user", JSON.stringify(data));
      return data;
    } catch {
      return null;
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    saveSession(data.token, data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    saveSession(data.token, data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      if (token) await api.get("/auth/logout");
    } catch {
      /* ignore */
    }
    localStorage.removeItem("gh_token");
    localStorage.removeItem("gh_user");
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const { data } = await api.put("/auth/profile", payload);
    setUser(data.user);
    localStorage.setItem("gh_user", JSON.stringify(data.user));
    return data.user;
  };

  useEffect(() => {
    if (loading) {
      fetchProfile().finally(() => setLoading(false));
    }
  }, [loading, fetchProfile]);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, fetchProfile, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}