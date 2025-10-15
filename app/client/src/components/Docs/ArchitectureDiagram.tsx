import { useState } from 'react'
import { GitBranch, Server, Database, Brain, Users, Globe } from 'lucide-react'

const ArchitectureDiagram = () => {
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null)

  const components = [
    {
      id: 'frontend',
      name: 'Frontend (React)',
      icon: Globe,
      description: 'User interface built with React, TypeScript, and Tailwind CSS',
      position: { x: 50, y: 20 },
      color: 'bg-blue-500'
    },
    {
      id: 'api',
      name: 'API Server',
      icon: Server,
      description: 'Express.js REST API handling repository analysis requests',
      position: { x: 50, y: 50 },
      color: 'bg-green-500'
    },
    {
      id: 'github',
      name: 'GitHub API',
      icon: GitBranch,
      description: 'Integration with GitHub for repository data and metadata',
      position: { x: 15, y: 50 },
      color: 'bg-purple-500'
    },
    {
      id: 'ai',
      name: 'Gemini AI',
      icon: Brain,
      description: 'AI-powered analysis and recommendation engine',
      position: { x: 85, y: 50 },
      color: 'bg-orange-500'
    },
    {
      id: 'database',
      name: 'Database',
      icon: Database,
      description: 'Repository analysis cache and user data storage',
      position: { x: 50, y: 80 },
      color: 'bg-red-500'
    },
    {
      id: 'community',
      name: 'Community Hub',
      icon: Users,
      description: 'Repository showcase and community features',
      position: { x: 20, y: 80 },
      color: 'bg-indigo-500'
    }
  ]

  const connections = [
    { from: 'frontend', to: 'api' },
    { from: 'api', to: 'github' },
    { from: 'api', to: 'ai' },
    { from: 'api', to: 'database' },
    { from: 'api', to: 'community' }
  ]

  const getComponentById = (id: string) => components.find(c => c.id === id)

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-muted/20 to-muted/5 rounded-lg border">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-semibold mb-2">Make-It-OSS Architecture</h3>
        <p className="text-muted-foreground">Interactive system overview - hover over components to learn more</p>
      </div>
      
      <div className="relative h-96 bg-background/50 rounded-lg border-2 border-dashed border-border p-4">
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {connections.map((conn, idx) => {
            const from = getComponentById(conn.from)
            const to = getComponentById(conn.to)
            if (!from || !to) return null
            
            const x1 = (from.position.x / 100) * 100 + '%'
            const y1 = (from.position.y / 100) * 100 + '%'
            const x2 = (to.position.x / 100) * 100 + '%'
            const y2 = (to.position.y / 100) * 100 + '%'
            
            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="text-muted-foreground/30"
              />
            )
          })}
        </svg>
        
        {/* Components */}
        {components.map((component) => {
          const Icon = component.icon
          const isHovered = hoveredComponent === component.id
          
          return (
            <div
              key={component.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200"
              style={{ 
                left: `${component.position.x}%`, 
                top: `${component.position.y}%`,
                zIndex: isHovered ? 50 : 2
              }}
              onMouseEnter={() => setHoveredComponent(component.id)}
              onMouseLeave={() => setHoveredComponent(null)}
            >
              <div className={`
                flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200
                ${isHovered 
                  ? 'bg-background shadow-2xl scale-110 border-primary' 
                  : 'bg-background/80 border-border hover:border-border/60'
                }
              `}>
                <div className={`
                  p-3 rounded-full text-white mb-2 transition-all duration-200
                  ${component.color}
                  ${isHovered ? 'scale-110' : ''}
                `}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-center whitespace-nowrap">
                  {component.name}
                </span>
              </div>
              
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 w-64 p-3 bg-popover text-popover-foreground rounded-lg shadow-xl border border-border backdrop-blur-sm" style={{ zIndex: 60 }}>
                  <p className="text-sm leading-relaxed">{component.description}</p>
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-popover border-l border-t border-border rotate-45"></div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
        {components.map((component) => {
          const Icon = component.icon
          return (
            <div key={component.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
              <div className={`p-1.5 rounded-full text-white ${component.color}`}>
                <Icon className="h-3 w-3" />
              </div>
              <span className="text-xs font-medium">{component.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ArchitectureDiagram
