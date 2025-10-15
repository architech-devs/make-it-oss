import React, { createContext, useContext } from "react";
import { useAdminAuth } from "../hooks/useAdminAuth";

interface AdminContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAdminAuth();
  return <AdminContext.Provider value={auth}>{children}</AdminContext.Provider>;
};

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
}
