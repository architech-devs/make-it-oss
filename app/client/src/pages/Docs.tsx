import DocsMain from "@/components/Docs/DocsMain"
import Footer from "@/components/Footer/Footer"
import Navbar from "@/components/Layout/Navbar"

const Docs = () => {
  return (
    <div className="flex flex-col min-h-screen max-w-2xl mx-auto pt-2 space-y-20">
      <div className="sticky top-0 z-50 backdrop-blur py-2">
        <Navbar />
      </div>
      <DocsMain />
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  )
}

export default Docs