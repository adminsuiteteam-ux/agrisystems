import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { apiRequest } from "../lib/api";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: "household" | "leader" | "farmer" | "admin";
  phone?: string;
  location?: string;
  avatarUrl?: string;
  trustScore?: number;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; fullName: string; role: string; phone?: string; location?: string }) => Promise<void>;
  logout: () => void;
  setUser: (u: UserProfile | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user for initial guest experience
const defaultGuestUser: UserProfile = {
  id: "demo-user-001",
  email: "household@agrosystems.ng",
  fullName: "Amina Okoro",
  role: "household",
  phone: "+234 802 345 6789",
  location: "Bodija, Ibadan",
  trustScore: 98,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("agrosystem_token"));
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("agrosystem_user");
    return saved ? JSON.parse(saved) : defaultGuestUser;
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      setLoading(true);
      apiRequest<UserProfile>("/auth/me")
        .then((profile) => {
          setUser(profile);
          localStorage.setItem("agrosystem_user", JSON.stringify(profile));
        })
        .catch(() => {
          // Token invalid or backend offline, keep current user
        })
        .finally(() => setLoading(false));
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const data = await apiRequest<{ token: string; user: UserProfile }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("agrosystem_token", data.token);
    localStorage.setItem("agrosystem_user", JSON.stringify(data.user));
  };

  const register = async (formData: { email: string; password: string; fullName: string; role: string; phone?: string; location?: string }) => {
    const data = await apiRequest<{ token: string; user: UserProfile }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("agrosystem_token", data.token);
    localStorage.setItem("agrosystem_user", JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("agrosystem_token");
    localStorage.removeItem("agrosystem_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
