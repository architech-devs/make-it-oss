import { useState, useEffect, useMemo, useRef } from 'react'
import { Menu, X, ExternalLink, Github, Twitter, MessageCircle, ChevronUp, Youtube, Mail } from 'lucide-react'
import Navbar from '@/components/Layout/Navbar'
import type { TDocSection } from './Content/content'

interface DocsLayoutProps {
  sections: TDocSection[]
  children: React.ReactNode
}

const DocsLayout = ({ sections, children }: DocsLayoutProps) => {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Handle intersection observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1))
        if (visible[0]) {
          const id = visible[0].target.getAttribute('id')
          if (id) setActiveId(id)
        }
      },
      { root: null, rootMargin: '0px 0px -70% 0px', threshold: [0, 1] }
    )

    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections])

  // Handle scroll progress and scroll-to-top button visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(Math.min(progress, 100))
      
      // Show scroll-to-top button when scrolled down more than 400px
      setShowScrollTop(scrollTop > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavigation = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setIsSidebarOpen(false) // Close sidebar on mobile after navigation
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const socialLinks = [
    { icon: Github, href: 'https://github.com/architech-devs/make-it-oss', label: 'GitHub Repository' },
    { icon: Twitter, href: 'https://twitter.com/architech_dev', label: 'Follow on Twitter' },
    { icon: MessageCircle, href: 'https://discord.gg/r9jzAFU3FM', label: 'Join Discord Community' },
    { icon: Youtube, href: 'https://youtube.com/channel/UC8LedUlToF1oO3E3NZG46aw', label: 'YouTube Channel' },
    { icon: Mail, href: 'mailto:architech.devs@gmail.com', label: 'Email Support' }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Main Navbar */}
      <div className="sticky top-0 z-50 backdrop-blur py-2 bg-background/95 border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <Navbar />
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
        <div 
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

        {/* Mobile header */}
      <div className="lg:hidden sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold text-foreground">Make-It-OSS Docs</h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-muted/50 transition-colors text-foreground"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-background/95 backdrop-blur-sm border-r border-border overflow-y-auto
          transform transition-transform duration-300 ease-in-out shadow-sm lg:shadow-none
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6">
            {/* Logo and title */}
            <div className="mb-8">
              <div className="mb-2">
                <h2 className="font-bold text-lg text-foreground">Make-It-OSS</h2>
                <p className="text-xs text-muted-foreground">Documentation</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Contents
              </h3>
              {sections.map((section, index) => {
                const isActive = section.id === activeId
                return (
                  <button
                    key={section.id}
                    onClick={() => handleNavigation(section.id)}
                    className={`
                      w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 text-sm
                      ${isActive
                        ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary'
                        : 'hover:bg-muted/50 text-foreground hover:text-primary'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>{section.title}</span>
                    </div>
                  </button>
                )
              })}
            </nav>

            {/* Social links */}
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Community
              </h3>
              <div className="space-y-2">
                {socialLinks.map((link) => {
                  const Icon = link.icon
                  const isMailOrYoutube = Icon === Mail || Icon === Youtube
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-sm text-muted-foreground hover:text-foreground ${isMailOrYoutube ? '!text-muted-foreground hover:!text-foreground' : ''}`}
                    >
                      <Icon className={`h-4 w-4 ${isMailOrYoutube ? '!text-muted-foreground' : ''}`} />
                      <span>{link.label}</span>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Version info */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="text-xs text-muted-foreground">
                <div className="mb-1">Version 2.0.0</div>
                <div>Updated: {new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 lg:ml-0">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
            {children}
          </div>
        </main>

        {/* Table of contents - desktop only */}
        <aside className="hidden xl:block w-64 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              On this page
            </h3>
            <nav className="space-y-1">
              {sections.find(s => s.id === activeId)?.blocks
                ?.filter(block => block.type === 'heading' || block.type === 'subheading')
                ?.map((block, index) => (
                  <button
                    key={index}
                      className={`
                      w-full text-left text-sm py-1 px-2 rounded transition-colors
                      ${block.type === 'heading' ? 'font-medium text-foreground' : 'text-muted-foreground pl-4'}
                      hover:text-primary hover:bg-muted/30
                    `}
                  >
                    {block.text}
                  </button>
                ))}
            </nav>
            
            {/* Quick links */}
            <div className="pt-6 border-t border-border">
              <h4 className="text-sm font-semibold mb-3 text-foreground">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Edit this page</a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Report an issue</a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Suggest changes</a>
              </div>
            </div>
          </div>
        </aside>
      </div>
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={
            "fixed bottom-8 right-8 z-40 p-3 bg-primary text-primary-foreground rounded-full shadow-lg " +
            "hover:bg-primary/90 hover:shadow-xl transform hover:scale-105 transition-all duration-200 " +
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 " +
            "animate-in fade-in slide-in-from-bottom-2"
          }
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

export default DocsLayout
