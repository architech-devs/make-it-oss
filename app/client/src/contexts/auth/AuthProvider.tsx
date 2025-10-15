import { useState, useEffect} from "react";
import { AuthContext } from "./AuthContext";
import type { User} from "../auth/AuthContext";
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);


  useEffect(() => {
    fetch('http://localhost:3000/api/auth/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user || null))
  }, []);

  const login = () => (window.location.href = 'http://localhost:3000/api/auth/github/');
  const logout = async () => {
    await fetch('http://localhost:3000/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};