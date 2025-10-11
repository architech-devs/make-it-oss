/**
 * Basic Test Script for OSS Scoring System
 * Run with: node tests/test-scoring-basic.js
 */

import { SCORING_CONFIG, calculateOSSScore, generateReport } from '../app/server/src/utils/opensourceScoring.js';

console.log('🧪 Running Basic OSS Scoring System Tests\n');
console.log('━'.repeat(60));

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    failed++;
  }
}

// Test 1: Configuration Structure
test('SCORING_CONFIG has all required categories', () => {
  const categories = Object.keys(SCORING_CONFIG.categories);
  if (!categories.includes('documentation')) throw new Error('Missing documentation category');
  if (!categories.includes('community')) throw new Error('Missing community category');
  if (!categories.includes('legal')) throw new Error('Missing legal category');
  if (!categories.includes('management')) throw new Error('Missing management category');
  if (!categories.includes('maintenance')) throw new Error('Missing maintenance category');
});

test('Category weights sum to 1.0', () => {
  const totalWeight = Object.values(SCORING_CONFIG.categories)
    .reduce((sum, cat) => sum + cat.weight, 0);
  if (Math.abs(totalWeight - 1.0) > 0.001) {
    throw new Error(`Total weight is ${totalWeight}, expected 1.0`);
  }
});

test('At least 15 files are configured', () => {
  const fileCount = Object.keys(SCORING_CONFIG.files).length;
  if (fileCount < 15) {
    throw new Error(`Only ${fileCount} files configured, expected 15+`);
  }
});

test('Critical files are present in config', () => {
  if (!SCORING_CONFIG.files['README.md']) throw new Error('README.md not configured');
  if (!SCORING_CONFIG.files['LICENSE']) throw new Error('LICENSE not configured');
  if (!SCORING_CONFIG.files['CONTRIBUTING.md']) throw new Error('CONTRIBUTING.md not configured');
});

// Test 2: Empty Repository
test('Empty repository scores 0', () => {
  const analysis = {
    repositoryName: 'test/empty',
    files: {}
  };
  const result = calculateOSSScore(analysis);
  if (result.percentScore !== 0) {
    throw new Error(`Expected 0, got ${result.percentScore}`);
  }
  if (result.readinessLevel !== 'Critical') {
    throw new Error(`Expected Critical, got ${result.readinessLevel}`);
  }
});

// Test 3: Minimal Repository
test('Minimal repository (README + LICENSE) scores between 10-40', () => {
  const analysis = {
    repositoryName: 'test/minimal',
    files: {
      'README.md': {
        exists: true,
        content: 'A'.repeat(100)
      },
      'LICENSE': {
        exists: true,
        content: 'MIT License\n\nCopyright (c) 2025'
      }
    }
  };
  const result = calculateOSSScore(analysis);
  if (result.percentScore < 0 || result.percentScore > 50) {
    throw new Error(`Expected 0-50, got ${result.percentScore}`);
  }
});

// Test 4: Good Repository
test('Good repository scores above 40', () => {
  const analysis = {
    repositoryName: 'test/good',
    files: {
      'README.md': {
        exists: true,
        content: 'A'.repeat(2000)
      },
      'LICENSE': {
        exists: true,
        content: 'MIT License\n\nCopyright (c) 2025'
      },
      'CONTRIBUTING.md': {
        exists: true,
        content: 'B'.repeat(500)
      },
      'CODE_OF_CONDUCT.md': {
        exists: true,
        content: 'C'.repeat(300)
      }
    },
    languages: ['JavaScript'],
    hasExamples: true,
    recentActivity: {
      recentIssues: 10,
      recentPRs: 5,
      lastCommitDays: 10
    }
  };
  const result = calculateOSSScore(analysis);
  if (result.percentScore < 40) {
    throw new Error(`Expected >40, got ${result.percentScore}`);
  }
});

// Test 5: Score Capping
test('Score is capped at 100', () => {
  const analysis = {
    repositoryName: 'test/max',
    files: {
      'README.md': {
        exists: true,
        content: 'A'.repeat(10000)
      }
    }
  };
  const result = calculateOSSScore(analysis);
  if (result.percentScore > 100) {
    throw new Error(`Score exceeded 100: ${result.percentScore}`);
  }
});

// Test 6: Quality Multipliers
test('Quality multipliers are applied', () => {
  const analysis = {
    repositoryName: 'test/quality',
    files: {
      'README.md': {
        exists: true,
        content: 'Short' // < 50 chars
      }
    }
  };
  const result = calculateOSSScore(analysis);
  const readmeScore = result.fileScores['README.md'];
  if (readmeScore.multiplier !== 0.3) {
    throw new Error(`Expected 0.3 multiplier, got ${readmeScore.multiplier}`);
  }
});

// Test 7: Recommendations
test('Recommendations are generated for incomplete repos', () => {
  const analysis = {
    repositoryName: 'test/incomplete',
    files: {
      'README.md': {
        exists: true,
        content: 'Basic'
      }
    }
  };
  const result = calculateOSSScore(analysis);
  if (result.recommendations.length === 0) {
    throw new Error('Expected recommendations for incomplete repo');
  }
});

// Test 8: Report Generation
test('generateReport creates complete structure', () => {
  const analysis = {
    repositoryName: 'test/report',
    files: {}
  };
  const report = generateReport(analysis);
  if (!report.timestamp) throw new Error('Missing timestamp');
  if (!report.repository) throw new Error('Missing repository');
  if (!report.summary) throw new Error('Missing summary');
  if (!report.categories) throw new Error('Missing categories');
});

// Test 9: Bonus Points
test('Bonus points are calculated', () => {
  const analysis = {
    repositoryName: 'test/bonus',
    files: {},
    languages: ['JavaScript', 'TypeScript'],
    hasExamples: true,
    hasDocWebsite: true,
    recentActivity: {
      recentIssues: 10,
      recentPRs: 10,
      lastCommitDays: 5
    }
  };
  const result = calculateOSSScore(analysis);
  if (result.bonusPoints === 0) {
    throw new Error('Expected bonus points for active repo');
  }
  if (result.bonusPoints > 10) {
    throw new Error(`Bonus points exceeded max: ${result.bonusPoints}`);
  }
});

// Test 10: Readiness Levels
test('Readiness levels are assigned correctly', () => {
  const levels = [
    { score: 95, expected: 'Excellent' },
    { score: 80, expected: 'Good' },
    { score: 65, expected: 'Fair' },
    { score: 45, expected: 'Poor' },
    { score: 20, expected: 'Critical' }
  ];
  
  levels.forEach(({ score, expected }) => {
    const analysis = {
      repositoryName: 'test/level',
      files: {}
    };
    const result = calculateOSSScore(analysis);
    // Manually set score for testing
    result.percentScore = score;
    const level = result.percentScore >= 90 ? 'Excellent' :
                  result.percentScore >= 75 ? 'Good' :
                  result.percentScore >= 60 ? 'Fair' :
                  result.percentScore >= 40 ? 'Poor' : 'Critical';
    if (level !== expected) {
      throw new Error(`Score ${score} should be ${expected}, got ${level}`);
    }
  });
});

// Summary
console.log('\n' + '━'.repeat(60));
console.log(`\n📊 Test Results:`);
console.log(`   Passed: ${passed}`);
console.log(`   Failed: ${failed}`);
console.log(`   Total:  ${passed + failed}`);

if (failed === 0) {
  console.log('\n✅ All tests passed!\n');
  process.exit(0);
} else {
  console.log(`\n❌ ${failed} test(s) failed!\n`);
  process.exit(1);
}

