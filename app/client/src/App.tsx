import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider as CustomThemeProvider } from "@/components/Theme/theme-provider";
import Landing from "@/pages/Landing";
import Docs from "@/pages/Docs";
import AdminDashboard from "@/pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "@/components/Admin/ProtectedRoute";
import { AdminProvider } from "@/contexts/AdminContext";

const App = () => {
  return (
    <BrowserRouter>
      <CustomThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AdminProvider>
          <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        </AdminProvider>
      </CustomThemeProvider>
    </BrowserRouter>
  );
};

export default App;
