"use client"

import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

type AuthContextType = {
  username: string | null;
  token: string | null;
  login: (user: { username: string }, token: string) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // delay UI until we validate

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken || !storedUser) {
      logout();
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(storedUser);
      setUsername(parsed.username);
      setToken(storedToken);

      // Verify token with backend
      fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Invalid token");
          return res.json();
        })
        .then((data) => {
          setUsername(data.user.username);
        })
        .catch(() => {
          logout(); // ⬅ auto-clear on invalid token
        })
        .finally(() => setLoading(false));
    } catch {
      logout();
      setLoading(false);
    }
  }, []);

  const login = (user: { username: string }, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUsername(user.username);
    setToken(token);
    toast.success('Login successful!')
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUsername(null);
    setToken(null);
    toast.success('Logged out successfully!')
  };

  return (
    <AuthContext.Provider value={{ username, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
