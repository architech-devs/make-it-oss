import chalk from 'chalk';
import { ScoringService } from './ScoringService.js';

export class ReportGenerator {
  constructor(verbose = false) {
    this.verbose = verbose;
    this.scoringService = new ScoringService();
  }

  generate(scanResults, aiAnalysis, analysisType) {
    // Use the new comprehensive scoring service
    const comprehensiveReport = this.scoringService.generateReport(scanResults, aiAnalysis);
    
    // Keep backward compatibility with old structure while adding new scoring
    const ossReadiness = {
      score: comprehensiveReport.summary.overallScore,
      maxScore: comprehensiveReport.summary.maxPoints,
      readinessLevel: comprehensiveReport.summary.readinessLevel,
      breakdown: {}
    };
    
    // Convert category scores to old format for compatibility
    Object.entries(comprehensiveReport.categories).forEach(([category, scores]) => {
      ossReadiness.breakdown[category] = scores.earned;
    });

    return {
      analysis: {
        timestamp: scanResults.timestamp,
        repository: {
          path: scanResults.path,
          name: scanResults.name,
          type: this.getProjectType(scanResults.projectInfo),
          languages: scanResults.projectInfo.languages,
          frameworks: scanResults.projectInfo.frameworks,
          fileCount: scanResults.fileCount,
          codeLines: scanResults.statistics.codeLines
        },
        ossReadiness,
        comprehensiveScoring: comprehensiveReport, // Add the new comprehensive report
        findings: {
          found: scanResults.communityFiles.found,
          missing: scanResults.communityFiles.missing,
          recommendations: comprehensiveReport.recommendations
        },
        aiAnalysis: aiAnalysis || { summary: 'No AI analysis performed (offline mode)' },
        statistics: scanResults.statistics
      }
    };
  }

  calculateOSSReadiness(scanResults, aiAnalysis) {
    // This method is now deprecated in favor of ScoringService
    // Kept for backward compatibility
    const comprehensiveReport = this.scoringService.generateReport(scanResults, aiAnalysis);
    
    const breakdown = {};
    Object.entries(comprehensiveReport.categories).forEach(([category, scores]) => {
      breakdown[category] = scores.earned;
    });

    return {
      score: comprehensiveReport.summary.overallScore,
      maxScore: comprehensiveReport.summary.maxPoints,
      breakdown
    };
  }

  generateRecommendations(scanResults, aiAnalysis) {
    // This method is now deprecated in favor of ScoringService
    // Kept for backward compatibility
    const comprehensiveReport = this.scoringService.generateReport(scanResults, aiAnalysis);
    
    // Convert to old format
    const recommendations = comprehensiveReport.recommendations.map(rec => ({
      priority: rec.priority === 'critical' ? 'high' : rec.priority,
      category: rec.category || 'general',
      title: rec.file ? `Improve ${rec.file}` : 'General Improvement',
      description: rec.message,
      action: rec.action
    }));

    // Add AI recommendations if available
    if (aiAnalysis && aiAnalysis.recommendations) {
      aiAnalysis.recommendations.forEach((rec, index) => {
        if (index < 5) { // Top 5 AI recommendations
          recommendations.push({
            priority: 'medium',
            category: 'ai-suggested',
            title: `AI Suggestion ${index + 1}`,
            description: rec
          });
        }
      });
    }

    return recommendations.slice(0, 10); // Top 10 recommendations
  }

  getProjectType(projectInfo) {
    const { languages, frameworks } = projectInfo;
    
    if (frameworks.length > 0) {
      return `${languages.join('/')} - ${frameworks.join(', ')}`;
    }
    
    return languages.join('/') || 'Unknown';
  }

