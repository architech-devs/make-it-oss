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