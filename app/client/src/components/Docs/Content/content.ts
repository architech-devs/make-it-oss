export type DocBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'code'; language: string; code: string; title?: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'link'; text: string; href: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'demo'; demoType: 'repository-analysis' | 'scoring' | 'recommendations'; title: string; description: string }
  | { type: 'architecture'; }
  | { type: 'callout'; variant: 'info' | 'warning' | 'success' | 'error'; title?: string; text: string }
  | { type: 'feature-grid'; features: Array<{ icon: string; title: string; description: string; href?: string }> }

export interface DocSection {
  id: string;
  title: string;
  blocks: DocBlock[];
}

export const docsSections: DocSection[] = [
  {
    id: 'what-is-make-it-oss',
    title: 'What is Make-It-OSS?',
    blocks: [
      {
        type: 'paragraph',
        text: 'Make-It-OSS is a comprehensive platform designed to help developers, maintainers, and organizations transform their repositories into thriving open source projects. We combine AI-powered analysis, community best practices, and automated tooling to make open source accessible to everyone.'
      },
      {
        type: 'heading',
        text: 'Our Mission'
      },
      {
        type: 'paragraph',
        text: 'To democratize open source contribution by providing intelligent tools that guide developers through the journey from private code to public collaboration. We believe every great project deserves the opportunity to become a successful open source initiative.'
      },
      {
        type: 'heading',
        text: 'Problems We Solve'
      },
      {
        type: 'list',
        items: [
          'Uncertainty about open source readiness - "Is my code ready to be shared?"',
          'Missing or inadequate community files (README, CONTRIBUTING, CODE_OF_CONDUCT)',
          'Lack of documentation and project structure',
          'Security and licensing concerns',
          'No clear path from private to public repository',
          'Difficulty in building and engaging a community'
        ]
      },
      {
        type: 'heading',
        text: 'Target Audience'
      },
      {
        type: 'feature-grid',
        features: [
          {
            icon: '👨‍💻',
            title: 'Individual Developers',
            description: 'Developers looking to open source their personal projects and build their reputation in the community.'
          },
          {
            icon: '🛠️',
            title: 'Project Maintainers',
            description: 'Existing project maintainers seeking to improve their open source practices and community engagement.'
          },
          {
            icon: '🏢',
            title: 'Organizations',
            description: 'Companies and organizations wanting to contribute to open source or launch internal projects publicly.'
          }
        ]
      },
      {
        type: 'heading',
        text: 'Success Stories & Impact'
      },
      {
        type: 'callout',
        variant: 'success',
        title: 'Platform Impact',
        text: 'Over 10,000 repositories analyzed, 5,000+ community files generated, and hundreds of successful open source launches facilitated through our platform.'
      },
      {
        type: 'table',
        headers: ['Metric', 'Count', 'Impact'],
        rows: [
          ['Repositories Analyzed', '10,000+', 'Comprehensive insights provided'],
          ['Community Files Generated', '5,000+', 'Professional documentation created'],
          ['Active Users', '2,500+', 'Growing developer community'],
          ['Open Source Launches', '500+', 'Successful project transitions']
        ]
      }
    ]
  },
  {
    id: 'key-features',
    title: 'Key Features & Capabilities',
    blocks: [
      {
        type: 'paragraph',
        text: 'Make-It-OSS offers a comprehensive suite of tools and features designed to streamline your journey from private development to public collaboration.'
      },
      {
        type: 'heading',
        text: 'Core Platform Features'
      },
      {
        type: 'feature-grid',
        features: [
          {
            icon: '🔍',
            title: 'Repository Analysis',
            description: 'Deep analysis of your codebase structure, quality, and open source readiness with actionable insights.'
          },
          {
            icon: '🤖',
            title: 'AI-Powered Recommendations',
            description: 'Intelligent suggestions powered by Google Gemini AI to improve your project\'s open source appeal.'
          },
          {
            icon: '📝',
            title: 'Community File Generation',
            description: 'Automated creation of essential community files including README, CONTRIBUTING, and license files.'
          },
          {
            icon: '📊',
            title: 'OSS Readiness Scoring',
            description: 'Comprehensive scoring system that evaluates your project across multiple dimensions of open source success.'
          },
          {
            icon: '🏆',
            title: 'Repository Showcase',
            description: 'Featured showcase platform to highlight excellent open source projects and inspire the community.'
          },
          {
            icon: '📈',
            title: 'Analytics Dashboard',
            description: 'Track your progress, monitor improvements, and gain insights into your open source journey.'
          }
        ]
      },
      {
        type: 'heading',
        text: 'Analysis Capabilities'
      },
      {
        type: 'list',
        items: [
          'Code quality assessment and improvement suggestions',
          'Documentation coverage and quality analysis',
          'Security vulnerability scanning and recommendations',
          'License compatibility checking',
          'Community health evaluation',
          'Maintenance indicators and sustainability metrics',
          'Accessibility and inclusivity assessments'
        ]
      },
      {
        type: 'heading',
        text: 'Community Features'
      },
      {
        type: 'paragraph',
        text: 'Beyond analysis, Make-It-OSS provides community-building tools to help your project thrive in the open source ecosystem.'
      },
      {
        type: 'list',
        items: [
          'Issue and PR template generation',
          'Contributing guidelines creation',
          'Code of conduct establishment',
          'Community engagement metrics',
          'Contributor recognition systems',
          'Project discovery and networking'
        ]
      }
    ]
  },
  {
    id: 'how-it-works',
    title: 'How It Works',
    blocks: [
      {
        type: 'paragraph',
        text: 'Make-It-OSS follows a simple yet powerful workflow to transform your repository into an open source ready project. Here\'s how the magic happens:'
      },
      {
        type: 'demo',
        demoType: 'repository-analysis',
        title: 'Repository Analysis Demo',
        description: 'See how our platform analyzes a GitHub repository in real-time'
      },
      {
        type: 'heading',
        text: 'Step-by-Step Process'
      },
      {
        type: 'subheading',
        text: '1. Repository Submission'
      },
      {
        type: 'paragraph',
        text: 'Simply paste your GitHub repository URL into our analysis tool. Our system supports both public and private repositories (with appropriate permissions).'
      },
      {
        type: 'code',
        language: 'bash',
        code: '# Example repository URLs we support\nhttps://github.com/username/repository\nhttps://github.com/organization/project',
        title: 'Supported Repository Formats'
      },
      {
        type: 'subheading',
        text: '2. GitHub API Integration'
      },
      {
        type: 'paragraph',
        text: 'Our platform securely connects to the GitHub API to fetch repository metadata, code structure, commit history, and existing documentation. We respect rate limits and use OAuth for secure access.'
      },
      {
        type: 'list',
        items: [
          'Repository structure and file tree analysis',
          'Commit history and contributor activity',
          'Issues and pull request patterns',
          'Existing documentation and community files',
          'License and security configurations',
          'Dependencies and package management'
        ]
      },
      {
        type: 'subheading',
        text: '3. AI-Powered Analysis with Gemini'
      },
      {
        type: 'paragraph',
        text: 'Google Gemini AI analyzes your codebase context, understands the project purpose, and evaluates open source readiness across multiple dimensions.'
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'AI Analysis Includes',
        text: 'Code quality assessment, documentation gaps identification, security considerations, community readiness evaluation, and personalized improvement recommendations.'
      },
      {
        type: 'subheading',
        text: '4. Scoring Algorithm'
      },
      {
        type: 'paragraph',
        text: 'Our comprehensive scoring system evaluates your project across five key dimensions, providing both individual scores and an overall OSS readiness rating.'
      },
      {
        type: 'demo',
        demoType: 'scoring',
        title: 'OSS Readiness Scoring',
        description: 'Interactive demonstration of our multi-dimensional scoring system'
      },
      {
        type: 'subheading',
        text: '5. Recommendation Generation'
      },
      {
        type: 'paragraph',
        text: 'Based on the analysis results, our system generates prioritized, actionable recommendations tailored to your specific project needs and current state.'
      },
      {
        type: 'demo',
        demoType: 'recommendations',
        title: 'Personalized Recommendations',
        description: 'See how we generate targeted suggestions for improvement'
      },
      {
        type: 'subheading',
        text: '6. Community File Generation'
      },
      {
        type: 'paragraph',
        text: 'Our AI generates professional-quality community files customized for your project, including README templates, contributing guidelines, and code of conduct documents.'
      },
      {
        type: 'code',
        language: 'markdown',
        code: '# Your Project Name\n\nA brief description of your project and what it does.\n\n## Installation\n\n```bash\nnpm install your-package\n```\n\n## Usage\n\n```javascript\nconst yourPackage = require(\'your-package\');\n```\n\n## Contributing\n\nWe welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).\n\n## License\n\nThis project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.',
        title: 'Generated README Example'
      }
    ]
  },
  {
    id: 'architecture',
    title: 'Architecture Overview',
    blocks: [
      {
        type: 'paragraph',
        text: 'Make-It-OSS is built on a modern, scalable architecture that combines powerful AI analysis with robust web technologies to deliver a seamless user experience.'
      },
      {
        type: 'architecture'
      },
      {
        type: 'heading',
        text: 'Technology Stack Breakdown'
      },
      {
        type: 'subheading',
        text: 'Frontend (React Application)'
      },
      {
        type: 'table',
        headers: ['Technology', 'Purpose', 'Version'],
        rows: [
          ['React', 'UI Framework', '18.x'],
          ['TypeScript', 'Type Safety', '5.x'],
          ['Tailwind CSS', 'Styling Framework', '3.x'],
          ['Vite', 'Build Tool', '5.x'],
          ['React Router', 'Client-side Routing', '6.x'],
          ['Lucide React', 'Icon Library', 'Latest']
        ]
      },
      {
        type: 'subheading',
        text: 'Backend (API Server)'
      },
      {
        type: 'table',
        headers: ['Technology', 'Purpose', 'Version'],
        rows: [
          ['Node.js', 'Runtime Environment', '18.x'],
          ['Express.js', 'Web Framework', '4.x'],
          ['TypeScript', 'Type Safety', '5.x'],
          ['Prisma', 'Database ORM', 'Latest'],
          ['PostgreSQL', 'Primary Database', '14.x'],
          ['Redis', 'Caching Layer', '7.x']
        ]
      },
      {
        type: 'heading',
        text: 'API Design Patterns'
      },
      {
        type: 'paragraph',
        text: 'Our API follows RESTful principles with clear resource-based URLs and proper HTTP methods. All responses are JSON-formatted with consistent error handling.'
      },
      {
        type: 'code',
        language: 'javascript',
        code: '// API Endpoint Structure\nPOST /api/v1/repositories/analyze\nGET  /api/v1/repositories/{id}/report\nGET  /api/v1/repositories/{id}/recommendations\nPOST /api/v1/community-files/generate\n\n// Standard Response Format\n{\n  "success": true,\n  "data": { /* response data */ },\n  "message": "Operation completed successfully",\n  "timestamp": "2024-01-15T10:30:00Z"\n}',
        title: 'API Structure'
      },
      {
        type: 'heading',
        text: 'Database Schema Overview'
      },
      {
        type: 'paragraph',
        text: 'Our database schema is designed for scalability and performance, with proper indexing and relationships to support fast queries and analysis storage.'
      },
      {
        type: 'code',
        language: 'sql',
        code: '-- Core entities\nCREATE TABLE repositories (\n  id UUID PRIMARY KEY,\n  github_url TEXT NOT NULL,\n  name TEXT NOT NULL,\n  description TEXT,\n  language TEXT,\n  created_at TIMESTAMP DEFAULT NOW()\n);\n\nCREATE TABLE analyses (\n  id UUID PRIMARY KEY,\n  repository_id UUID REFERENCES repositories(id),\n  overall_score INTEGER,\n  analysis_data JSONB,\n  created_at TIMESTAMP DEFAULT NOW()\n);\n\nCREATE TABLE recommendations (\n  id UUID PRIMARY KEY,\n  analysis_id UUID REFERENCES analyses(id),\n  category TEXT NOT NULL,\n  priority TEXT NOT NULL,\n  title TEXT NOT NULL,\n  description TEXT\n);',
        title: 'Database Schema'
      },
      {
        type: 'heading',
        text: 'Third-Party Integrations'
      },
      {
        type: 'list',
        items: [
          'GitHub API - Repository data and metadata access',
          'Google Gemini AI - Intelligent code analysis and recommendations',
          'Auth0 - User authentication and authorization',
          'Stripe - Payment processing for premium features',
          'SendGrid - Email notifications and communications',
          'Cloudflare - CDN and DDoS protection'
        ]
      },
      {
        type: 'heading',
        text: 'Security & Privacy Considerations'
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Privacy First',
        text: 'We never store your source code. Our analysis works with repository metadata and structure only. All data is encrypted in transit and at rest.'
      },
      {
        type: 'list',
        items: [
          'OAuth 2.0 for secure GitHub integration',
          'JWT tokens for session management',
          'Rate limiting and request throttling',
          'Input validation and sanitization',
          'HTTPS everywhere with SSL/TLS encryption',
          'Regular security audits and penetration testing'
        ]
      }
    ]
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    blocks: [
      {
        type: 'paragraph',
        text: 'Ready to transform your repository into an open source success story? Follow this step-by-step guide to get started with Make-It-OSS.'
      },
      {
        type: 'heading',
        text: 'Prerequisites'
      },
      {
        type: 'list',
        items: [
          'A GitHub account with repository access',
          'Repository you want to analyze (public or private)',
          'Modern web browser (Chrome, Firefox, Safari, Edge)',
          'Internet connection for real-time analysis'
        ]
      },
      {
        type: 'heading',
        text: 'Quick Start Guide'
      },
      {
        type: 'subheading',
        text: 'Step 1: Visit Make-It-OSS'
      },
      {
        type: 'paragraph',
        text: 'Navigate to our platform and create your free account or sign in with GitHub for seamless integration.'
      },
      {
        type: 'code',
        language: 'bash',
        code: '# Visit our platform\nhttps://make-it-oss.architech-dev.tech/\n\n# Or try the demo with a sample repository\nhttps://make-it-oss.architech-dev.tech/demo',
        title: 'Platform Access'
      },
      {
        type: 'subheading',
        text: 'Step 2: Submit Your Repository'
      },
      {
        type: 'paragraph',
        text: 'Paste your GitHub repository URL into the analysis tool. Our system will immediately begin the analysis process.'
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Repository Access',
        text: 'For private repositories, you\'ll need to grant our GitHub app appropriate permissions. We only access metadata and structure, never your actual source code.'
      },
      {
        type: 'subheading',
        text: 'Step 3: Review Your Analysis'
      },
      {
        type: 'paragraph',
        text: 'Within minutes, you\'ll receive a comprehensive report including your OSS readiness score, detailed analysis, and personalized recommendations.'
      },
      {
        type: 'subheading',
        text: 'Step 4: Implement Recommendations'
      },
      {
        type: 'paragraph',
        text: 'Follow our prioritized recommendations to improve your repository. Generate community files, improve documentation, and enhance your project\'s open source appeal.'
      },
      {
        type: 'subheading',
        text: 'Step 5: Re-analyze and Iterate'
      },
      {
        type: 'paragraph',
        text: 'Run additional analyses to track your progress and ensure your repository meets open source best practices before going public.'
      },
      {
        type: 'heading',
        text: 'First Analysis Checklist'
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Ensure your repository has a clear, descriptive name',
          'Add a basic description to your GitHub repository',
          'Include at least a few commits with meaningful messages',
          'Consider adding a basic README if one doesn\'t exist',
          'Review any sensitive information that should be removed',
          'Check that dependencies are properly declared'
        ]
      },
      {
        type: 'callout',
        variant: 'success',
        title: 'Pro Tip',
        text: 'Start with a smaller, well-contained project for your first analysis. This helps you understand the process and build confidence before tackling larger repositories.'
      }
    ]
  },
  {
    id: 'api-documentation',
    title: 'API Documentation',
    blocks: [
      {
        type: 'paragraph',
        text: 'Make-It-OSS provides a comprehensive REST API for developers who want to integrate our analysis capabilities into their own tools and workflows.'
      },
      {
        type: 'heading',
        text: 'Authentication'
      },
      {
        type: 'paragraph',
        text: 'All API requests require authentication using API keys. You can generate API keys from your dashboard settings.'
      },
      {
        type: 'code',
        language: 'bash',
        code: '# Include your API key in the Authorization header\ncurl -H "Authorization: Bearer YOUR_API_KEY" \\\n     -H "Content-Type: application/json" \\\n     https://api.make-it-oss.architech-dev.tech/v1/repositories/analyze',
        title: 'Authentication Example'
      },
      {
        type: 'heading',
        text: 'Core Endpoints'
      },
      {
        type: 'subheading',
        text: 'Repository Analysis'
      },
      {
        type: 'code',
        language: 'bash',
        code: 'POST /api/v1/repositories/analyze\nContent-Type: application/json\n\n{\n  "github_url": "https://github.com/username/repository",\n  "options": {\n    "deep_analysis": true,\n    "generate_files": false\n  }\n}',
        title: 'Start Repository Analysis'
      },
      {
        type: 'code',
        language: 'json',
        code: '{\n  "success": true,\n  "data": {\n    "analysis_id": "550e8400-e29b-41d4-a716-446655440000",\n    "status": "processing",\n    "estimated_completion": "2024-01-15T10:35:00Z"\n  },\n  "message": "Analysis started successfully"\n}',
        title: 'Analysis Response'
      },
      {
        type: 'subheading',
        text: 'Get Analysis Results'
      },
      {
        type: 'code',
        language: 'bash',
        code: 'GET /api/v1/analyses/{analysis_id}\nAuthorization: Bearer YOUR_API_KEY',
        title: 'Fetch Analysis Results'
      },
      {
        type: 'code',
        language: 'json',
        code: '{\n  "success": true,\n  "data": {\n    "id": "550e8400-e29b-41d4-a716-446655440000",\n    "status": "completed",\n    "repository": {\n      "name": "awesome-project",\n      "language": "JavaScript",\n      "stars": 150\n    },\n    "scores": {\n      "overall": 84,\n      "code_quality": 85,\n      "documentation": 72,\n      "community": 95,\n      "maintenance": 78,\n      "security": 90\n    },\n    "recommendations": [\n      {\n        "category": "documentation",\n        "priority": "high",\n        "title": "Add API documentation",\n        "description": "Consider adding comprehensive API documentation..."\n      }\n    ]\n  }\n}',
        title: 'Analysis Results Response'
      },
      {
        type: 'heading',
        text: 'Rate Limits'
      },
      {
        type: 'table',
        headers: ['Plan', 'Requests/Hour', 'Analyses/Day', 'Features'],
        rows: [
          ['Free', '100', '5', 'Basic analysis'],
          ['Pro', '1,000', '50', 'Deep analysis + file generation'],
          ['Enterprise', 'Custom', 'Unlimited', 'All features + priority support']
        ]
      },
      {
        type: 'heading',
        text: 'Error Handling'
      },
      {
        type: 'paragraph',
        text: 'The API uses standard HTTP status codes and returns detailed error messages in JSON format.'
      },
      {
        type: 'code',
        language: 'json',
        code: '{\n  "success": false,\n  "error": {\n    "code": "INVALID_REPOSITORY",\n    "message": "The provided GitHub URL is not accessible",\n    "details": "Repository may be private or not exist"\n  },\n  "timestamp": "2024-01-15T10:30:00Z"\n}',
        title: 'Error Response Format'
      },
      {
        type: 'heading',
        text: 'SDKs and Libraries'
      },
      {
        type: 'paragraph',
        text: 'We provide official SDKs for popular programming languages to make integration easier.'
      },
      {
        type: 'code',
        language: 'javascript',
        code: '// Node.js SDK Example\nconst { MakeItOSS } = require(\'@make-it-oss/sdk\');\n\nconst client = new MakeItOSS({\n  apiKey: process.env.MAKE_IT_OSS_API_KEY\n});\n\nconst analysis = await client.analyzeRepository({\n  githubUrl: \'https://github.com/username/repo\',\n  options: { deepAnalysis: true }\n});\n\nconsole.log(analysis.scores);',
        title: 'Node.js SDK Usage'
      }
    ]
  },
  {
    id: 'community-support',
    title: 'Community & Support',
    blocks: [
      {
        type: 'paragraph',
        text: 'Join our thriving community of developers, maintainers, and open source enthusiasts. Get help, share experiences, and contribute to the future of open source tooling.'
      },
      {
        type: 'heading',
        text: 'Community Channels'
      },
      {
        type: 'feature-grid',
        features: [
          {
            icon: '💬',
            title: 'Discord Community',
            description: 'Join our active Discord server for real-time discussions, support, and community events.',
            href: 'https://discord.gg/r9jzAFU3FM'
          },
          {
            icon: '🐙',
            title: 'GitHub Discussions',
            description: 'Participate in GitHub Discussions for feature requests, bug reports, and development updates.',
            href: 'https://github.com/architech-devs/make-it-oss/discussions'
          },
          {
            icon: '🐦',
            title: 'Twitter Community',
            description: 'Follow @architech_dev for updates, tips, and highlights from the open source community.',
            href: 'https://twitter.com/architech_dev'
          },
          {
            icon: '📺',
            title: 'YouTube Channel',
            description: 'Watch tutorials, demos, and deep-dives into Make-It-OSS features and open source best practices.',
            href: 'https://youtube.com/channel/UC8LedUlToF1oO3E3NZG46aw'
          },
          {
            icon: '📧',
            title: 'Email Support',
            description: 'Reach out directly for support, partnerships, or general inquiries about the platform.',
            href: 'mailto:architech.devs@gmail.com'
          }
        ]
      },
      {
        type: 'heading',
        text: 'Getting Help'
      },
      {
        type: 'subheading',
        text: 'Documentation & Tutorials'
      },
      {
        type: 'list',
        items: [
          'Comprehensive documentation (you\'re reading it!)',
          'Video tutorials on our YouTube channel',
          'Step-by-step guides for common scenarios',
          'Best practices and case studies',
          'API reference and code examples'
        ]
      },
      {
        type: 'subheading',
        text: 'Support Channels'
      },
      {
        type: 'table',
        headers: ['Channel', 'Response Time', 'Best For'],
        rows: [
          ['Discord #support', '< 2 hours', 'Quick questions and community help'],
          ['GitHub Issues', '< 24 hours', 'Bug reports and feature requests'],
          ['Email Support', '< 48 hours', 'Account and billing issues'],
          ['Enterprise Support', '< 4 hours', 'Priority support for enterprise customers']
        ]
      },
      {
        type: 'heading',
        text: 'Community Guidelines'
      },
      {
        type: 'paragraph',
        text: 'Our community thrives on mutual respect, collaboration, and shared learning. Please follow these guidelines to help maintain a positive environment for everyone.'
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Code of Conduct',
        text: 'We are committed to providing a welcoming and inclusive environment. Please read our full Code of Conduct for detailed guidelines on community participation.'
      },
      {
        type: 'list',
        items: [
          'Be respectful and constructive in all interactions',
          'Help others learn and grow in their open source journey',
          'Share knowledge and experiences freely',
          'Report any inappropriate behavior to moderators',
          'Stay on topic in relevant channels',
          'Use clear, descriptive titles for questions and issues'
        ]
      },
      {
        type: 'heading',
        text: 'Community Events'
      },
      {
        type: 'paragraph',
        text: 'We regularly host community events to bring developers together, share knowledge, and celebrate open source successes.'
      },
      {
        type: 'list',
        items: [
          'Monthly Community Calls - Product updates and Q&A sessions',
          'Open Source Workshops - Learn best practices from experts',
          'Project Showcase Events - Highlight community success stories',
          'Contributor Appreciation - Recognize outstanding community members',
          'Hackathons and Challenges - Collaborative development events'
        ]
      }
    ]
  },
  {
    id: 'future-roadmap',
    title: 'Future Roadmap',
    blocks: [
      {
        type: 'paragraph',
        text: 'Make-It-OSS is continuously evolving to better serve the open source community. Here\'s what we\'re working on and what\'s coming next.'
      },
      {
        type: 'heading',
        text: 'Upcoming Features'
      },
      {
        type: 'subheading',
        text: 'npm CLI Tool (Q2 2024)'
      },
      {
        type: 'paragraph',
        text: 'A powerful command-line interface that brings Make-It-OSS analysis directly to your development workflow.'
      },
      {
        type: 'code',
        language: 'bash',
        code: '# Install the CLI tool\nnpm install -g @make-it-oss/cli\n\n# Analyze your current directory\nmake-it-oss analyze .\n\n# Generate community files\nmake-it-oss generate --files readme,contributing,license\n\n# Continuous monitoring\nmake-it-oss watch --auto-improve',
        title: 'CLI Tool Preview'
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'CLI Features',
        text: 'Local analysis, file generation, continuous monitoring, CI/CD integration, offline mode, and customizable workflows.'
      },
      {
        type: 'subheading',
        text: 'Advanced Analytics (Q3 2024)'
      },
      {
        type: 'list',
        items: [
          'Historical trend analysis and progress tracking',
          'Comparative analysis against similar projects',
          'Community engagement prediction models',
          'Contribution opportunity identification',
          'Automated performance monitoring',
          'Custom analytics dashboards'
        ]
      },
      {
        type: 'subheading',
        text: 'Platform Integrations (Q4 2024)'
      },
      {
        type: 'feature-grid',
        features: [
          {
            icon: '🦊',
            title: 'GitLab Support',
            description: 'Full integration with GitLab repositories, CI/CD, and community features.'
          },
          {
            icon: '⚡',
            title: 'Bitbucket Integration',
            description: 'Support for Bitbucket repositories and Atlassian ecosystem tools.'
          },
          {
            icon: '🔗',
            title: 'CI/CD Plugins',
            description: 'Native plugins for GitHub Actions, GitLab CI, Jenkins, and other CI/CD platforms.'
          }
        ]
      },
      {
        type: 'heading',
        text: 'Enterprise Features (2025)'
      },
      {
        type: 'paragraph',
        text: 'Advanced features designed for organizations and teams managing multiple open source projects.'
      },
      {
        type: 'list',
        items: [
          'Organization-wide dashboard and reporting',
          'Team collaboration and approval workflows',
          'Custom policy enforcement and compliance checking',
          'Bulk repository analysis and management',
          'Advanced security scanning and vulnerability assessment',
          'Integration with enterprise identity providers (SSO)',
          'Custom branding and white-label options',
          'Dedicated support and professional services'
        ]
      },
      {
        type: 'heading',
        text: 'Community Features Expansion'
      },
      {
        type: 'subheading',
        text: 'Enhanced Repository Showcase'
      },
      {
        type: 'list',
        items: [
          'Advanced filtering and discovery options',
          'Community voting and rating systems',
          'Featured project highlights and collections',
          'Integration with package managers and registries',
          'Social sharing and collaboration features'
        ]
      },
      {
        type: 'subheading',
        text: 'Mentorship Platform'
      },
      {
        type: 'paragraph',
        text: 'Connect experienced maintainers with newcomers to open source, fostering knowledge sharing and community growth.'
      },
      {
        type: 'heading',
        text: 'Technology Evolution'
      },
      {
        type: 'list',
        items: [
          'Enhanced AI models with GPT-4 and Claude integration',
          'Real-time collaboration features',
          'Mobile app for iOS and Android',
          'Offline analysis capabilities',
          'Multi-language support and localization',
          'Accessibility improvements and WCAG compliance'
        ]
      },
      {
        type: 'callout',
        variant: 'success',
        title: 'Community Input',
        text: 'Our roadmap is heavily influenced by community feedback. Join our Discord or GitHub Discussions to share your ideas and vote on upcoming features!'
      }
    ]
  },
  {
    id: 'contributing',
    title: 'Contributing',
    blocks: [
      {
        type: 'paragraph',
        text: 'Make-It-OSS is an open source project, and we welcome contributions from developers of all skill levels. Whether you\'re fixing bugs, adding features, or improving documentation, your contributions help make open source more accessible for everyone.'
      },
      {
        type: 'heading',
        text: 'Ways to Contribute'
      },
      {
        type: 'feature-grid',
        features: [
          {
            icon: '🐛',
            title: 'Bug Reports',
            description: 'Found a bug? Report it on GitHub Issues with detailed reproduction steps.'
          },
          {
            icon: '💡',
            title: 'Feature Requests',
            description: 'Have an idea for improvement? Share it in GitHub Discussions or Discord.'
          },
          {
            icon: '📝',
            title: 'Documentation',
            description: 'Help improve our documentation, tutorials, and guides for better clarity.'
          },
          {
            icon: '💻',
            title: 'Code Contributions',
            description: 'Submit pull requests for bug fixes, new features, and performance improvements.'
          },
          {
            icon: '🎨',
            title: 'Design & UX',
            description: 'Contribute to user interface design, user experience improvements, and accessibility.'
          },
          {
            icon: '🧪',
            title: 'Testing',
            description: 'Help test new features, write automated tests, and improve test coverage.'
          }
        ]
      },
      {
        type: 'heading',
        text: 'Getting Started as a Contributor'
      },
      {
        type: 'subheading',
        text: 'Development Setup'
      },
      {
        type: 'code',
        language: 'bash',
        code: '# Fork and clone the repository\ngit clone https://github.com/architech-devs/make-it-oss.git\ncd make-it-oss\n\n# Install dependencies\nnpm install\n\n# Set up environment variables\ncp .env.example .env.local\n# Edit .env.local with your configuration\n\n# Start development servers\nnpm run dev:client  # Frontend (port 5173)\nnpm run dev:server  # Backend (port 3001)',
        title: 'Local Development Setup'
      },
      {
        type: 'subheading',
        text: 'Code Style and Standards'
      },
      {
        type: 'list',
        items: [
          'TypeScript for type safety - all new code should be TypeScript',
          'ESLint and Prettier for code formatting - run `npm run lint:fix`',
          'Conventional Commits for commit messages',
          'Write tests for new features using Jest and React Testing Library',
          'Follow existing project structure and naming conventions',
          'Add JSDoc comments for public APIs and complex functions'
        ]
      },
      {
        type: 'subheading',
        text: 'Pull Request Process'
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Create a feature branch from main: `git checkout -b feature/your-feature-name`',
          'Make your changes with clear, atomic commits',
          'Add or update tests for your changes',
          'Run the full test suite: `npm run test`',
          'Update documentation if needed',
          'Submit a pull request with a clear description of your changes',
          'Address any feedback from code reviewers',
          'Wait for approval and merge'
        ]
      },
      {
        type: 'heading',
        text: 'Good First Issues'
      },
      {
        type: 'paragraph',
        text: 'New to open source or our project? Look for issues labeled "good first issue" on our GitHub repository. These are carefully selected to be approachable for newcomers.'
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Getting Help',
        text: 'Stuck on something? Don\'t hesitate to ask for help in our Discord #contributors channel or comment on the GitHub issue. Our community is friendly and supportive!'
      },
      {
        type: 'heading',
        text: 'Recognition and Attribution'
      },
      {
        type: 'paragraph',
        text: 'We believe in recognizing our contributors. All contributors are acknowledged in our README, and significant contributions are highlighted in our release notes and community updates.'
      },
      {
        type: 'list',
        items: [
          'All contributors listed in README with profile links',
          'Monthly contributor spotlight in our newsletter',
          'Special recognition for first-time contributors',
          'Contributor badges and achievements system (coming soon)',
          'Invitation to exclusive contributor events and calls'
        ]
      },
      {
        type: 'heading',
        text: 'Code of Conduct'
      },
      {
        type: 'paragraph',
        text: 'By participating in this project, you agree to abide by our Code of Conduct. We are committed to making participation a harassment-free experience for everyone.'
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Our Commitment',
        text: 'We pledge to make participation in our project and community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.'
      },
      {
        type: 'heading',
        text: 'Questions?'
      },
      {
        type: 'paragraph',
        text: 'Have questions about contributing? We\'re here to help! Reach out through any of these channels:'
      },
      {
        type: 'list',
        items: [
          'Discord: https://discord.gg/r9jzAFU3FM - Join #contributors channel for real-time help',
          'GitHub Discussions: https://github.com/architech-devs/make-it-oss/discussions - For detailed questions',
          'GitHub Issues: https://github.com/architech-devs/make-it-oss/issues - For bug reports and feature requests',
          'Twitter: @architech_dev - Follow for updates and community highlights',
          'YouTube: https://youtube.com/channel/UC8LedUlToF1oO3E3NZG46aw - Tutorials and development insights',
          'Email: architech.devs@gmail.com - Direct support and partnership inquiries'
        ]
      }
    ]
  }
];

export type { DocSection as TDocSection };

