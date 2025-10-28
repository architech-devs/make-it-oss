import React from "react";
import { useAdmin } from "../contexts/AdminContext";
import SubmissionTable from "../components/Admin/SubmissionTable";
import { Button } from "../components/ui/button"; // adjust relative path if needed

const AdminDashboard: React.FC = () => {
  const { logout } = useAdmin();

  return (
    <div className="max-w-5xl mx-auto mt-8 mb-8 px-2">
      <div className="bg-background rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-5 gap-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="destructive" size="lg" onClick={logout}>
            Logout
          </Button>
        </div>
        <div className="text-lg mb-6">
          Welcome to the admin area for managing showcase submissions.
        </div>
        <SubmissionTable />
      </div>
    </div>
  );
};

export default AdminDashboard;
