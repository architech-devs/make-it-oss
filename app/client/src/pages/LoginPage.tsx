import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../contexts/AdminContext";
import { Button } from "../components/ui/button";

const LoginPage: React.FC = () => {
  const [token, setToken] = useState("");
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (token.trim()) {
      try {
        const response = await fetch("http://localhost:5000/admin-auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: token.trim() }),
        });
        if (response.ok) {
          login(token.trim());
          navigate("/admin/dashboard");
        } else {
          alert("Invalid admin token.");
        }
      } catch (err) {
        alert("Error connecting to server.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 bg-background rounded-lg border shadow-md mt-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter admin token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          className="w-full rounded border px-3 py-2 bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button type="submit" className="w-full" size="lg">
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
