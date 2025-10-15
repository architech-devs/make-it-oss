import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ThemeProvider } from "@/components/Theme/theme-provider"
import Landing from "@/pages/Landing"
import Docs from "@/pages/Docs"
import Dashboard from "./pages/Dashboard"
import { AuthProvider } from "./contexts/auth/AuthProvider"

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App