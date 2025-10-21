import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider as CustomThemeProvider } from "@/components/Theme/theme-provider";
import { ThemeProvider as MuiThemeProvider, CssBaseline, createTheme } from "@mui/material";
import Landing from "@/pages/Landing";
import Docs from "@/pages/Docs";
import AdminDashboard from "@/pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "@/components/Admin/ProtectedRoute";

const muiTheme = createTheme({
  palette: {
    mode: "dark", // or you can dynamically make this "light" if you want
  },
});

const App = () => {
  return (
    <BrowserRouter>
      <CustomThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <MuiThemeProvider theme={muiTheme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<Landing />} />
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
        </MuiThemeProvider>
      </CustomThemeProvider>
    </BrowserRouter>
  );
};

export default App;
