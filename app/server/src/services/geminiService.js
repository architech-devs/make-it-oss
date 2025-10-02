import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKeys = process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(',').map(k => k.trim()).filter(Boolean) : [];
let keyIndex = 0;
const failedKeys = new Map();
const RATE_LIMIT_COOLDOWN = 60000;

function getNextApiKey() {
    if (apiKeys.length === 0) {
        throw new Error('No Gemini API keys configured');
    }
    const now = Date.now();
    for (const [key, data] of failedKeys.entries()) {
        const backoffTime = Math.min(300000, RATE_LIMIT_COOLDOWN * (data.attempts + 1));
        if (now - data.timestamp > backoffTime) {
            failedKeys.delete(key);
        }
    }
    let attempts = 0;
    while (attempts < apiKeys.length) {
        const key = apiKeys[keyIndex];
        const maskedKey = key.length > 8 ? key.slice(0, 6) + '*'.repeat(key.length - 8) + key.slice(-2) : key;
        if (process.env.MODE === 'dev') {
            console.log(`[GeminiService - getNextApiKey] Attempting to use API key: ${maskedKey}`);
        }
        keyIndex = (keyIndex + 1) % apiKeys.length;
        if (!failedKeys.has(key)) {
            return key;
        }
        if (process.env.MODE === 'dev') {
            console.log(`[GeminiService - getNextApiKey] Skipping rate-limited API key: ${maskedKey}`);
        }
        attempts++;
    }
    throw new Error('All API keys are currently rate limited. Please try again later.');
}

function markKeyAsFailed(apiKey) {
    const entry = failedKeys.get(apiKey) || { attempts: 0, timestamp: Date.now() };
    failedKeys.set(apiKey, { attempts: entry.attempts + 1, timestamp: Date.now() });
    if (process.env.MODE === 'dev') {
        const maskedKey = apiKey.length > 8 ? apiKey.slice(0, 6) + '*'.repeat(apiKey.length - 8) + apiKey.slice(-2) : apiKey;
        console.log(`[GeminiService] Marked key as rate limited: ${maskedKey} (attempt ${entry.attempts + 1})`);
    }
}

const modelCache = {};

export function getGenerativeModel(options = {}) {
    const modelOptions = { model: "gemini-2.0-flash", ...options };
    const apiKey = getNextApiKey();
    if (process.env.MODE === 'dev') {
        const maskedKey = apiKey.length > 8 ? apiKey.slice(0, 6) + '*'.repeat(apiKey.length - 8) + apiKey.slice(-2) : apiKey;
        console.log(`[GeminiService] Using API key: ${maskedKey}`);
    }
    if (!modelCache[apiKey]) {
        modelCache[apiKey] = new GoogleGenerativeAI(apiKey);
    }
    return modelCache[apiKey].getGenerativeModel(modelOptions);
}

export async function generateContentWithRetry(prompt, options = {}) {
    let lastError;
    for (let attempt = 0; attempt < apiKeys.length; attempt++) {
        try {
            const model = getGenerativeModel(options);
            const result = await model.generateContent(prompt);
            return result;
        } catch (error) {
            lastError = error;
            console.error(`[GeminiService] Error on attempt ${attempt + 1}:`, error);
            const errorMessage = error.message?.toLowerCase() || '';
            const isRateLimit = errorMessage.includes('rate limit') || errorMessage.includes('quota exceeded') || errorMessage.includes('resource exhausted') || error.status === 429;
            if (isRateLimit) {
                const currentKey = apiKeys[(keyIndex - 1 + apiKeys.length) % apiKeys.length];
                markKeyAsFailed(currentKey);
                if (process.env.MODE === 'dev') {
                    console.log('[GeminiService] Rate limit detected, switching to next key...');
                }
                continue;
            } else {
                throw error;
            }
        }
    }
    throw new Error('All API keys are currently rate limited. Please try again later.');
}

export function resetFailedKey(apiKey) {
    failedKeys.delete(apiKey);
    if (process.env.MODE === 'dev') {
        const maskedKey = apiKey.length > 8 ? apiKey.slice(0, 6) + '*'.repeat(apiKey.length - 8) + apiKey.slice(-2) : apiKey;
        console.log(`[GeminiService] Reset failed key: ${maskedKey}`);
    }
}

