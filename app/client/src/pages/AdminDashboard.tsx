import React from "react";
import { useAdmin } from "../contexts/AdminContext";
import SubmissionTable from "../components/Admin/SubmissionTable";
import { Container, Box, Typography, Button, Paper } from "@mui/material";

const AdminDashboard: React.FC = () => {
  const { logout } = useAdmin();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Admin Dashboard
          </Typography>
          <Button variant="outlined" color="error" size="large" onClick={logout}>
            Logout
          </Button>
        </Box>
        <Typography variant="subtitle1" mb={2}>
          Welcome to the admin area for managing showcase submissions.
        </Typography>
        <SubmissionTable />
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
