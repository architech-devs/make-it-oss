import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ThemeProvider } from "@/components/Theme/theme-provider"
import Landing from "./pages/Landing"

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App