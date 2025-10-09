import chalk from 'chalk';

export class ReportGenerator {
  constructor(verbose = false) {
    this.verbose = verbose;
  }

  generate(scanResults, aiAnalysis, analysisType) {
    const ossReadiness = this.calculateOSSReadiness(scanResults, aiAnalysis);
    const recommendations = this.generateRecommendations(scanResults, aiAnalysis);

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
        findings: {
          found: scanResults.communityFiles.found,
          missing: scanResults.communityFiles.missing,
          recommendations
        },
        aiAnalysis: aiAnalysis || { summary: 'No AI analysis performed (offline mode)' },
        statistics: scanResults.statistics
      }
    };
  }

  calculateOSSReadiness(scanResults, aiAnalysis) {
    let score = 0;
    const breakdown = {
      documentation: 0,
      community: 0,
      legal: 0,
      management: 0,
      maintenance: 0
    };

    // Documentation (max 30 points)
    const readme = scanResults.communityFiles.found.find(f => 
      f.name.includes('README')
    );
    if (readme) {
      if (readme.quality === 'excellent') breakdown.documentation = 30;
      else if (readme.quality === 'good') breakdown.documentation = 20;
      else if (readme.quality === 'basic') breakdown.documentation = 10;
      else breakdown.documentation = 5;
    }

    // Legal (max 25 points)
    const license = scanResults.communityFiles.found.find(f => 
      f.name.includes('LICENSE')
    );
    if (license) {
      breakdown.legal = license.quality === 'complete' ? 25 : 15;
    }

    // Community (max 25 points)
    const contributing = scanResults.communityFiles.found.find(f => 
      f.name.includes('CONTRIBUTING')
    );
    const codeOfConduct = scanResults.communityFiles.found.find(f => 
      f.name.includes('CODE_OF_CONDUCT')
    );
    if (contributing) breakdown.community += 15;
    if (codeOfConduct) breakdown.community += 10;

    // Management (max 10 points)
    const security = scanResults.communityFiles.found.find(f => 
      f.name.includes('SECURITY')
    );
    if (security) breakdown.management += 10;

    // Maintenance (max 10 points)
    const changelog = scanResults.communityFiles.found.find(f => 
      f.name.includes('CHANGELOG')
    );
    const github = scanResults.communityFiles.found.find(f => 
      f.name.includes('.github')
    );
    if (changelog) breakdown.maintenance += 5;
    if (github) breakdown.maintenance += 5;

    score = Object.values(breakdown).reduce((a, b) => a + b, 0);

    // Apply AI analysis score if available
    if (aiAnalysis && aiAnalysis.score) {
      score = Math.round((score + aiAnalysis.score) / 2);
    }

    return {
      score,
      maxScore: 100,
      breakdown
    };
  }

  generateRecommendations(scanResults, aiAnalysis) {
    const recommendations = [];

    // Check for missing critical files
    const criticalMissing = scanResults.communityFiles.missing.filter(
      f => f.priority === 'critical'
    );
    criticalMissing.forEach(f => {
      recommendations.push({
        priority: 'high',
        category: 'documentation',
        title: `Add ${f.name}`,
        description: `This file is essential for open source projects`
      });
    });

    // Check README quality
    const readme = scanResults.communityFiles.found.find(f => 
      f.name.includes('README')
    );
    if (!readme || readme.quality === 'basic' || readme.quality === 'minimal') {
      recommendations.push({
        priority: 'high',
        category: 'documentation',
        title: 'Improve README.md',
        description: 'Add installation instructions, usage examples, and contribution guidelines'
      });
    }

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

    // Check for high priority missing files
    const highPriorityMissing = scanResults.communityFiles.missing.filter(
      f => f.priority === 'high'
    );
    highPriorityMissing.forEach(f => {
      recommendations.push({
        priority: 'medium',
        category: 'community',
        title: `Add ${f.name}`,
        description: `Helps build a welcoming community`
      });
    });

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
    const { repository, ossReadiness, findings, aiAnalysis } = report.analysis;
    
    let output = '';
    
    // Header
    output += chalk.cyan.bold('━'.repeat(60)) + '\n';
    output += chalk.cyan.bold('📊 REPOSITORY ANALYSIS REPORT') + '\n';
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

    // OSS Readiness Score
    const scoreColor = ossReadiness.score >= 80 ? chalk.green : 
                       ossReadiness.score >= 60 ? chalk.yellow : chalk.red;
    output += chalk.white.bold('⭐ OSS Readiness Score: ') + 
              scoreColor.bold(`${ossReadiness.score}/100`) + '\n\n';

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
    
    return output;
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