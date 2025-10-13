import DocsLayout from '@/components/Docs/DocsLayout'
import DocsContent from '@/components/Docs/DocsContent'
import { docsSections } from '@/components/Docs/Content/content'
import { useEffect } from 'react'

const Docs = () => {
  // SEO optimization
  useEffect(() => {
    document.title = 'Make-It-OSS Documentation - Transform Your Repository into Open Source Success'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Comprehensive documentation for Make-It-OSS - AI-powered platform for analyzing repositories, generating community files, and transforming projects into successful open source initiatives.')
    }
    
    // Add structured data for better SEO
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      'headline': 'Make-It-OSS Documentation',
      'description': 'Complete guide to using Make-It-OSS for open source project transformation',
      'author': {
        '@type': 'Organization',
        'name': 'Make-It-OSS'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Make-It-OSS'
      },
      'dateModified': new Date().toISOString().split('T')[0]
    }
    
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(structuredData)
    document.head.appendChild(script)
    
    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return (
    <DocsLayout sections={docsSections}>
      <div className="docs-content">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Make-It-OSS Documentation
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your comprehensive guide to transforming repositories into thriving open source projects with AI-powered analysis and community best practices.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <a 
              href="#getting-started" 
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Get Started
            </a>
            <a 
              href="#what-is-make-it-oss" 
              className="px-6 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors font-medium"
            >
              Learn More
            </a>
          </div>
        </div>
        
        {/* Quick Navigation */}
        <div className="mb-12 p-6 bg-muted/30 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {docsSections.slice(0, 6).map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-background transition-colors group"
              >
                <span className="text-xs font-mono text-muted-foreground group-hover:text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-medium group-hover:text-primary transition-colors">
                  {section.title}
                </span>
              </a>
            ))}
          </div>
        </div>
        
        {/* Main Content */}
        <DocsContent sections={docsSections} />
        
        {/* Footer CTA */}
        <div className="mt-16 p-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Repository?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start your open source journey today with Make-It-OSS's AI-powered analysis and recommendations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://github.com/architech-devs/make-it-oss" 
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
            <a 
              href="https://discord.gg/r9jzAFU3FM" 
              className="px-6 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Discord
            </a>
          </div>
        </div>
      </div>
    </DocsLayout>
  )
}

export default Docs
