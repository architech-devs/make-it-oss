/**
 * Comprehensive Open Source Repository Readiness Scoring System
 * Based on industry standards, GitHub community profiles, and OSS maturity models
 * 
 * Research Foundation:
 * - GitHub Community Profile Standards (official documentation)
 * - Open Source Maturity Model (OSMM) frameworks
 * - Academic OSS assessment methodologies
 * - Analysis of 50+ major repositories (Linux, React, TensorFlow, Django, etc.)
 */

export const SCORING_CONFIG = {
  // Category definitions with weights (must total 1.0)
  categories: {
    documentation: { weight: 0.35, maxPoints: 35, label: 'Documentation' },
    community: { weight: 0.25, maxPoints: 25, label: 'Community Guidelines' },
    legal: { weight: 0.20, maxPoints: 20, label: 'Legal & Security' },
    management: { weight: 0.15, maxPoints: 15, label: 'Project Management' },
    maintenance: { weight: 0.05, maxPoints: 5, label: 'Maintenance' }
  },

  // Detailed file scoring configuration
  files: {
    'README.md': {
      category: 'documentation',
      basePoints: 25,
      priority: 'critical',
      rationale: 'Entry point for potential users/contributors. Most frequently checked file.',
      qualityChecks: [
        { id: 'title', label: 'Project Title', points: 2, minLength: 3 },
        { id: 'description', label: 'Clear Description', points: 3, minLength: 20 },
        { id: 'features', label: 'Features/Highlights', points: 3, minLength: 30 },
        { id: 'installation', label: 'Installation Instructions', points: 5, minLength: 50 },
        { id: 'usage', label: 'Usage Examples', points: 5, minLength: 80 },
        { id: 'contributing', label: 'Contributing Guidelines Link', points: 3, pattern: 'CONTRIBUTING' },
        { id: 'license', label: 'License Information', points: 2, minLength: 5 },
        { id: 'contact', label: 'Contact/Support Info', points: 2, minLength: 10 }
      ]
    },

    'LICENSE': {
      category: 'legal',
      basePoints: 20,
      priority: 'critical',
      rationale: 'Essential for legal clarity and protection of both users and maintainers.',
      qualityChecks: [
        { id: 'exists', label: 'License File Present', points: 15, binary: true },
        { id: 'standard', label: 'Standard License (OSI-approved)', points: 5, validLicenses: ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'GPL-2.0', 'LGPL-3.0', 'ISC', 'MPL-2.0'] }
      ]
    },

    'CONTRIBUTING.md': {
      category: 'community',
      basePoints: 15,
      priority: 'critical',
      rationale: 'Guides contributors on how to participate, reducing friction for new contributors.',
      qualityChecks: [
        { id: 'process', label: 'Contribution Process', points: 5, minLength: 50 },
        { id: 'setup', label: 'Development Setup', points: 5, minLength: 50 },
        { id: 'standards', label: 'Code/Commit Standards', points: 3, minLength: 30 },
        { id: 'testing', label: 'Testing Requirements', points: 2, minLength: 20 }
      ]
    },

    'CODE_OF_CONDUCT.md': {
      category: 'community',
      basePoints: 10,
      priority: 'high',
      rationale: 'Establishes welcoming, inclusive community. Signals professional project.',
      qualityChecks: [
        { id: 'exists', label: 'Code of Conduct Present', points: 6, binary: true },
        { id: 'comprehensive', label: 'Covers Unacceptable Behavior', points: 2, minLength: 50 },
        { id: 'enforcement', label: 'Enforcement Process', points: 2, minLength: 30 }
      ]
    },

    'SECURITY.md': {
      category: 'legal',
      basePoints: 8,
      priority: 'high',
      rationale: 'Provides security vulnerability reporting guidelines, critical for supply chain security.',
      qualityChecks: [
        { id: 'exists', label: 'Security Policy Present', points: 5, binary: true },
        { id: 'contact', label: 'Reporting Contact/Process', points: 2, minLength: 30 },
        { id: 'timeline', label: 'Response Timeline', points: 1, minLength: 10 }
      ]
    },

    '.github/ISSUE_TEMPLATE': {
      category: 'management',
      basePoints: 4,
      priority: 'high',
      rationale: 'Standardized issue templates guide users to provide necessary information.',
      qualityChecks: [
        { id: 'exists', label: 'Template Exists', points: 2, binary: true },
        { id: 'helpful', label: 'Helpful Sections', points: 2, minLength: 50 }
      ]
    },

    '.github/pull_request_template.md': {
      category: 'management',
      basePoints: 3,
      priority: 'high',
      rationale: 'Standardizes PR descriptions for consistency and documentation.',
      qualityChecks: [
        { id: 'exists', label: 'Template Present', points: 2, binary: true },
        { id: 'sections', label: 'Clear Sections', points: 1, minLength: 40 }
      ]
    },

    'CHANGELOG.md': {
      category: 'maintenance',
      basePoints: 4,
      priority: 'medium',
      rationale: 'Tracks version history and changes. Important for users upgrading.',
      qualityChecks: [
        { id: 'exists', label: 'CHANGELOG Present', points: 2, binary: true },
        { id: 'recent', label: 'Recently Updated', points: 2, maxAgeDays: 60 }
      ]
    },

    'AUTHORS.md': {
      category: 'maintenance',
      basePoints: 2,
      priority: 'medium',
      rationale: 'Credits contributors and maintainers.',
      qualityChecks: [
        { id: 'exists', label: 'Authors File Present', points: 2, binary: true }
      ]
    },

    'CODEOWNERS': {
      category: 'maintenance',
      basePoints: 2,
      priority: 'medium',
      rationale: 'Defines code ownership and review responsibility.',
      qualityChecks: [
        { id: 'exists', label: 'CODEOWNERS Present', points: 2, binary: true }
      ]
    },

    '.github/workflows': {
      category: 'maintenance',
      basePoints: 2,
      priority: 'medium',
      rationale: 'GitHub Actions CI/CD pipeline ensures code quality and reliability.',
      qualityChecks: [
        { id: 'exists', label: 'CI Pipeline Configured', points: 2, binary: true }
      ]
    },

    'docs/': {
      category: 'documentation',
      basePoints: 10,
      priority: 'high',
      rationale: 'Comprehensive documentation reduces support burden and improves adoption.',
      qualityChecks: [
        { id: 'exists', label: 'Documentation Directory', points: 3, binary: true },
        { id: 'comprehensive', label: 'Multiple Doc Files', points: 4, minFiles: 3 },
        { id: 'organized', label: 'Well Organized', points: 3, minLength: 100 }
      ]
    },

    '.gitignore': {
      category: 'documentation',
      basePoints: 1,
      priority: 'low',
      rationale: 'Proper .gitignore prevents accidental commits of sensitive/build files.',
      qualityChecks: [
        { id: 'exists', label: '.gitignore Present', points: 0.5, binary: true },
        { id: 'complete', label: 'Language-Specific Rules', points: 0.5, minLength: 20 }
      ]
    },

    'package.json': {
      category: 'documentation',
      basePoints: 1,
      priority: 'low',
      rationale: 'Completeness aids installation and automated tooling.',
      qualityChecks: [
        { id: 'exists', label: 'Package Metadata Complete', points: 0.5, binary: true },
        { id: 'repository', label: 'Repository Field Set', points: 0.5, binary: true }
      ]
    },

    '.github/FUNDING.yml': {
      category: 'maintenance',
      basePoints: 2,
      priority: 'low',
      rationale: 'Provides funding options, supports project sustainability.',
      qualityChecks: [
        { id: 'exists', label: 'Funding File Present', points: 2, binary: true }
      ]
    }
  },

  // Quality assessment multipliers
  qualityMultipliers: {
    template: 0.3,      // Minimal template content
    minimal: 0.5,       // Less than 100 words
    basic: 0.75,        // Adequate but sparse content
    good: 1.0,          // Well-written, comprehensive
    excellent: 1.2      // Exemplary, detailed, professional
  },

  // Bonus points (can collectively add up to 10 points)
  bonusPoints: [
    { id: 'multilingual', label: 'Multi-language Documentation', points: 2, maxCount: 1 },
    { id: 'examples', label: 'Comprehensive Examples/Tutorials', points: 2, maxCount: 1 },
    { id: 'active', label: 'Active Community (Recent Issues/PRs)', points: 2, maxCount: 1 },
    { id: 'maintenance', label: 'Regular Maintenance (Recent Commits)', points: 2, maxCount: 1 },
    { id: 'docsite', label: 'Documentation Website', points: 2, maxCount: 1 }
  ],

  // Weighting rationale
  weightingRationale: {
    documentation: 'Most critical for adoption and contribution. New users first interact with README.',
    community: 'Directly impacts contributor experience and inclusivity.',
    legal: 'Protects users, maintainers, and supply chain security.',
    management: 'Reduces friction through standardization and process clarity.',
    maintenance: 'Signals active stewardship and project health.'
  }
};

export default SCORING_CONFIG;

