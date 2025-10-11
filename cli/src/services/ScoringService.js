import { SCORING_CONFIG } from '../config/scoringConfig.js';

/**
 * Comprehensive OSS Scoring Service for CLI
 */
export class ScoringService {
  constructor() {
    this.config = SCORING_CONFIG;
  }

  /**
   * Calculate comprehensive OSS readiness score
   * @param {Object} scanResults - File scan results from FileSystemScanner
   * @param {Object} aiAnalysis - Optional AI analysis results
   * @returns {Object} Detailed scoring breakdown
   */
  calculateScore(scanResults, aiAnalysis = null) {
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
    Object.keys(this.config.categories).forEach(cat => {
      results.categoryScores[cat] = {
        earned: 0,
        max: this.config.categories[cat].maxPoints,
        weight: this.config.categories[cat].weight
      };
    });

    // Score each found file
    scanResults.communityFiles.found.forEach(fileInfo => {
      const config = this.findFileConfig(fileInfo.name);
      if (!config) return;

      const fileScore = this.scoreFile(fileInfo, config);
      results.fileScores[fileInfo.name] = fileScore;

      const category = config.category;
      results.categoryScores[category].earned += fileScore.earned;

      results.details.push({
        file: fileInfo.name,
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
      const weight = this.config.categories[category].weight;
      const categoryPercentage = scores.max > 0 ? (scores.earned / scores.max) : 0;
      weightedScore += categoryPercentage * weight * 100;
    });

    // Add bonus points
    results.bonusPoints = this.calculateBonusPoints(scanResults, aiAnalysis);
    results.totalScore = Math.min(100, weightedScore + results.bonusPoints);
    results.percentScore = Math.round(results.totalScore * 10) / 10;

    // Determine readiness level
    results.readinessLevel = this.determineReadinessLevel(results.percentScore);

    // Add recommendations
    results.recommendations = this.generateRecommendations(results, scanResults);

    return results;
  }

  /**
   * Find configuration for a file by name
   */
  findFileConfig(filename) {
    // Direct match
    if (this.config.files[filename]) {
      return this.config.files[filename];
    }

    // Check for directory matches
    for (const key of Object.keys(this.config.files)) {
      if (key.endsWith('/') && filename.startsWith(key)) {
        return this.config.files[key];
      }
    }

    // Check for .github/ variants
    const githubVariant = `.github/${filename}`;
    if (this.config.files[githubVariant]) {
      return this.config.files[githubVariant];
    }

    return null;
  }

  /**
   * Score individual file based on quality checks
   */
  scoreFile(fileInfo, config) {
    const result = {
      earned: 0,
      maxScore: config.basePoints,
      multiplier: 1.0,
      checks: []
    };

    if (!config.qualityChecks || config.qualityChecks.length === 0) {
      // Binary file (exists/not exists)
      result.earned = fileInfo.exists ? config.basePoints : 0;
      result.checks.push({
        id: 'exists',
        label: 'File Present',
        passed: fileInfo.exists,
        points: config.basePoints
      });
      return result;
    }

    let passedPoints = 0;
    const content = fileInfo.content || '';

    // Run quality checks
    config.qualityChecks.forEach(check => {
      let checkPassed = false;

      if (check.binary) {
        checkPassed = fileInfo.exists ?? false;
      } else if (check.pattern) {
        checkPassed = content.includes(check.pattern);
      } else if (check.minLength) {
        checkPassed = content.length >= check.minLength;
      } else if (check.maxAgeDays && fileInfo.lastModified) {
        const daysSinceModified = (Date.now() - new Date(fileInfo.lastModified)) / (1000 * 60 * 60 * 24);
        checkPassed = daysSinceModified <= check.maxAgeDays;
      } else if (check.minFiles) {
        checkPassed = (fileInfo.fileCount || 0) >= check.minFiles;
      } else if (check.validLicenses) {
        checkPassed = check.validLicenses.some(lic => content.includes(lic));
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

    // Determine quality multiplier based on content length
    if (content) {
      const contentLength = content.length;
      if (contentLength < 50) {
        result.multiplier = this.config.qualityMultipliers.template;
      } else if (contentLength < 200) {
        result.multiplier = this.config.qualityMultipliers.minimal;
      } else if (contentLength < 1000) {
        result.multiplier = this.config.qualityMultipliers.basic;
      } else if (contentLength < 5000) {
        result.multiplier = this.config.qualityMultipliers.good;
      } else {
        result.multiplier = this.config.qualityMultipliers.excellent;
      }
    }

    result.earned = Math.round(passedPoints * result.multiplier * 10) / 10;
    return result;
  }

  /**
   * Calculate bonus points from repository metrics
   */
  calculateBonusPoints(scanResults, aiAnalysis) {
    let bonus = 0;
    const maxBonus = 10;

    // Check for examples directory
    const hasExamples = scanResults.communityFiles.found.some(f =>
      f.name.includes('examples/') || f.name.includes('example')
    );
    if (hasExamples) {
      bonus += 2;
    }

    // Check for comprehensive docs
    const docsFiles = scanResults.communityFiles.found.filter(f =>
      f.name.includes('docs/')
    );
    if (docsFiles.length >= 3) {
      bonus += 2;
    }

    // Check for active maintenance (recent git activity)
    if (scanResults.gitInfo && scanResults.gitInfo.lastCommitDays <= 30) {
      bonus += 2;
    }

    // Check for CI/CD
    const hasCI = scanResults.communityFiles.found.some(f =>
      f.name.includes('.github/workflows')
    );
    if (hasCI) {
      bonus += 2;
    }

    // Multi-language support (check for i18n, locales, translations)
    const hasI18n = scanResults.communityFiles.found.some(f =>
      f.name.includes('i18n') || f.name.includes('locale') || f.name.includes('lang')
    );
    if (hasI18n) {
      bonus += 2;
    }

    return Math.min(bonus, maxBonus);
  }

  /**
   * Determine readiness level based on score
   */
  determineReadinessLevel(score) {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 40) return 'Poor';
    return 'Critical';
  }

  /**
   * Generate actionable recommendations
   */
  generateRecommendations(results, scanResults) {
    const recommendations = [];

    // Check for missing critical files
    const criticalFiles = Object.entries(this.config.files)
      .filter(([_, config]) => config.priority === 'critical')
      .map(([name, _]) => name);

    scanResults.communityFiles.missing.forEach(missingFile => {
      if (criticalFiles.includes(missingFile.name)) {
        recommendations.push({
          priority: 'critical',
          message: `Missing critical file: ${missingFile.name}. This is essential for project credibility.`,
          file: missingFile.name,
          action: `Create ${missingFile.name} to establish clear ${this.config.files[missingFile.name]?.rationale || 'guidelines'}`
        });
      }
    });

    // Check for incomplete files
    Object.entries(results.fileScores).forEach(([file, score]) => {
      if (score.earned > 0 && score.earned < score.maxScore * 0.5) {
        recommendations.push({
          priority: 'high',
          message: `${file} is incomplete or under-developed. Consider expanding its content.`,
          file: file,
          action: `Improve ${file} quality by adding more detailed information`
        });
      }
    });

    // Category-level recommendations
    Object.entries(results.categoryScores).forEach(([category, scores]) => {
      const percentage = scores.max > 0 ? (scores.earned / scores.max) * 100 : 0;
      if (percentage < 50) {
        recommendations.push({
          priority: 'high',
          message: `${this.config.categories[category].label} needs improvement (${Math.round(percentage)}%).`,
          category: category,
          action: `Focus on improving ${category} files and guidelines`
        });
      }
    });

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return recommendations;
  }

  /**
   * Generate comprehensive report
   */
  generateReport(scanResults, aiAnalysis = null) {
    const scores = this.calculateScore(scanResults, aiAnalysis);

    return {
      timestamp: new Date().toISOString(),
      repository: {
        path: scanResults.path,
        name: scanResults.name
      },
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
      scoreBreakdown: this.config.weightingRationale
    };
  }
}

export default ScoringService;

