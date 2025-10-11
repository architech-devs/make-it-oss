/**
 * Unit Tests for Open Source Scoring System
 * @jest-environment node
 */

import { 
  SCORING_CONFIG, 
  calculateOSSScore, 
  generateReport 
} from '../opensourceScoring.js';

describe('SCORING_CONFIG', () => {
  describe('Configuration Structure', () => {
    test('should have all required categories', () => {
      expect(SCORING_CONFIG.categories).toBeDefined();
      expect(SCORING_CONFIG.categories.documentation).toBeDefined();
      expect(SCORING_CONFIG.categories.community).toBeDefined();
      expect(SCORING_CONFIG.categories.legal).toBeDefined();
      expect(SCORING_CONFIG.categories.management).toBeDefined();
      expect(SCORING_CONFIG.categories.maintenance).toBeDefined();
    });

    test('category weights should sum to 1.0', () => {
      const totalWeight = Object.values(SCORING_CONFIG.categories)
        .reduce((sum, cat) => sum + cat.weight, 0);
      expect(totalWeight).toBeCloseTo(1.0, 5);
    });

    test('should have files configuration', () => {
      expect(SCORING_CONFIG.files).toBeDefined();
      expect(Object.keys(SCORING_CONFIG.files).length).toBeGreaterThan(10);
    });

    test('critical files should exist in configuration', () => {
      expect(SCORING_CONFIG.files['README.md']).toBeDefined();
      expect(SCORING_CONFIG.files['LICENSE']).toBeDefined();
      expect(SCORING_CONFIG.files['CONTRIBUTING.md']).toBeDefined();
    });

    test('each file should have required properties', () => {
      Object.entries(SCORING_CONFIG.files).forEach(([filename, config]) => {
        expect(config.category).toBeDefined();
        expect(config.basePoints).toBeDefined();
        expect(config.priority).toBeDefined();
        expect(['critical', 'high', 'medium', 'low']).toContain(config.priority);
      });
    });

    test('quality multipliers should be defined', () => {
      expect(SCORING_CONFIG.qualityMultipliers.template).toBe(0.3);
      expect(SCORING_CONFIG.qualityMultipliers.minimal).toBe(0.5);
      expect(SCORING_CONFIG.qualityMultipliers.basic).toBe(0.75);
      expect(SCORING_CONFIG.qualityMultipliers.good).toBe(1.0);
      expect(SCORING_CONFIG.qualityMultipliers.excellent).toBe(1.2);
    });

    test('bonus points should be configured', () => {
      expect(SCORING_CONFIG.bonusPoints).toBeInstanceOf(Array);
      expect(SCORING_CONFIG.bonusPoints.length).toBeGreaterThan(0);
      const totalBonusPoints = SCORING_CONFIG.bonusPoints
        .reduce((sum, bonus) => sum + bonus.points, 0);
      expect(totalBonusPoints).toBe(10);
    });
  });
});

