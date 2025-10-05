# ✨ Contributing Guide

First off, thank you for considering contributing to **Make-It-OSS**! We appreciate your time and effort in helping make this project better.

The following is a set of guidelines for contributing to Make-It-OSS. These are just guidelines, not rules, so use your best judgment and feel free to propose changes to this document in a pull request.

## Table of Contents
- [What can I contribute?](#what-can-i-contribute)
- [Before You Contribute](#before-you-contribute)
- [Your First Contribution](#your-first-contribution)
- [Development Workflow](#development-workflow)
  - [Setting Up the Development Environment](#setting-up-the-development-environment)
  - [Project Structure](#project-structure)
  - [Running the Application](#running-the-application)
  - [Making Changes](#making-changes)
  - [Committing Changes](#committing-changes)
  - [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Bugs](#reporting-bugs)
- [Contribution Guidelines](#contribution-guidelines)
  - [Frontend Contributions](#frontend-contributions)
  - [Backend Contributions](#backend-contributions)
  - [Documentation Contributions](#documentation-contributions)
- [Code Style and Standards](#code-style-and-standards)
- [Testing Guidelines](#testing-guidelines)
- [Code of Conduct](#code-of-conduct)
- [License](#license)

## What can I contribute?

There are several ways to contribute to Make-It-OSS:

1. **Core Development**: Improving the main application features including the repo scanner, AI-powered suggestions, and GitHub integration.
2. **Frontend Enhancements**: Improving the React-based UI, adding new components, or enhancing user experience.
3. **Backend API Development**: Extending the Express.js API, improving GitHub integration, or enhancing the Gemini AI service.
4. **Documentation**: Improving setup guides, API documentation, or user documentation.
5. **Bug Fixes**: Identifying and fixing bugs in the frontend, backend, or documentation.
6. **Feature Requests**: Proposing and implementing new features that help developers make their projects open-source ready.

## Before You Contribute

Before starting to contribute, please make sure to:
- [Open an issue](https://github.com/architech-devs/make-it-oss/issues/new) or discuss your idea on [Discord](https://discord.gg/r9jzAFU3FM) to get feedback and align with the project's goals.
- Review the [Code of Conduct](https://github.com/architech-devs/make-it-oss/blob/main/.github/CODE_OF_CONDUCT.md) and agree to abide by it.
- Check if there's already an existing issue or pull request addressing your concern.

## Your First Contribution

If you're unsure where to begin contributing, you can start by looking through:
- [Good first issues](https://github.com/architech-devs/make-it-oss/labels/good%20first%20issue) - Issues that are beginner-friendly
- [Help wanted issues](https://github.com/architech-devs/make-it-oss/labels/help%20wanted) - Issues that need community help
- Documentation improvements
- UI/UX enhancements

## Development Workflow

### Setting Up the Development Environment

1. **Fork the repository** on GitHub.
2. **Clone your forked repository** to your local machine:
   ```bash
   git clone https://github.com/your-username/make-it-oss.git
   cd make-it-oss
   ```

3. **Install dependencies** for both client and server:
   ```bash
   # Install client dependencies
   cd app/client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

4. **Set up environment variables**:
   ```bash
   # In app/server directory, create a .env file
   cp .env.example .env
   
   # Add your environment variables:
   PORT=3000
   NODE_ENV=development
   GITHUB_TOKEN=your_github_token_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Project Structure

```
make-it-oss/
├── app/
│   ├── client/          # React + TypeScript + Vite frontend
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── pages/       # Page components
│   │   │   ├── lib/         # Utility functions
│   │   │   └── assets/      # Static assets
│   │   └── package.json
│   └── server/          # Express.js backend
│       ├── src/
│       │   ├── controllers/ # Request handlers
│       │   ├── services/    # Business logic (GitHub, Gemini)
│       │   ├── routes/      # API routes
│       │   ├── utils/       # Utility functions
│       │   └── config/      # Configuration files
│       └── package.json
├── LICENSE
├── README.md
└── CONTRIBUTING.md
```

### Running the Application

1. **Start the backend server**:
   ```bash
   cd app/server
   npm run dev
   ```
   The server will run on `http://localhost:3000`

2. **Start the frontend development server**:
   ```bash
   cd app/client
   npm run dev
   ```
   The client will run on `http://localhost:5173`

### Making Changes

1. **Create a new branch** from the `main` branch:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes** following the coding standards outlined below.

3. **Test your changes** thoroughly:
   ```bash
   # Frontend linting
   cd app/client
   npm run lint
   
   # Backend linting
   cd app/server
   npm run lint
   ```

### Committing Changes

1. **Stage your changes**:
   ```bash
   git add .
   ```

2. **Commit your changes** using our commit convention (see below):
   ```bash
   git commit -m "feat(client): add new repository input validation"
   ```

3. **Push your branch**:
   ```bash
   git push origin your-branch-name
   ```

### Submitting a Pull Request

1. **Push your branch** to your forked repository.
2. **Open a pull request** from your branch to the `main` branch of the original repository.
3. **Fill out the pull request template** with relevant information:
   - Clear description of changes
   - Link to related issues
   - Screenshots for UI changes
   - Testing information
4. **Reference any related issues** in the pull request description using keywords like "Closes #123" or "Fixes #456".
5. **Wait for review** from the maintainers.

## Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report and reproduce the behavior.

**Before creating a new issue:**
- [Search existing issues](https://github.com/architech-devs/make-it-oss/issues) to see if the bug has already been reported.
- Check if the issue exists in the latest version.

**When creating a bug report, please include:**
- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior**
- **Actual behavior**
- **Screenshots** if applicable
- **Environment details**:
  - OS (macOS, Windows, Linux)
  - Browser and version
  - Node.js version
  - Any relevant console errors

## Contribution Guidelines

### Frontend Contributions

The frontend is built with:
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons

**Frontend Guidelines:**
- Use TypeScript for all new files
- Follow React best practices and hooks patterns
- Use Tailwind CSS for styling (avoid custom CSS when possible)
- Ensure components are accessible
- Use the existing component structure in `src/components/`
- Test UI changes across different screen sizes

### Backend Contributions

The backend is built with:
- **Node.js** with ES modules
- **Express.js** for the API framework
- **Octokit** for GitHub API integration
- **Google GenAI** for Gemini integration

**Backend Guidelines:**
- Use ES modules (`import`/`export`)
- Follow RESTful API conventions
- Include proper error handling and logging
- Use environment variables for configuration
- Implement rate limiting where appropriate
- Add JSDoc comments for complex functions

### Documentation Contributions

- Use clear, concise language
- Include code examples where helpful
- Update the table of contents when adding sections
- Ensure all links are working
- Follow the existing documentation structure

## Code Style and Standards

### General Guidelines
- Write clear, self-documenting code
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic

### JavaScript/TypeScript
- Use ES6+ features
- Follow ESLint configuration
- Use TypeScript types properly
- Handle async operations with proper error handling

### CSS/Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Use CSS custom properties for theme values

### Git Commit Messages
Follow our [commit convention](#git-commit-message-convention) for all commits.

## Testing Guidelines

While we're working on improving test coverage, please:
- Manually test your changes thoroughly
- Test edge cases and error conditions
- Verify changes work in different browsers
- Test both desktop and mobile interfaces
- Ensure API endpoints return expected responses

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](https://github.com/architech-devs/make-it-oss/blob/main/.github/CODE_OF_CONDUCT.md). Please read it to understand the expected behavior in our community.

## License

Make-It-OSS is licensed under the [Apache License 2.0](https://github.com/architech-devs/make-it-oss/blob/main/LICENSE). By contributing to this project, you agree that your contributions will be licensed under the same license.

---

## Git Commit Message Convention

> This is adapted from [Angular's commit convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular).

### TL;DR:

Messages must be matched by the following regex:

```js
/^(revert: )?(feat|fix|docs|style|refactor|perf|test|workflow|build|ci|chore|types|wip)(\(.+\))?: .{1,72}/;
```

### Full Message Format

A commit message consists of a **header**, **body** and **footer**. The header has a **type**, **scope** and **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

### Revert

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header of the reverted commit. In the body, it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type

If the prefix is `feat`, `fix` or `perf`, it will appear in the changelog. However, if there is any [BREAKING CHANGE](#footer), the commit will always appear in the changelog.

**Available types:**
- **feat**: A new feature for the user
- **fix**: A bug fix for the user
- **docs**: Documentation changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **types**: Changes to TypeScript type definitions

### Scope

The scope could be anything specifying the place of the commit change. For Make-It-OSS, suggested scopes include:

- **client**: Changes to the frontend React application
- **server**: Changes to the backend Express application
- **api**: Changes to API endpoints or contracts
- **ui**: Changes to UI components or styling
- **docs**: Changes to documentation
- **github**: Changes to GitHub integration
- **gemini**: Changes to Gemini AI integration
- **config**: Changes to configuration files
- **deps**: Changes to dependencies

### Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end
- maximum 72 characters

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

### Examples

```
feat(client): add repository URL validation

Add client-side validation for GitHub repository URLs to provide
immediate feedback to users before making API requests.

Closes #123
```

```
fix(server): handle rate limiting for GitHub API

Implement proper error handling and retry logic for GitHub API
rate limiting to improve reliability.

Fixes #456
```

```
docs(readme): update installation instructions

Add missing environment variable setup steps and clarify
the development workflow.
```

```
refactor(api): extract GitHub service logic

Move GitHub API integration logic to a dedicated service
module for better code organization and testability.
```

```
BREAKING CHANGE: change API response format

The /api/project/scan endpoint now returns a different response
structure. Update your client code accordingly.

Before:
```json
{
  "data": { ... }
}
```

After:
```json
{
  "success": true,
  "summary": "...",
  "componentMapping": "..."
}
```

---

Thank you for contributing to Make-It-OSS! 🚀

If you have any questions, feel free to reach out on [Discord](https://discord.gg/r9jzAFU3FM) or open an issue for discussion.
