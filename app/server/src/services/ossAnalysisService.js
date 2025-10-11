import { generateReport, SCORING_CONFIG } from '../utils/opensourceScoring.js';
import { getOctokitInstance } from './githubService.js';

/**
 * Comprehensive OSS Analysis Service
 * Fetches repository files and analyzes OSS readiness using the scoring system
 */

/**
 * Fetch file content with metadata from GitHub
 */
async function fetchFileWithContent(octokit, owner, repo, path) {
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path });
    
    if (data.type === 'file' && data.content) {
      const content = Buffer.from(data.content, 'base64').toString('utf8');
      return {
        exists: true,
        content: content,
        size: data.size,
        lastModified: data.sha // We'll use commit data for actual modified date
      };
    } else if (data.type === 'dir') {
      // For directories, count files
      return {
        exists: true,
        isDirectory: true,
        fileCount: Array.isArray(data) ? data.length : 1
      };
    }
    
    return { exists: false };
  } catch (error) {
    if (error.status === 404) {
      return { exists: false };
    }
    console.error('Error fetching file with content:', error.message);
    throw error;
  }
}

/**
 * Fetch last commit date for a file
 */
async function fetchFileLastModified(octokit, owner, repo, path) {
  try {
    const { data: commits } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      path,
      per_page: 1
    });
    
    if (commits.length > 0) {
      return commits[0].commit.committer.date;
    }
    return null;
  } catch (error) {
    console.error('Error fetching last modified date:', error.message);
    return null;
  }
}

/**
 * Check for directories like .github/workflows or docs/
 */
async function checkDirectory(octokit, owner, repo, dirPath) {
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path: dirPath });
    
    if (Array.isArray(data)) {
      // It's a directory with files
      const totalContent = data.reduce((sum, file) => sum + (file.size || 0), 0);
      return {
        exists: true,
        isDirectory: true,
        fileCount: data.length,
        content: '', // Directories don't have content for scoring
        totalSize: totalContent
      };
    }
    
    return { exists: false };
  } catch (error) {
    if (error.status === 404) {
      return { exists: false };
    }
    console.error('Error checking directory:', error.message);
    throw error;
  }
}

/**
 * Fetch repository metadata for bonus points calculation
 */
async function fetchRepoMetadata(octokit, owner, repo) {
  try {
    const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
    
    // Get recent commits
    const { data: commits } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      per_page: 10
    });
    
    // Get recent issues
    const { data: issues } = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      state: 'all',
      since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
      per_page: 100
    });
    
    // Get recent PRs (issues with pull_request property)
    const recentPRs = issues.filter(issue => issue.pull_request);
    const recentIssues = issues.filter(issue => !issue.pull_request);
    
    // Calculate days since last commit
    let lastCommitDays = null;
    if (commits.length > 0) {
      const lastCommitDate = new Date(commits[0].commit.committer.date);
      lastCommitDays = Math.floor((Date.now() - lastCommitDate.getTime()) / (1000 * 60 * 60 * 24));
    }
    
    return {
      languages: repoData.language ? [repoData.language] : [],
      hasExamples: false, // Will be checked separately
      hasDocWebsite: !!repoData.homepage,
      recentActivity: {
        recentIssues: recentIssues.length,
        recentPRs: recentPRs.length,
        lastCommitDays: lastCommitDays
      }
    };
  } catch (error) {
    console.error('Error fetching repo metadata:', error.message);
    return {
      languages: [],
      hasExamples: false,
      hasDocWebsite: false,
      recentActivity: {
        recentIssues: 0,
        recentPRs: 0,
        lastCommitDays: null
      }
    };
  }
}

/**
 * Comprehensive repository analysis
 */
export async function analyzeRepository(repoUrl) {
  // Parse repository URL
  const urlMatch = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!urlMatch) {
    throw new Error('Invalid GitHub repository URL');
  }
  
  const owner = urlMatch[1];
  const repo = urlMatch[2].replace(/\.git$/, '').replace(/\/$/, '');
  
  const octokit = await getOctokitInstance();
  
  // Fetch repository metadata
  const metadata = await fetchRepoMetadata(octokit, owner, repo);
  
  // Prepare analysis object
  const analysis = {
    repositoryName: `${owner}/${repo}`,
    files: {},
    ...metadata
  };
  
  // Get all files to check from scoring config
  const filesToCheck = Object.keys(SCORING_CONFIG.files);
  
  // Fetch each file
  for (const filename of filesToCheck) {
    if (filename.endsWith('/')) {
      // It's a directory
      const dirPath = filename.slice(0, -1); // Remove trailing slash
      analysis.files[filename] = await checkDirectory(octokit, owner, repo, dirPath);
    } else {
      // It's a file - check multiple possible locations
      const possiblePaths = [
        filename,
        `.github/${filename}`,
        `${filename}.md`,
        `.github/${filename}.md`
      ];
      
      let fileData = null;
      for (const path of possiblePaths) {
        const data = await fetchFileWithContent(octokit, owner, repo, path);
        if (data.exists) {
          // Get last modified date
          const lastModified = await fetchFileLastModified(octokit, owner, repo, path);
          data.lastModified = lastModified;
          fileData = data;
          break;
        }
      }
      
      analysis.files[filename] = fileData || { exists: false };
    }
  }
  
  // Check for examples directory (for bonus points)
  const examplesCheck = await checkDirectory(octokit, owner, repo, 'examples');
  if (examplesCheck.exists) {
    analysis.hasExamples = true;
  }
  
  // Calculate score
  const report = generateReport(analysis);
  
  return report;
}

/**
 * Quick check of community files (lightweight version)
 */
export async function quickCheckCommunityFiles(repoUrl) {
  const urlMatch = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!urlMatch) {
    throw new Error('Invalid GitHub repository URL');
  }
  
  const owner = urlMatch[1];
  const repo = urlMatch[2].replace(/\.git$/, '').replace(/\/$/, '');
  
  const octokit = await getOctokitInstance();
  
  const criticalFiles = [
    'README.md',
    'LICENSE',
    'CONTRIBUTING.md',
    'CODE_OF_CONDUCT.md',
    'SECURITY.md'
  ];
  
  const results = [];
  
  for (const filename of criticalFiles) {
    const possiblePaths = [filename, `.github/${filename}`];
    let found = false;
    
    for (const path of possiblePaths) {
      try {
        await octokit.rest.repos.getContent({ owner, repo, path });
        found = true;
        break;
      } catch (error) {
        // File not found at this path, continue checking other paths
        if (error.status !== 404) {
          console.error(`Error checking file ${path}:`, error.message);
        }
      }
    }
    
    results.push({
      name: filename,
      exists: found,
      priority: SCORING_CONFIG.files[filename]?.priority || 'medium'
    });
  }
  
  return results;
}

export default {
  analyzeRepository,
  quickCheckCommunityFiles
};