export function getSystemExplanationPrompt(fileTree, codeSamples) {
    return `You are a senior software architect. Your job is to analyze a codebase and provide a DETAILED architectural breakdown. **CRITICAL: ONLY use information that is directly evidenced in the codebase below. DO NOT guess, infer, or hallucinate any technologies, services, components, or tech stacks. If you are not sure, say 'unknown' or leave blank.**
<file_tree>
${fileTree}
</file_tree>
<code_samples>
${codeSamples}
</code_samples>
Provide a DETAILED analysis in the following format:
## Project Purpose
Describe what the project does based on the code evidence.
## Technologies and Frameworks
List ONLY the technologies, frameworks, and tools that are explicitly mentioned in the code (package.json, imports, file extensions, etc.)
## Major Architecture Components
### Frontend Layer
- Identify the main frontend framework (React, Vue, Angular, etc.)
- List major page components and their purposes
- Identify UI libraries and state management used
- Describe the overall frontend structure
### Backend API Layer
- Identify the main backend framework (Express, FastAPI, Django, etc.)
- List major API route categories (auth, chat, canvas, etc.)
- Identify middleware and authentication patterns
- Describe the overall API structure
### Database Layer
- Identify database type and ORM/ODM used
- List major data models and their relationships
- Identify database configuration and setup
### Services Layer
- Identify major utility services (AI, email, file upload, etc.)
- List external service integrations
- Describe service communication patterns
### Configuration and Deployment
- Identify build tools and deployment configuration
- List environment and configuration management
- Describe development and production setup
## Core Data Flow and Interactions
- Describe the main user interaction flow
- Identify how frontend communicates with backend
- Describe authentication and authorization flow
- Identify major data processing patterns
- Describe file handling and external service integration
## Key Observations
- Specific architectural patterns used
- Code organization and structure
- Development tools and configurations
- Testing patterns and frameworks
**IMPORTANT:**
- Be VERY specific about file paths, component names, and relationships
- Only mention technologies that are explicitly present in the code
- Do not assume or guess about technologies not found
- If something is unclear, say 'unknown' rather than guessing
- Focus on DETAILED relationships between components
Format your response inside <explanation> tags only.`;
}

export function getComponentMappingPrompt(explanation, fileTree) {
    return `Given the following system explanation and the file tree of the project, create a DETAILED mapping of components to their actual files and directories. **CRITICAL: ONLY map components that are clearly present in BOTH the explanation and the file tree. If mapping is ambiguous or not clear, say 'unknown'. DO NOT guess or infer.**
<explanation>
${explanation}
</explanation>
<file_tree>
${fileTree}
</file_tree>
Create a DETAILED mapping of each component mentioned in the explanation to its corresponding files/directories in the file tree.
**Mapping Rules:**
- Only map components that are explicitly mentioned in the explanation
- Only use file paths that actually exist in the file tree
- Be VERY specific about which files belong to which components
- If a component is mentioned but no clear files exist, say 'unknown'
- If multiple files belong to a component, list them all
- Include specific file names, not just directories
- Map both individual files and directory structures
**Focused Mapping Format:**
<component_mapping>
1. [Frontend Application]: [All frontend files and directories]
2. [Backend API Server]: [All API route files and controllers]
3. [Database Layer]: [All database model files]
4. [Authentication Service]: [All auth-related files]
5. [AI/ML Service]: [All AI-related utility files]
6. [File Management]: [All file upload/download files]
7. [Configuration]: [All config and deployment files]
8. [External Services]: [All third-party integrations]
</component_mapping>
**Examples of Focused Mapping:**
- Frontend Application: client/src/ (all React components, pages, and UI files)
- Backend API Server: server/routes/ (all API route files), server/controllers/ (if exists)
- Database Layer: server/models/ (all database model files)
- Authentication Service: server/middleware/authMiddleware.js, server/routes/auth.js
- AI/ML Service: server/utils/geminiService.js, server/utils/groqPrompts.js
- File Management: server/utils/emailService.js, server/routes/contact.js
- Configuration: client/package.json, server/package.json, client/vite.config.ts, server/vercel.json
- External Services: server/utils/ (external API integrations)
**IMPORTANT:**
- Be as specific as possible with file names and paths
- Include both individual files and directory structures
- Map every component mentioned in the explanation
- Focus on DETAILED relationships between components and their files
Only return the mapping within <component_mapping> tags.`;
}

export async function runGemini(prompt) {
    // Check prompt size to prevent "Request Entity Too Large" error
    const promptSize = Buffer.byteLength(prompt, 'utf8');
    const maxSize = 30000000;
    if (promptSize > maxSize) {
        const truncatedPrompt = prompt.substring(0, maxSize * 0.8) + '\n\n[Content truncated due to size limits]';
        prompt = truncatedPrompt;
    }
    try {
        const result = await generateContentWithRetry(prompt, { temperature: 0.2, maxOutputTokens: 4000, });
        return result.response.text();
    } catch (error) {
        console.error('Gemini API error:', error);
        if (error.message.includes('Request Entity Too Large')) {
            throw new Error('Repository too large to analyze. Please try with a smaller repository or fewer files.');
        }
        throw error;
    }
}

