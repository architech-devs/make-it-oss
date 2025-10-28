import { useState, useEffect} from "react";
import { AuthContext } from "./AuthContext";
import type { User} from "../auth/AuthContext";
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const api=import.meta.env.VITE_BACKEND_URL;



  useEffect(() => {
    fetch(`${api}/api/auth/me`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user || null))
  }, []);

  const login = () => (window.location.href = `${api}/api/auth/github/`);
  const logout = async () => {
    await fetch(`${api}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};