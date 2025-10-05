import Footer from '@/components/Footer/Footer'
import GithubInput from '@/components/GithubInput/GithubInput'
import Hero from '@/components/Hero/Hero'
import Navbar from '@/components/Layout/Navbar'

const Landing = () => {
    return (
        <div className="flex flex-col min-h-screen max-w-2xl mx-auto pt-2 space-y-20">
            <div className="sticky top-0 z-50 backdrop-blur py-2">
                <Navbar />
            </div>
            <Hero />
            <GithubInput />
            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    )
}

export default Landing