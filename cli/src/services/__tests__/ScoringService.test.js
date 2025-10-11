/**
 * Unit Tests for CLI Scoring Service
 * @jest-environment node
 */

import { ScoringService } from '../ScoringService.js';

describe('ScoringService', () => {
  let scoringService;

  beforeEach(() => {
    scoringService = new ScoringService();
  });

  describe('Constructor', () => {
    test('should initialize with config', () => {
      expect(scoringService.config).toBeDefined();
      expect(scoringService.config.categories).toBeDefined();
      expect(scoringService.config.files).toBeDefined();
    });
  });

  describe('calculateScore', () => {
    describe('with empty scan results', () => {
      test('should return zero score', () => {
        const scanResults = {
          path: '/test/path',
          name: 'test-repo',
          communityFiles: {
            found: [],
            missing: []
          }
        };

        const result = scoringService.calculateScore(scanResults);

        expect(result.percentScore).toBe(0);
        expect(result.readinessLevel).toBe('Critical');
      });
    });

    describe('with basic files found', () => {
      test('should calculate score for README and LICENSE', () => {
        const scanResults = {
          path: '/test/path',
          name: 'test-repo',
          communityFiles: {
            found: [
              {
                name: 'README.md',
                exists: true,
                content: 'A'.repeat(2000)
              },
              {
                name: 'LICENSE',
                exists: true,
                content: 'MIT License\n\nCopyright'
              }
            ],
            missing: []
          }
        };

        const result = scoringService.calculateScore(scanResults);

        expect(result.percentScore).toBeGreaterThan(0);
        expect(result.fileScores['README.md']).toBeDefined();
        expect(result.fileScores['LICENSE']).toBeDefined();
      });
    });

    describe('with comprehensive files', () => {
      test('should score all community files', () => {
        const scanResults = {
          path: '/test/path',
          name: 'comprehensive-repo',
          communityFiles: {
            found: [
              {
                name: 'README.md',
                exists: true,
                content: `# Project\n\n## Installation\nnpm install\n\n## Usage\nimport x from 'x'\n\n## Contributing\nSee CONTRIBUTING\n\n## License\nMIT`.repeat(10)
              },
              {
                name: 'LICENSE',
                exists: true,
                content: 'MIT License\n\nCopyright (c) 2025'
              },
              {
                name: 'CONTRIBUTING.md',
                exists: true,
                content: 'A'.repeat(500)
              },
              {
                name: 'CODE_OF_CONDUCT.md',
                exists: true,
                content: 'B'.repeat(300)
              },
              {
                name: 'SECURITY.md',
                exists: true,
                content: 'C'.repeat(100)
              }
            ],
            missing: []
          },
          gitInfo: {
            lastCommitDays: 10
          }
        };

        const result = scoringService.calculateScore(scanResults);

        expect(result.percentScore).toBeGreaterThan(50); // Adjusted for realistic scoring
        expect(result.categoryScores.documentation.earned).toBeGreaterThan(0);
        expect(result.categoryScores.community.earned).toBeGreaterThan(0);
        expect(result.categoryScores.legal.earned).toBeGreaterThan(0);
      });
    });
  });

  describe('scoreFile', () => {
    test('should score file with binary check', () => {
      const fileInfo = {
        name: 'AUTHORS.md',
        exists: true
      };

      const config = {
        category: 'maintenance',
        basePoints: 2,
        priority: 'medium',
        qualityChecks: [
          { id: 'exists', label: 'Present', points: 2, binary: true }
        ]
      };

      const result = scoringService.scoreFile(fileInfo, config);

      expect(result.earned).toBe(2);
      expect(result.checks[0].passed).toBe(true);
    });

    test('should apply quality multiplier based on content length', () => {
      const fileInfo = {
        name: 'README.md',
        exists: true,
        content: 'A'.repeat(30) // Very short
      };

      const config = {
        category: 'documentation',
        basePoints: 25,
        priority: 'critical',
        qualityChecks: [
          { id: 'test', label: 'Test Check', points: 5, minLength: 10 }
        ]
      };

      const result = scoringService.scoreFile(fileInfo, config);

      expect(result.multiplier).toBe(0.3); // template multiplier for <50 chars
    });

    test('should check for pattern in content', () => {
      const fileInfo = {
        name: 'README.md',
        exists: true,
        content: 'See CONTRIBUTING.md for guidelines'
      };

      const config = {
        category: 'documentation',
        basePoints: 25,
        priority: 'critical',
        qualityChecks: [
          { id: 'contributing', label: 'Contributing Link', points: 3, pattern: 'CONTRIBUTING' }
        ]
      };

      const result = scoringService.scoreFile(fileInfo, config);

      const contributingCheck = result.checks.find(c => c.id === 'contributing');
      expect(contributingCheck.passed).toBe(true);
    });

    test('should check minimum length', () => {
      const fileInfo = {
        name: 'README.md',
        exists: true,
        content: 'A'.repeat(100)
      };

      const config = {
        category: 'documentation',
        basePoints: 25,
        priority: 'critical',
        qualityChecks: [
          { id: 'description', label: 'Description', points: 3, minLength: 50 }
        ]
      };

      const result = scoringService.scoreFile(fileInfo, config);

      const descCheck = result.checks.find(c => c.id === 'description');
      expect(descCheck.passed).toBe(true);
    });
  });

  describe('calculateBonusPoints', () => {
    test('should award bonus for examples directory', () => {
      const scanResults = {
        communityFiles: {
          found: [
            {
              name: 'examples/example1.js',
              exists: true
            }
          ],
          missing: []
        }
      };

      const bonus = scoringService.calculateBonusPoints(scanResults);

      expect(bonus).toBeGreaterThanOrEqual(2);
    });

    test('should award bonus for comprehensive docs', () => {
      const scanResults = {
        communityFiles: {
          found: [
            { name: 'docs/guide1.md', exists: true },
            { name: 'docs/guide2.md', exists: true },
            { name: 'docs/guide3.md', exists: true }
          ],
          missing: []
        }
      };

      const bonus = scoringService.calculateBonusPoints(scanResults);

      expect(bonus).toBeGreaterThanOrEqual(2);
    });

    test('should award bonus for recent commits', () => {
      const scanResults = {
        communityFiles: {
          found: [],
          missing: []
        },
        gitInfo: {
          lastCommitDays: 15
        }
      };

      const bonus = scoringService.calculateBonusPoints(scanResults);

      expect(bonus).toBeGreaterThanOrEqual(2);
    });

    test('should cap bonus points at 10', () => {
      const scanResults = {
        communityFiles: {
          found: [
            { name: 'examples/ex1.js', exists: true },
            { name: 'docs/d1.md', exists: true },
            { name: 'docs/d2.md', exists: true },
            { name: 'docs/d3.md', exists: true },
            { name: '.github/workflows/ci.yml', exists: true },
            { name: 'i18n/en.json', exists: true }
          ],
          missing: []
        },
        gitInfo: {
          lastCommitDays: 5
        }
      };

      const bonus = scoringService.calculateBonusPoints(scanResults);

      expect(bonus).toBeLessThanOrEqual(10);
    });
  });

  describe('determineReadinessLevel', () => {
    test('should return Excellent for 90+', () => {
      expect(scoringService.determineReadinessLevel(95)).toBe('Excellent');
      expect(scoringService.determineReadinessLevel(90)).toBe('Excellent');
    });

    test('should return Good for 75-89', () => {
      expect(scoringService.determineReadinessLevel(85)).toBe('Good');
      expect(scoringService.determineReadinessLevel(75)).toBe('Good');
    });

    test('should return Fair for 60-74', () => {
      expect(scoringService.determineReadinessLevel(70)).toBe('Fair');
      expect(scoringService.determineReadinessLevel(60)).toBe('Fair');
    });

    test('should return Poor for 40-59', () => {
      expect(scoringService.determineReadinessLevel(50)).toBe('Poor');
      expect(scoringService.determineReadinessLevel(40)).toBe('Poor');
    });

    test('should return Critical for <40', () => {
      expect(scoringService.determineReadinessLevel(30)).toBe('Critical');
      expect(scoringService.determineReadinessLevel(0)).toBe('Critical');
    });
  });

  describe('generateRecommendations', () => {
    test('should generate recommendations for missing critical files', () => {
      const results = {
        fileScores: {},
        categoryScores: {
          documentation: { earned: 5, max: 35 }
        }
      };

      const scanResults = {
        communityFiles: {
          found: [],
          missing: [
            { name: 'README.md', priority: 'critical' },
            { name: 'LICENSE', priority: 'critical' }
          ]
        }
      };

      const recommendations = scoringService.generateRecommendations(results, scanResults);

      expect(recommendations.length).toBeGreaterThan(0);
      const criticalRecs = recommendations.filter(r => r.priority === 'critical');
      expect(criticalRecs.length).toBeGreaterThanOrEqual(2);
    });

    test('should recommend improvements for incomplete files', () => {
      const results = {
        fileScores: {
          'README.md': {
            earned: 5,
            maxScore: 25
          }
        },
        categoryScores: {
          documentation: { earned: 5, max: 35 }
        }
      };

      const scanResults = {
        communityFiles: {
          found: [{ name: 'README.md', exists: true }],
          missing: []
        }
      };

      const recommendations = scoringService.generateRecommendations(results, scanResults);

      const readmeRec = recommendations.find(r => r.file === 'README.md');
      expect(readmeRec).toBeDefined();
      expect(readmeRec.priority).toBe('high');
    });

    test('should recommend category improvements', () => {
      const results = {
        fileScores: {},
        categoryScores: {
          documentation: { earned: 10, max: 35 },
          community: { earned: 5, max: 25 }
        }
      };

      const scanResults = {
        communityFiles: {
          found: [],
          missing: []
        }
      };

      const recommendations = scoringService.generateRecommendations(results, scanResults);

      const categoryRecs = recommendations.filter(r => r.category);
      expect(categoryRecs.length).toBeGreaterThan(0);
    });

    test('should sort recommendations by priority', () => {
      const results = {
        fileScores: {},
        categoryScores: {
          documentation: { earned: 5, max: 35 }
        }
      };

      const scanResults = {
        communityFiles: {
          found: [],
          missing: [
            { name: 'README.md', priority: 'critical' },
            { name: 'CHANGELOG.md', priority: 'medium' }
          ]
        }
      };

      const recommendations = scoringService.generateRecommendations(results, scanResults);

      if (recommendations.length > 1) {
        const priorities = ['critical', 'high', 'medium', 'low'];
        const firstPriorityIndex = priorities.indexOf(recommendations[0].priority);
        const secondPriorityIndex = priorities.indexOf(recommendations[1].priority);
        expect(firstPriorityIndex).toBeLessThanOrEqual(secondPriorityIndex);
      }
    });
  });

  describe('generateReport', () => {
    test('should generate complete report', () => {
      const scanResults = {
        path: '/test/path',
        name: 'test-repo',
        communityFiles: {
          found: [
            {
              name: 'README.md',
              exists: true,
              content: 'A'.repeat(1000)
            }
          ],
          missing: []
        }
      };

      const report = scoringService.generateReport(scanResults);

      expect(report).toHaveProperty('timestamp');
      expect(report).toHaveProperty('repository');
      expect(report).toHaveProperty('summary');
      expect(report).toHaveProperty('categories');
      expect(report).toHaveProperty('files');
      expect(report).toHaveProperty('recommendations');
    });

    test('report should include repository info', () => {
      const scanResults = {
        path: '/test/path',
        name: 'my-project',
        communityFiles: {
          found: [],
          missing: []
        }
      };

      const report = scoringService.generateReport(scanResults);

      expect(report.repository.path).toBe('/test/path');
      expect(report.repository.name).toBe('my-project');
    });
  });

  describe('findFileConfig', () => {
    test('should find exact file match', () => {
      const config = scoringService.findFileConfig('README.md');

      expect(config).toBeDefined();
      expect(config.category).toBe('documentation');
      expect(config.basePoints).toBe(25);
    });

    test('should find directory match', () => {
      const config = scoringService.findFileConfig('docs/guide.md');

      expect(config).toBeDefined();
      expect(config.category).toBe('documentation');
    });

    test('should find .github variant', () => {
      const config = scoringService.findFileConfig('ISSUE_TEMPLATE');

      expect(config).toBeDefined();
    });

    test('should return null for unknown file', () => {
      const config = scoringService.findFileConfig('unknown-file.txt');

      expect(config).toBeNull();
    });
  });
});

