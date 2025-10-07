// Community files that are important for open source projects
// These files can exist in either the root directory or the .github directory

const communityFiles = [
    // Essential files
    'README.md',
    'LICENSE', // Only LICENSE, no extensions as per feedback
    'CONTRIBUTING.md',
    'CODE_OF_CONDUCT.md',
    'SECURITY.md', // Added as per feedback for good open source practices
    
    // Issue and PR templates
    'PULL_REQUEST_TEMPLATE.md',
    'ISSUE_TEMPLATE.md',
    'ISSUE_TEMPLATE/bug_report.md',
    'ISSUE_TEMPLATE/feature_request.md',
    
    // Additional good-to-have files for open source projects
    'CHANGELOG.md',
    'AUTHORS.md',
    'CONTRIBUTORS.md',
    'SUPPORT.md',
    'FUNDING.yml',
    'CODEOWNERS',
    'dependabot.yml'
];

/**
 * Get all possible paths for community files
 * Files can exist in root directory or .github directory
 * @returns {string[]} Array of all file paths to check
 */
export const getCommunityFilePaths = () => {
    const paths = [];
    
    communityFiles.forEach(file => {
        // Add root path
        paths.push(file);
        
        // Add .github path (except for README.md and LICENSE which are typically in root)
        if (file !== 'README.md' && file !== 'LICENSE') {
            paths.push(`.github/${file}`);
        }
    });
    
    return paths;
};

/**
 * Get the base community files list
 * @returns {string[]} Array of community file names
 */
export const getCommunityFiles = () => {
    return [...communityFiles];
};

export default {
    getCommunityFilePaths,
    getCommunityFiles
};