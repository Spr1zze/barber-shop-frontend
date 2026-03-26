import React, { createContext, useContext, useState } from "react";

export type UserRole = "customer" | "admin";

const FAKE_USERS = [
  {
    id: 1,
    email: "customer@example.com",
    password: "customer123",
    name: "John Customer",
    phone: "12345678",
    role: "customer" as UserRole,
  },
  {
    id: 2,
    email: "admin@example.com",
    password: "admin123",
    name: "Jane Admin",
    phone: "87654321",
    role: "admin" as UserRole,
  },
];

interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    const foundUser = FAKE_USERS.find(
      (u) => u.email === email && u.password === password,
    );

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isCustomer: user?.role === "customer",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
