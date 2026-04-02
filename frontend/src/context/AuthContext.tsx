import { createContext, useContext, useEffect, useState } from "react";

type UserRole = "patient" | "doctor" | "admin";

type User = {
  id: number;
  username: string;
  email?: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  role: UserRole;
  patient_id?: number | null;
  doctor_id?: number | null;
};

type LoginResponse = {
  message?: string;
  access: string;
  refresh: string;
  user?: {
    id: number;
    username: string;
    role: UserRole;
    first_name: string;
    last_name: string;
  };
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  login: (tcNoOrUsername: string, password: string) => Promise<void>;
  logout: () => void;
  accessToken: string | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Bunu localhost yap
const API_BASE = "http://localhost:8000/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("access")
  );
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  async function fetchMe(token: string): Promise<User> {
    const res = await fetch(`${API_BASE}/users/me/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.detail || "Kullanıcı bilgisi alınamadı.");
    }

    return data;
  }

  useEffect(() => {
    async function init() {
      const token = localStorage.getItem("access");

      if (!token) {
        setInitialized(true);
        return;
      }

      try {
        setLoading(true);
        const me = await fetchMe(token);
        setUser(me);
        setAccessToken(token);
      } catch (err) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    }

    init();
  }, []);

  async function login(tcNoOrUsername: string, password: string) {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/users/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: tcNoOrUsername,
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            data?.non_field_errors?.[0] ||
            "Giriş başarısız"
        );
      }

      const typedData = data as LoginResponse;

      localStorage.setItem("access", typedData.access);
      localStorage.setItem("refresh", typedData.refresh);
      setAccessToken(typedData.access);

      const me = await fetchMe(typedData.access);
      setUser(me);
    } catch (error) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setUser(null);
      setAccessToken(null);
      throw error;
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    setAccessToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initialized,
        login,
        logout,
        accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}