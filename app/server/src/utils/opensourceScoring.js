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

/**
 * Calculate comprehensive OSS readiness score
 * @param {Object} analysis - File analysis results
 * @returns {Object} Detailed scoring breakdown
 */
export const calculateOSSScore = (analysis) => {
  // Handle null or undefined analysis
  if (!analysis) {
    analysis = { files: {} };
  }

  const results = {
    totalScore: 0,
    maxScore: 100,
    percentScore: 0,
    categoryScores: {},
    fileScores: {},
    bonusPoints: 0,
    readinessLevel: '',
    details: []
  };

  // Initialize category scores
  Object.keys(SCORING_CONFIG.categories).forEach(cat => {
    results.categoryScores[cat] = { 
      earned: 0, 
      max: SCORING_CONFIG.categories[cat].maxPoints, 
      weight: SCORING_CONFIG.categories[cat].weight 
    };
  });

  // Score each file
  Object.entries(analysis.files || {}).forEach(([filename, fileData]) => {
    const config = findFileConfig(filename);
    if (!config) return;

    const fileScore = scoreFile(filename, fileData, config);
    results.fileScores[filename] = fileScore;

    const category = config.category;
    results.categoryScores[category].earned += fileScore.earned;

    results.details.push({
      file: filename,
      priority: config.priority,
      category: category,
      score: fileScore.earned,
      maxScore: fileScore.maxScore,
      multiplier: fileScore.multiplier,
      checks: fileScore.checks
    });
  });

  // Apply category weighting
  let weightedScore = 0;
  Object.entries(results.categoryScores).forEach(([category, scores]) => {
    const weight = SCORING_CONFIG.categories[category].weight;
    const categoryPercentage = scores.max > 0 ? (scores.earned / scores.max) : 0;
    weightedScore += categoryPercentage * weight * 100;
  });

  // Add bonus points
  results.bonusPoints = calculateBonusPoints(analysis);
  results.totalScore = Math.min(100, weightedScore + results.bonusPoints);
  results.percentScore = Math.round(results.totalScore * 10) / 10;

  // Determine readiness level
  results.readinessLevel = determineReadinessLevel(results.percentScore);

  // Add recommendations
  results.recommendations = generateRecommendations(results);

  return results;
};

/**
 * Find configuration for a file by name
 */
function findFileConfig(filename) {
  if (SCORING_CONFIG.files[filename]) {
    return SCORING_CONFIG.files[filename];
  }

  // Check for directory matches
  for (const key of Object.keys(SCORING_CONFIG.files)) {
    if (key.endsWith('/') && filename.startsWith(key)) {
      return SCORING_CONFIG.files[key];
    }
  }

  return null;
}

/**
 * Score individual file based on quality checks
 */
function scoreFile(filename, fileData, config) {
  const result = {
    earned: 0,
    maxScore: config.basePoints,
    multiplier: 1.0,
    checks: []
  };

  if (!config.qualityChecks || config.qualityChecks.length === 0) {
    // Binary file (exists/not exists)
    result.earned = fileData.exists ? config.basePoints : 0;
    result.checks.push({
      id: 'exists',
      label: 'File Present',
      passed: fileData.exists,
      points: config.basePoints
    });
    return result;
  }

  let passedPoints = 0;

  // Run quality checks
  config.qualityChecks.forEach(check => {
    let checkPassed = false;

    if (check.binary) {
      checkPassed = fileData.exists ?? false;
    } else if (check.pattern) {
      checkPassed = fileData.content && fileData.content.includes(check.pattern);
    } else if (check.minLength) {
      const contentLength = fileData.content ? fileData.content.length : 0;
      checkPassed = contentLength >= check.minLength;
    } else if (check.maxAgeDays && fileData.lastModified) {
      const daysSinceModified = (Date.now() - new Date(fileData.lastModified)) / (1000 * 60 * 60 * 24);
      checkPassed = daysSinceModified <= check.maxAgeDays;
    } else if (check.minFiles) {
      checkPassed = (fileData.fileCount || 0) >= check.minFiles;
    } else if (check.validLicenses) {
      checkPassed = check.validLicenses.some(lic => fileData.content && fileData.content.includes(lic));
    }

    if (checkPassed) {
      passedPoints += check.points;
    }

    result.checks.push({
      id: check.id,
      label: check.label,
      passed: checkPassed,
      points: check.points
    });
  });

  // Determine quality multiplier
  if (fileData.content) {
    const contentLength = fileData.content.length;
    if (contentLength < 50) {
      result.multiplier = SCORING_CONFIG.qualityMultipliers.template;
    } else if (contentLength < 200) {
      result.multiplier = SCORING_CONFIG.qualityMultipliers.minimal;
    } else if (contentLength < 1000) {
      result.multiplier = SCORING_CONFIG.qualityMultipliers.basic;
    } else if (contentLength < 5000) {
      result.multiplier = SCORING_CONFIG.qualityMultipliers.good;
    } else {
      result.multiplier = SCORING_CONFIG.qualityMultipliers.excellent;
    }
  }

  result.earned = Math.round(passedPoints * result.multiplier * 10) / 10;
  return result;
}

