import { useState } from 'react'
import { Play, Pause, RotateCcw, ExternalLink, Zap } from 'lucide-react'

interface InteractiveDemoProps {
  title: string
  description: string
  demoType: 'repository-analysis' | 'scoring' | 'recommendations'
}

const InteractiveDemo = ({ title, description, demoType }: InteractiveDemoProps) => {
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [repoUrl, setRepoUrl] = useState('https://github.com/facebook/react')

  const repositoryAnalysisSteps = [
    { title: 'Fetching Repository Data', description: 'Connecting to GitHub API...', duration: 1000 },
    { title: 'Analyzing Code Structure', description: 'Scanning files and directories...', duration: 1500 },
    { title: 'AI Analysis', description: 'Processing with Gemini AI...', duration: 2000 },
    { title: 'Generating Recommendations', description: 'Creating personalized suggestions...', duration: 1000 },
    { title: 'Complete!', description: 'Analysis ready for review', duration: 500 }
  ]

  const scoringData = {
    'Code Quality': { score: 85, color: 'bg-green-500' },
    'Documentation': { score: 72, color: 'bg-yellow-500' },
    'Community': { score: 95, color: 'bg-green-500' },
    'Maintenance': { score: 78, color: 'bg-green-500' },
    'Security': { score: 90, color: 'bg-green-500' }
  }

  const recommendations = [
    { type: 'Documentation', title: 'Add API documentation', priority: 'High', icon: '📖' },
    { type: 'Community', title: 'Create issue templates', priority: 'Medium', icon: '🤝' },
    { type: 'Security', title: 'Enable dependency scanning', priority: 'High', icon: '🔒' },
    { type: 'Maintenance', title: 'Setup automated testing', priority: 'Medium', icon: '🔧' }
  ]

  const runDemo = async () => {
    setIsRunning(true)
    setCurrentStep(0)
    
    for (let i = 0; i < repositoryAnalysisSteps.length; i++) {
      setCurrentStep(i)
      await new Promise(resolve => setTimeout(resolve, repositoryAnalysisSteps[i].duration))
    }
    
    setIsRunning(false)
  }

  const resetDemo = () => {
    setIsRunning(false)
    setCurrentStep(0)
  }

  const renderRepositoryAnalysis = () => (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <input
          type="url"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="Enter GitHub repository URL"
          className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
          disabled={isRunning}
        />
        <button
          onClick={isRunning ? resetDemo : runDemo}
          disabled={isRunning && currentStep < repositoryAnalysisSteps.length - 1}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isRunning ? (
            currentStep < repositoryAnalysisSteps.length - 1 ? (
              <>
                <Pause className="h-4 w-4" />
                Running...
              </>
            ) : (
              <>
                <RotateCcw className="h-4 w-4" />
                Reset
              </>
            )
          ) : (
            <>
              <Play className="h-4 w-4" />
              Analyze
            </>
          )}
        </button>
      </div>

      {(isRunning || currentStep > 0) && (
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          {repositoryAnalysisSteps.map((step, index) => (
            <div key={index} className={`flex items-center gap-3 p-2 rounded transition-all ${
              index === currentStep ? 'bg-primary/10 border-l-4 border-primary' :
              index < currentStep ? 'bg-green-50 border-l-4 border-green-500 opacity-75' :
              'opacity-40'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                index < currentStep ? 'bg-green-500' :
                index === currentStep ? 'bg-primary animate-pulse' :
                'bg-muted-foreground/30'
              }`} />
              <div>
                <div className="font-medium text-sm">{step.title}</div>
                <div className="text-xs text-muted-foreground">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {currentStep === repositoryAnalysisSteps.length - 1 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <Zap className="h-4 w-4" />
            <span className="font-semibold">Analysis Complete!</span>
          </div>
          <p className="text-sm text-green-600">
            Your repository has been analyzed. View the detailed report and recommendations below.
          </p>
        </div>
      )}
    </div>
  )

  const renderScoring = () => (
    <div className="space-y-4">
      <div className="grid gap-4">
        {Object.entries(scoringData).map(([category, data]) => (
          <div key={category} className="flex items-center justify-between p-3 border border-border rounded-lg">
            <span className="font-medium">{category}</span>
            <div className="flex items-center gap-3">
              <div className="w-24 bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${data.color} transition-all duration-1000`}
                  style={{ width: `${data.score}%` }}
                />
              </div>
              <span className="font-semibold text-sm w-8">{data.score}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center pt-4">
        <div className="text-2xl font-bold text-primary">84</div>
        <div className="text-sm text-muted-foreground">Overall OSS Readiness Score</div>
      </div>
    </div>
  )

  const renderRecommendations = () => (
    <div className="space-y-3">
      {recommendations.map((rec, index) => (
        <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
          <span className="text-2xl">{rec.icon}</span>
          <div className="flex-1">
            <div className="font-medium">{rec.title}</div>
            <div className="text-sm text-muted-foreground">{rec.type}</div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            rec.priority === 'High' ? 'bg-red-100 text-red-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {rec.priority}
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </div>
      ))}
    </div>
  )

  const renderDemo = () => {
    switch (demoType) {
      case 'repository-analysis':
        return renderRepositoryAnalysis()
      case 'scoring':
        return renderScoring()
      case 'recommendations':
        return renderRecommendations()
      default:
        return null
    }
  }

  return (
    <div className="border border-border rounded-lg p-6 bg-background">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      
      {renderDemo()}
      
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          💡 This is a simulated demo. Try it with your own repository at{' '}
          <a href="https://make-it-oss.architech-dev.tech/" className="text-primary hover:underline">make-it-oss.architech-dev.tech</a>
        </p>
      </div>
    </div>
  )
}

export default InteractiveDemo
