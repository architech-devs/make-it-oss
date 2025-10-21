  import { useState } from "react";

  export function useAdminAuth() {
    const [token, setToken] = useState<string | null>(localStorage.getItem("admin_token"));

    function login(newToken: string) {
      setToken(newToken);
      localStorage.setItem("admin_token", newToken);
    }

    function logout() {
      setToken(null);
      localStorage.removeItem("admin_token");
    }

    function isAuthenticated() {
      return !!token;
    }

    return { token, login, logout, isAuthenticated };
  }