  formatConsoleOutput(report) {
    const { repository, ossReadiness, findings, aiAnalysis, comprehensiveScoring } = report.analysis;
    
    let output = '';
    
    // Header
    output += chalk.cyan.bold('━'.repeat(60)) + '\n';
    output += chalk.cyan.bold('📊 COMPREHENSIVE OSS READINESS REPORT') + '\n';
    output += chalk.cyan.bold('━'.repeat(60)) + '\n\n';

    // Project Info
    output += chalk.white.bold('📁 Project Information\n');
    output += chalk.gray(`   Name: `) + chalk.white(repository.name) + '\n';
    output += chalk.gray(`   Type: `) + chalk.white(repository.type) + '\n';
    output += chalk.gray(`   Languages: `) + chalk.white(repository.languages.join(', ')) + '\n';
    if (repository.frameworks.length > 0) {
      output += chalk.gray(`   Frameworks: `) + chalk.white(repository.frameworks.join(', ')) + '\n';
    }
    output += chalk.gray(`   Files: `) + chalk.white(repository.fileCount) + '\n';
    output += chalk.gray(`   Code Lines: `) + chalk.white(repository.codeLines) + '\n\n';

    // OSS Readiness Score with Level
    const score = Math.round(ossReadiness.score);
    const level = ossReadiness.readinessLevel || this.getReadinessLabel(score);
    const scoreColor = score >= 80 ? chalk.green : 
                       score >= 60 ? chalk.yellow : chalk.red;
    output += chalk.white.bold('⭐ OSS Readiness Score: ') + 
              scoreColor.bold(`${score}/100`) + 
              chalk.gray(` (${level})`) + '\n';
    
    if (comprehensiveScoring && comprehensiveScoring.summary.bonusPoints > 0) {
      output += chalk.gray(`   Bonus Points: `) + 
                chalk.green(`+${comprehensiveScoring.summary.bonusPoints}`) + '\n';
    }
    output += '\n';

    // Score Breakdown
    output += chalk.white('   Breakdown:\n');
    Object.entries(ossReadiness.breakdown).forEach(([key, value]) => {
      const max = key === 'documentation' ? 30 : 
                  key === 'legal' || key === 'community' ? 25 : 10;
      const percent = Math.round((value / max) * 100);
      const bar = this.createProgressBar(percent);
      output += chalk.gray(`   ${key.padEnd(15)}: `) + bar + 
                chalk.white(` ${value}/${max}`) + '\n';
    });
    output += '\n';

    // Found Files
    output += chalk.green.bold(`✅ Found Files (${findings.found.length}):\n`);
    findings.found.forEach(f => {
      const qualityEmoji = this.getQualityEmoji(f.quality);
      output += chalk.green(`   ${qualityEmoji} ${f.name}`) + 
                chalk.gray(` (${f.quality})`) + '\n';
    });
    output += '\n';

    // Missing Files
    if (findings.missing.length > 0) {
      output += chalk.red.bold(`❌ Missing Files (${findings.missing.length}):\n`);
      findings.missing.forEach(f => {
        const priorityColor = f.priority === 'critical' ? chalk.red :
                             f.priority === 'high' ? chalk.yellow : chalk.gray;
        output += priorityColor(`   ⚠ ${f.name}`) + 
                  chalk.gray(` (${f.priority} priority)`) + '\n';
      });
      output += '\n';
    }

    // Recommendations
    output += chalk.blue.bold(`🎯 Top Recommendations:\n`);
    findings.recommendations.slice(0, 5).forEach((rec, index) => {
      const priorityBadge = rec.priority === 'high' ? chalk.red('[HIGH]') :
                           rec.priority === 'medium' ? chalk.yellow('[MED]') :
                           chalk.gray('[LOW]');
      output += chalk.white(`   ${index + 1}. `) + priorityBadge + ' ' +
                chalk.white(rec.title) + '\n';
      output += chalk.gray(`      ${rec.description}`) + '\n';
    });
    output += '\n';

    // AI Analysis Summary
    if (aiAnalysis && aiAnalysis.summary && 
        aiAnalysis.summary !== 'No AI analysis performed (offline mode)') {
      output += chalk.magenta.bold('🤖 AI Analysis:\n');
      output += chalk.gray('   ' + aiAnalysis.summary.substring(0, 200)) + '\n\n';
    }

    output += chalk.cyan.bold('━'.repeat(60)) + '\n';
    
    // Add detailed file scoring if available
    if (comprehensiveScoring && comprehensiveScoring.files && this.verbose) {
      output += chalk.blue.bold(`\n📋 Detailed File Scores:\n`);
      comprehensiveScoring.files.forEach(file => {
        const fileScore = Math.round(file.score);
        const maxScore = Math.round(file.maxScore);
        const percentage = maxScore > 0 ? Math.round((fileScore / maxScore) * 100) : 0;
        const scoreColor = percentage >= 80 ? chalk.green : 
                          percentage >= 50 ? chalk.yellow : chalk.red;
        
        output += chalk.gray(`   ${file.file}: `) + 
                  scoreColor(`${fileScore}/${maxScore}`) +
                  chalk.gray(` (${percentage}%)`) + '\n';
      });
      output += '\n';
    }
    
    output += chalk.cyan.bold('━'.repeat(60)) + '\n';
    
    return output;
  }

  getReadinessLabel(score) {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 40) return 'Poor';
    return 'Critical';
  }

  createProgressBar(percent, length = 20) {
    const filled = Math.round((percent / 100) * length);
    const empty = length - filled;
    
    const filledBar = chalk.green('█'.repeat(filled));
    const emptyBar = chalk.gray('░'.repeat(empty));
    
    return filledBar + emptyBar;
  }

  getQualityEmoji(quality) {
    const emojiMap = {
      excellent: '🌟',
      good: '✅',
      comprehensive: '✅',
      complete: '✅',
      basic: '📄',
      minimal: '⚠️',
      incomplete: '⚠️',
      unknown: '❓'
    };
    return emojiMap[quality] || '📄';
  }
}