/**
 * Calculate bonus points from repository metrics
 */
function calculateBonusPoints(analysis) {
  let bonus = 0;
  const maxBonus = 10;

  // Multi-language documentation
  if (analysis.languages && analysis.languages.length > 1) {
    bonus += 2;
  }

  // Comprehensive examples
  if (analysis.hasExamples || (analysis.files && analysis.files['examples/'])) {
    bonus += 2;
  }

  // Active community
  if (analysis.recentActivity && (analysis.recentActivity.recentIssues > 5 || analysis.recentActivity.recentPRs > 5)) {
    bonus += 2;
  }

  // Regular maintenance
  if (analysis.recentActivity && analysis.recentActivity.lastCommitDays && analysis.recentActivity.lastCommitDays <= 30) {
    bonus += 2;
  }

  // Documentation website
  if (analysis.hasDocWebsite || (analysis.files && analysis.files['docs/_site'])) {
    bonus += 2;
  }

  return Math.min(bonus, maxBonus);
}

/**
 * Determine readiness level based on score
 */
function determineReadinessLevel(score) {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Poor';
  return 'Critical';
}

/**
 * Generate actionable recommendations
 */
function generateRecommendations(results) {
  const recommendations = [];

  // Check critical files
  const criticalFiles = Object.entries(SCORING_CONFIG.files)
    .filter(([_, config]) => config.priority === 'critical')
    .map(([name, _]) => name);

  Object.entries(results.fileScores).forEach(([file, score]) => {
    if (score.earned === 0 && criticalFiles.includes(file)) {
      recommendations.push({
        priority: 'critical',
        message: `Missing critical file: ${file}. This is essential for project credibility.`,
        file: file
      });
    } else if (score.earned < score.maxScore * 0.5) {
      recommendations.push({
        priority: 'high',
        message: `${file} is incomplete or under-developed. Consider expanding its content.`,
        file: file
      });
    }
  });

  // Category-level recommendations
  Object.entries(results.categoryScores).forEach(([category, scores]) => {
    const percentage = scores.max > 0 ? (scores.earned / scores.max) * 100 : 0;
    if (percentage < 50) {
      recommendations.push({
        priority: 'high',
        message: `${SCORING_CONFIG.categories[category].label} needs improvement (${Math.round(percentage)}%).`,
        category: category
      });
    }
  });

  return recommendations;
}

/**
 * Generate comprehensive report
 */
export const generateReport = (analysis) => {
  const scores = calculateOSSScore(analysis);

  return {
    timestamp: new Date().toISOString(),
    repository: analysis.repositoryName || 'Unknown',
    summary: {
      overallScore: scores.percentScore,
      readinessLevel: scores.readinessLevel,
      totalPoints: scores.totalScore,
      maxPoints: scores.maxScore,
      bonusPoints: scores.bonusPoints
    },
    categories: scores.categoryScores,
    files: scores.details,
    recommendations: scores.recommendations,
    scoreBreakdown: SCORING_CONFIG.weightingRationale
  };
};

export default {
  SCORING_CONFIG,
  calculateOSSScore,
  generateReport
};

