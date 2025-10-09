export const analysisConfig = {
  // File scanning configuration
  scanning: {
    maxFileSize: 1024 * 1024, // 1MB
    maxContentLength: 5000, // characters
    excludePatterns: [
      'node_modules',
      '.git',
      'dist',
      'build',
      '.next',
      'coverage',
      '.env',
      '.env.local',
      '*.log',
      '.cache',
      'tmp',
      'temp'
    ]
  },

  // Community files configuration
  communityFiles: {
    critical: [
      'README.md',
      'LICENSE',
      'LICENSE.md'
    ],
    high: [
      'CONTRIBUTING.md',
      'SECURITY.md',
      'CODE_OF_CONDUCT.md'
    ],
    medium: [
      'CHANGELOG.md',
      '.github/ISSUE_TEMPLATE',
      '.github/PULL_REQUEST_TEMPLATE.md',
      '.github/workflows'
    ]
  },

  // OSS Readiness scoring
  scoring: {
    maxScore: 100,
    weights: {
      documentation: 30,
      legal: 25,
      community: 25,
      management: 10,
      maintenance: 10
    }
  },

  // Gemini AI configuration
  gemini: {
    model: 'gemini-pro',
    maxRetries: 3,
    timeout: 30000 // 30 seconds
  }
};

export default analysisConfig;