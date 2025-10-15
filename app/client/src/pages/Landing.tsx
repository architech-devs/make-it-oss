import { useState, useEffect } from 'react'
import Footer from '@/components/Footer/Footer'
import GithubInput from '@/components/GithubInput/GithubInput'
import Hero from '@/components/Hero/Hero'
import Navbar from '@/components/Layout/Navbar'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import type { FileStatus } from '@/utils/api'
import LoginButton from '@/components/auth/LoginButton'

const Landing = () => {
    const [showFiles, setShowFiles] = useState(false)
    const [files, setFiles] = useState<FileStatus[] | null>(null)

    const handleFilesReady = (filesList: FileStatus[]) => {
        setFiles(filesList)
        setShowFiles(true)
    }

    const handleBackToHero = () => {
        setShowFiles(false)
        setFiles(null)
    }

    // Scroll to top when going back to hero
    useEffect(() => {
        if (!showFiles) {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }, [showFiles])

    return (
        <div className="flex flex-col min-h-screen max-w-2xl mx-auto pt-2">
            <div className="sticky top-0 z-50 backdrop-blur py-2 bg-background/80">
                <Navbar />
            </div>
            <div className=' flex justify-end'>
                <LoginButton/>
                
            </div>
            
            {/* Main content area with slide-up transition */}
            <div 
                className={`transition-all duration-300 ease-out ${
                    showFiles ? 'space-y-4' : 'space-y-20'
                }`}
            >
                {/* Back button - shows when files are visible */}
                {showFiles && (
                    <div className="px-4 md:px-0 animate-in fade-in duration-300">
                        <Button 
                            variant="ghost" 
                            onClick={handleBackToHero}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                    </div>
                )}
                
                {/* Hero section - slides up and fades out */}
                <div 
                    className={`transition-all duration-300 ease-out ${
                        showFiles 
                            ? 'opacity-0 -translate-y-full h-0 overflow-hidden pointer-events-none' 
                            : 'opacity-100 translate-y-0 h-auto'
                    }`}
                >
                    <Hero />
                </div>
                
                {/* GitHub input - hidden when files are shown */}
                <div 
                    className={`transition-all duration-300 ease-out ${
                        showFiles 
                            ? 'opacity-0 -translate-y-full h-0 overflow-hidden pointer-events-none' 
                            : 'opacity-100 translate-y-0 h-auto'
                    }`}
                >
                    <GithubInput onFilesReady={handleFilesReady} />
                </div>
                
                {/* Files section - only shown when files are ready */}
                {showFiles && files && (
                    <div className="px-4 md:px-0">
                        <GithubInput filesOnly files={files} />
                    </div>
                )}
            </div>
            
            <div className="mt-auto pt-20">
                <Footer />
            </div>
        </div>
    )
}

export default Landing