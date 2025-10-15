import React from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated()) {
    // If not logged in, redirect to login page
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated, render the requested component
  return children;
};

export default ProtectedRoute;