describe('calculateOSSScore', () => {
  describe('Empty Repository', () => {
    test('should return zero score for completely empty repository', () => {
      const analysis = {
        repositoryName: 'test/empty',
        files: {}
      };

      const result = calculateOSSScore(analysis);

      expect(result.percentScore).toBe(0);
      expect(result.readinessLevel).toBe('Critical');
      expect(result.totalScore).toBe(0);
      expect(result.bonusPoints).toBe(0);
    });

    test('should provide recommendations for empty repository', () => {
      const analysis = {
        repositoryName: 'test/empty',
        files: {}
      };

      const result = calculateOSSScore(analysis);

      expect(result.recommendations).toBeInstanceOf(Array);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Minimal Repository (README + LICENSE only)', () => {
    test('should score basic README and LICENSE correctly', () => {
      const analysis = {
        repositoryName: 'test/minimal',
        files: {
          'README.md': {
            exists: true,
            content: 'A'.repeat(100) // Minimal content
          },
          'LICENSE': {
            exists: true,
            content: 'MIT License\n\nCopyright (c) 2025'
          }
        }
      };

      const result = calculateOSSScore(analysis);

      expect(result.percentScore).toBeGreaterThan(0);
      expect(result.percentScore).toBeLessThan(40);
      expect(result.readinessLevel).toBe('Critical');
    });
  });

  describe('Good Repository', () => {
    const goodRepoAnalysis = {
      repositoryName: 'test/good-repo',
      files: {
        'README.md': {
          exists: true,
          content: `# Project Title

## Description
Comprehensive description of the project with detailed information.

## Installation
\`\`\`bash
npm install project-name
\`\`\`

## Usage
\`\`\`javascript
import Project from 'project-name';
const project = new Project();
project.run();
\`\`\`

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct.

## License
This project is licensed under the MIT License.

## Contact
Email: contact@example.com
`.repeat(3) // 3000+ chars
        },
        'LICENSE': {
          exists: true,
          content: 'MIT License\n\nCopyright (c) 2025\n\nPermission is hereby granted...'
        },
        'CONTRIBUTING.md': {
          exists: true,
          content: `# Contributing Guide

## Development Setup
1. Clone the repository
2. Install dependencies: npm install
3. Run tests: npm test

## Contribution Process
1. Fork the repository
2. Create feature branch
3. Submit pull request

## Code Standards
Follow ESLint configuration and write tests.

## Testing Requirements
All code must have tests with 80%+ coverage.
`.repeat(2)
        },
        'CODE_OF_CONDUCT.md': {
          exists: true,
          content: `# Code of Conduct

## Pledge
We are committed to providing a welcoming environment.

## Unacceptable Behavior
Harassment and discrimination are not tolerated.

## Enforcement
Report violations to conduct@example.com for review.
`.repeat(2)
        },
        'SECURITY.md': {
          exists: true,
          content: `# Security Policy

Report security issues to security@example.com.
We will respond within 48 hours with an action plan.
`
        }
      },
      languages: ['JavaScript', 'TypeScript'],
      hasExamples: true,
      recentActivity: {
        recentIssues: 10,
        recentPRs: 8,
        lastCommitDays: 5
      }
    };

    test('should score good repository in Good or Fair range', () => {
      const result = calculateOSSScore(goodRepoAnalysis);

      expect(result.percentScore).toBeGreaterThan(60);
      expect(result.percentScore).toBeLessThan(90);
      expect(['Good', 'Fair']).toContain(result.readinessLevel);
    });

    test('should award bonus points for good practices', () => {
      const result = calculateOSSScore(goodRepoAnalysis);

      expect(result.bonusPoints).toBeGreaterThan(0);
      expect(result.bonusPoints).toBeLessThanOrEqual(10);
    });

    test('should populate category scores', () => {
      const result = calculateOSSScore(goodRepoAnalysis);

      expect(result.categoryScores.documentation.earned).toBeGreaterThan(0);
      expect(result.categoryScores.community.earned).toBeGreaterThan(0);
      expect(result.categoryScores.legal.earned).toBeGreaterThan(0);
    });
  });

  describe('Excellent Repository', () => {
    const excellentRepoAnalysis = {
      repositoryName: 'test/excellent-repo',
      files: {
        'README.md': {
          exists: true,
          content: `# Excellent Project

## Description
Comprehensive description with all necessary details.

## Features
- Feature 1: Advanced capabilities
- Feature 2: Easy integration  
- Feature 3: Performance optimized

## Installation
\`\`\`bash
npm install excellent-project
yarn add excellent-project
\`\`\`

## Usage
\`\`\`javascript
import Excellent from 'excellent-project';
const project = new Excellent({ option: 'value' });
project.run();
\`\`\`

## Contributing
See CONTRIBUTING.md for contribution guidelines.

## License
MIT License - see LICENSE file for details.

## Contact
- Email: support@example.com
- Discord: https://discord.gg/example
`.repeat(5) // 5000+ chars
        },
        'LICENSE': {
          exists: true,
          content: 'MIT License\n\nCopyright (c) 2025\n\nPermission is hereby granted...'
        },
        'CONTRIBUTING.md': {
          exists: true,
          content: 'A'.repeat(500)
        },
        'CODE_OF_CONDUCT.md': {
          exists: true,
          content: 'A'.repeat(300)
        },
        'SECURITY.md': {
          exists: true,
          content: 'A'.repeat(100)
        },
        '.github/ISSUE_TEMPLATE': {
          exists: true,
          isDirectory: true,
          fileCount: 3
        },
        '.github/pull_request_template.md': {
          exists: true,
          content: 'A'.repeat(100)
        },
        'CHANGELOG.md': {
          exists: true,
          content: 'A'.repeat(100),
          lastModified: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        'AUTHORS.md': {
          exists: true,
          content: 'Authors list'
        },
        'CODEOWNERS': {
          exists: true,
          content: '* @team'
        },
        '.github/workflows': {
          exists: true,
          isDirectory: true,
          fileCount: 2
        },
        'docs/': {
          exists: true,
          isDirectory: true,
          fileCount: 5
        }
      },
      languages: ['JavaScript', 'TypeScript', 'Python'],
      hasExamples: true,
      hasDocWebsite: true,
      recentActivity: {
        recentIssues: 50,
        recentPRs: 30,
        lastCommitDays: 2
      }
    };

    test('should score excellent repository above 75', () => {
      const result = calculateOSSScore(excellentRepoAnalysis);

      expect(result.percentScore).toBeGreaterThan(75);
      expect(['Good', 'Excellent']).toContain(result.readinessLevel);
    });

    test('should award maximum bonus points range', () => {
      const result = calculateOSSScore(excellentRepoAnalysis);

      expect(result.bonusPoints).toBeGreaterThanOrEqual(6);
      expect(result.bonusPoints).toBeLessThanOrEqual(10);
    });
  });

  describe('Quality Multiplier Application', () => {
    test('should apply template multiplier for very short content', () => {
      const analysis = {
        repositoryName: 'test/template',
        files: {
          'README.md': {
            exists: true,
            content: 'Short' // < 50 chars
          }
        }
      };

      const result = calculateOSSScore(analysis);
      const readmeScore = result.fileScores['README.md'];

      expect(readmeScore.multiplier).toBe(0.3);
    });

    test('should apply good multiplier for substantial content', () => {
      const analysis = {
        repositoryName: 'test/good-content',
        files: {
          'README.md': {
            exists: true,
            content: 'A'.repeat(2000) // 2000 chars
          }
        }
      };

      const result = calculateOSSScore(analysis);
      const readmeScore = result.fileScores['README.md'];

      expect(readmeScore.multiplier).toBe(1.0);
    });

    test('should apply excellent multiplier for comprehensive content', () => {
      const analysis = {
        repositoryName: 'test/excellent-content',
        files: {
          'README.md': {
            exists: true,
            content: 'A'.repeat(6000) // 6000 chars
          }
        }
      };

      const result = calculateOSSScore(analysis);
      const readmeScore = result.fileScores['README.md'];

      expect(readmeScore.multiplier).toBe(1.2);
    });
  });

  describe('Recommendations Generation', () => {
    test('should generate recommendations for missing critical files', () => {
      const analysis = {
        repositoryName: 'test/incomplete',
        files: {
          'README.md': {
            exists: true,
            content: 'Basic readme'
          }
        }
      };

      const result = calculateOSSScore(analysis);

      // Should have recommendations (some may be high priority for incomplete files)
      expect(result.recommendations.length).toBeGreaterThan(0);
      
      // Check that recommendations have valid priorities
      const validPriorities = ['critical', 'high', 'medium', 'low'];
      result.recommendations.forEach(rec => {
        expect(validPriorities).toContain(rec.priority);
      });
    });

    test('should prioritize critical recommendations first', () => {
      const analysis = {
        repositoryName: 'test/incomplete',
        files: {}
      };

      const result = calculateOSSScore(analysis);

      if (result.recommendations.length > 0) {
        expect(['critical', 'high']).toContain(result.recommendations[0].priority);
      }
    });
  });
});

describe('generateReport', () => {
  test('should generate complete report structure', () => {
    const analysis = {
      repositoryName: 'test/report-test',
      files: {
        'README.md': {
          exists: true,
          content: 'A'.repeat(1000)
        }
      }
    };

    const report = generateReport(analysis);

    expect(report).toHaveProperty('timestamp');
    expect(report).toHaveProperty('repository');
    expect(report).toHaveProperty('summary');
    expect(report).toHaveProperty('categories');
    expect(report).toHaveProperty('files');
    expect(report).toHaveProperty('recommendations');
    expect(report).toHaveProperty('scoreBreakdown');
  });

  test('should include valid timestamp', () => {
    const analysis = {
      repositoryName: 'test/timestamp',
      files: {}
    };

    const report = generateReport(analysis);
    const timestamp = new Date(report.timestamp);

    expect(timestamp).toBeInstanceOf(Date);
    expect(timestamp.getTime()).not.toBeNaN();
  });

  test('summary should contain all required fields', () => {
    const analysis = {
      repositoryName: 'test/summary',
      files: {
        'README.md': {
          exists: true,
          content: 'Test'
        }
      }
    };

    const report = generateReport(analysis);

    expect(report.summary).toHaveProperty('overallScore');
    expect(report.summary).toHaveProperty('readinessLevel');
    expect(report.summary).toHaveProperty('totalPoints');
    expect(report.summary).toHaveProperty('maxPoints');
    expect(report.summary).toHaveProperty('bonusPoints');
    expect(report.summary.maxPoints).toBe(100);
  });

  test('should include file details with scores', () => {
    const analysis = {
      repositoryName: 'test/file-details',
      files: {
        'README.md': {
          exists: true,
          content: 'A'.repeat(1000)
        },
        'LICENSE': {
          exists: true,
          content: 'MIT'
        }
      }
    };

    const report = generateReport(analysis);

    expect(report.files).toBeInstanceOf(Array);
    expect(report.files.length).toBeGreaterThan(0);
    
    const readmeDetail = report.files.find(f => f.file === 'README.md');
    expect(readmeDetail).toBeDefined();
    expect(readmeDetail).toHaveProperty('score');
    expect(readmeDetail).toHaveProperty('category');
    expect(readmeDetail).toHaveProperty('priority');
  });
});

describe('Edge Cases and Error Handling', () => {
  test('should handle null analysis gracefully', () => {
    const analysis = null;

    expect(() => calculateOSSScore(analysis)).not.toThrow();
  });

  test('should handle undefined files', () => {
    const analysis = {
      repositoryName: 'test/undefined-files'
    };

    const result = calculateOSSScore(analysis);

    expect(result.percentScore).toBe(0);
  });

  test('should handle malformed file data', () => {
    const analysis = {
      repositoryName: 'test/malformed',
      files: {
        'README.md': {
          exists: true
          // Missing content
        }
      }
    };

    expect(() => calculateOSSScore(analysis)).not.toThrow();
  });

  test('should cap total score at 100', () => {
    const analysis = {
      repositoryName: 'test/max-score',
      files: {
        'README.md': {
          exists: true,
          content: 'A'.repeat(10000)
        }
      }
    };

    const result = calculateOSSScore(analysis);

    expect(result.totalScore).toBeLessThanOrEqual(100);
    expect(result.percentScore).toBeLessThanOrEqual(100);
  });
});

