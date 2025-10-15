import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../contexts/AdminContext";

const LoginPage: React.FC = () => {
  const [token, setToken] = useState("");
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (token.trim()) {
      login(token.trim()); // Save token and mark authenticated
      navigate("/admin/dashboard"); // Redirect to dashboard
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter admin token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          style={{
            width: "100%",
            padding: 8,
            marginBottom: 12,
            fontSize: 16,
          }}
        />
        <button type="submit" style={{ padding: 10, fontSize: 16, width: "100%" }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
