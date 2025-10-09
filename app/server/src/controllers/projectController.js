import { GeminiResponse } from '../services/geminiService.js';
import { getSystemExplanationPrompt, getComponentMappingPrompt } from '../utils/prompt.js';
import { getOctokitInstance, fetchFiles } from '../services/githubService.js';
import { getCommunityFilePaths } from '../utils/communityFiles.js';

export const scanProject = async (req, res) => {
    const { repoUrl } = req.body;

    if (!repoUrl || !repoUrl.includes('github.com')) {
        return res.status(400).json({ message: 'Invalid GitHub repository URL' });
    }

    try {
        const [owner, repoRaw] = repoUrl.split('github.com/')[1].split('/');
        const repo = repoRaw.replace(/\.git$/, '').replace(/\/$/, '');

        const octokit = await getOctokitInstance(); 

        try {
            const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
            const defaultBranch = repoData.default_branch;
            const { fileTree, codeSamples } = await fetchFiles(octokit, owner, repo, defaultBranch);

            if (!codeSamples.trim()) {
                return res.status(400).json({ success: false, message: 'No relevant code files found in the repository. Please ensure the repository contains source code files.' });
            }

            const step1Prompt = getSystemExplanationPrompt(fileTree, codeSamples);
            const explanation = await GeminiResponse(step1Prompt);

            const step2Prompt = getComponentMappingPrompt(explanation, fileTree);
            const componentMap = await GeminiResponse(step2Prompt);

            res.json({ success: true, summary: explanation, componentMapping: componentMap, repoUrl: repoUrl });

        } catch (repoError) {
            if (repoError.status === 404) {
                return res.status(404).json({ success: false, message: 'Repository not found or not accessible. Please check the URL and ensure the repository is public or you have access to it.' });
            } else if (repoError.status === 403) {
                return res.status(403).json({ success: false, message: 'Repository is private and you don\'t have access. Please connect your GitHub account to access private repositories.' });
            }
            throw repoError;
        }

    } catch (err) {
        console.error('Repository analysis failed:', err);
        let errorMessage = 'Failed to analyze repository';
        if (err.message.includes('Request Entity Too Large')) {
            errorMessage = 'Repository too large to analyze. Please try with a smaller repository or fewer files.';
        } else if (err.message.includes('rate limit') || err.message.includes('quota exceeded')) {
            errorMessage = 'API rate limit exceeded. Please try again later.';
        } else if (err.message.includes('authentication')) {
            errorMessage = 'GitHub authentication failed. Please check your GitHub token.';
        } else if (err.message.includes('All API keys are currently rate limited')) {
            errorMessage = 'All API keys are rate limited. Please try again later.';
        }
        res.status(500).json({ success: false, message: errorMessage });
    }
};

export const executeTask = async (req, res) => {
    const { message, operation } = req.body;
    if (!message || !operation) {
        return res.status(400).json({ message: 'Message and operation are required' });
    }
    
    try {
        const prompt = `Based on the following message and operation, generate content: Message: ${message}, Operation: ${operation}`;
        const result = await GeminiResponse(prompt);
        res.json({ success: true, result: result });
    } catch (error) {
        console.error('Execute task failed:', error);
        res.status(500).json({ success: false, message: 'Failed to execute task' });
    }
};

export const fetchCommunityFiles = async (req, res) => {
    console.log('🔍 Fetch files called, body:', req.body);
    const { repoUrl } = req.body;

    if (!repoUrl || !repoUrl.includes('github.com')) {
        return res.status(400).json({ message: 'Invalid GitHub repository URL' });
    }

    try {
        const [owner, repoRaw] = repoUrl.split('github.com/')[1].split('/');
        const repo = repoRaw.replace(/\.git$/, '').replace(/\/$/, '');

        const octokit = await getOctokitInstance();

        // Get community files to check from the config
        const communityFiles = getCommunityFilePaths();

        const detectedFiles = [];

        // Check each file
        for (const filePath of communityFiles) {
            try {
                await octokit.rest.repos.getContent({
                    owner,
                    repo,
                    path: filePath
                });
                // If no error, file exists
                detectedFiles.push({
                    name: filePath,
                    exists: true
                });
            } catch (error) {
                // File doesn't exist
                if (error.status === 404) {
                    detectedFiles.push({
                        name: filePath,
                        exists: false
                    });
                }
            }
        }

        res.json({
            success: true,
            files: detectedFiles,
            repoUrl: repoUrl
        });

    } catch (err) {
        console.error('Failed to fetch community files:', err);
        let errorMessage = 'Failed to fetch community files';
        
        if (err.status === 404) {
            errorMessage = 'Repository not found. Please check the URL.';
        } else if (err.status === 403) {
            errorMessage = 'Repository is private or access denied.';
        }
        
        res.status(500).json({
            success: false,
            message: errorMessage
        });
    }
};