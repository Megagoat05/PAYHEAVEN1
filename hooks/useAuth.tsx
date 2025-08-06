import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id?: number;
  email: string;
  username: string;
  language: string;
  timezone: string;
  is2FAEnabled: boolean;
  balance: number;
  frozen: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (
    email: string,
    token: string,
    balance: number,
    extras?: Partial<User>
  ) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  refreshUserFromServer: () => Promise<void>;
  purchase: (price: number) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  /** --- fetch /me to ensure balance is always current --- */
  const refreshUserFromServer = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch /me");
      const data = await res.json();
      const freshUser: User = {
        id: data.id,
        email: data.email,
        username: data.email.split("@")[0],
        language: "en-US",
        timezone: "UTC",
        is2FAEnabled: false,
        balance: data.balance,
        frozen: data.frozen,
      };
      setUser(freshUser);
      localStorage.setItem("authUser", JSON.stringify(freshUser));
    } catch (e) {
      console.error("refreshUserFromServer error:", e);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
      refreshUserFromServer(); // Force-sync balance with DB
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (
    email: string,
    tokenFromApi: string,
    balance: number,
    extras: Partial<User> = {}
  ) => {
    const newUser: User = {
      id: extras.id,
      email,
      username: extras.username ?? email.split("@")[0],
      language: extras.language ?? "en-US",
      timezone: extras.timezone ?? "UTC",
      is2FAEnabled: extras.is2FAEnabled ?? false,
      balance: balance ?? 0,
      frozen: extras.frozen ?? false,
    };

    localStorage.setItem("authToken", tokenFromApi);
    localStorage.setItem("authUser", JSON.stringify(newUser));
    setUser(newUser);
    setToken(tokenFromApi);

    // Immediately refresh from backend
    await refreshUserFromServer();
  };

  /** --- Update password --- */
  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    if (!token) throw new Error("Not authenticated");
    const res = await fetch("http://localhost:5000/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to update password");
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser(null);
    setToken(null);
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    localStorage.setItem("authUser", JSON.stringify(updatedUser));
  };

  /** --- Purchase --- */
  const purchase = async (price: number): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch("http://localhost:5000/wallet/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ price }),
      });
      if (!res.ok) {
        console.error("Purchase failed");
        return false;
      }
      const data = await res.json();
      setUser((prev) => (prev ? { ...prev, balance: data.balance } : prev));
      localStorage.setItem(
        "authUser",
        JSON.stringify({ ...user, balance: data.balance })
      );
      return true;
    } catch (err) {
      console.error("Purchase error:", err);
      return false;
    }
  };

  const value: AuthContextType = {
    isAuthenticated: !!token,
    user,
    token,
    login,
    logout,
    updateUser,
    updatePassword,
    refreshUserFromServer,
    purchase,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
