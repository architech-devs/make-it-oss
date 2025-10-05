# Git Commit Message Convention

> This is adapted from [Angular's commit convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular).

## TL;DR:

Messages must be matched by the following regex:

```js
/^(revert: )?(feat|fix|docs|style|refactor|perf|test|workflow|build|ci|chore|types|wip)(\(.+\))?: .{1,72}/;
```

## Full Message Format

A commit message consists of a **header**, **body** and **footer**. The header has a **type**, **scope** and **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

## Revert

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header of the reverted commit. In the body, it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

## Type

If the prefix is `feat`, `fix` or `perf`, it will appear in the changelog. However, if there is any [BREAKING CHANGE](#footer), the commit will always appear in the changelog.

**Available types:**
- **feat**: A new feature for the user
- **fix**: A bug fix for the user
- **docs**: Documentation changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **workflow**: Changes to GitHub Actions, CI/CD pipelines, or development workflows
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **types**: Changes to TypeScript type definitions
- **wip**: Work in progress (use sparingly in main branches)

## Scope

The scope could be anything specifying the place of the commit change. For **Make-It-OSS**, suggested scopes include:

### Frontend Scopes
- **client**: Changes to the frontend React application
- **ui**: Changes to UI components or styling
- **components**: Changes to specific React components
- **pages**: Changes to page components
- **assets**: Changes to static assets (images, fonts, etc.)

### Backend Scopes
- **server**: Changes to the backend Express application
- **api**: Changes to API endpoints or contracts
- **controllers**: Changes to request handlers
- **services**: Changes to business logic services
- **routes**: Changes to API routing
- **middleware**: Changes to Express middleware

### Integration Scopes
- **github**: Changes to GitHub integration
- **gemini**: Changes to Gemini AI integration
- **auth**: Changes to authentication logic

### Infrastructure Scopes
- **config**: Changes to configuration files
- **deps**: Changes to dependencies
- **build**: Changes to build configuration
- **deploy**: Changes to deployment configuration

### Documentation Scopes
- **docs**: Changes to documentation
- **readme**: Changes to README files
- **contributing**: Changes to contributing guidelines

## Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end
- maximum 72 characters

## Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

## Footer

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

## Examples

### Feature Examples
```
feat(client): add repository URL validation

Add client-side validation for GitHub repository URLs to provide
immediate feedback to users before making API requests.

Closes #123
```

```
feat(api): implement repository scanning endpoint

Add new /api/project/scan endpoint that integrates with GitHub API
and Gemini AI to analyze repository structure and generate
open-source recommendations.

Closes #45
```

### Bug Fix Examples
```
fix(server): handle rate limiting for GitHub API

Implement proper error handling and retry logic for GitHub API
rate limiting to improve reliability when scanning large repositories.

Fixes #456
```

```
fix(ui): correct mobile responsive layout

Fix responsive design issues on mobile devices where the GitHub
input component was overflowing the viewport.

Fixes #78
```

### Documentation Examples
```
docs(readme): update installation instructions

Add missing environment variable setup steps and clarify
the development workflow for new contributors.
```

```
docs(contributing): add backend contribution guidelines

Include specific guidelines for Express.js backend development,
environment setup, and API endpoint creation.
```

### Refactoring Examples
```
refactor(services): extract GitHub service logic

Move GitHub API integration logic to a dedicated service
module for better code organization and testability.
```

```
refactor(components): consolidate UI button variants

Merge multiple button component variants into a single
configurable component using class-variance-authority.
```

### Breaking Change Example
```
feat(api): change project scan response format

BREAKING CHANGE: The /api/project/scan endpoint now returns a different response
structure. Update your client code accordingly.

Before:
{
  "data": { ... }
}

After:
{
  "success": true,
  "summary": "...",
  "componentMapping": "..."
}

Closes #234
```

### Dependency Updates
```
build(deps): upgrade React to v19

Update React and React DOM to version 19 for improved performance
and new concurrent features.
```

```
chore(deps): update Tailwind CSS to v4.1

Upgrade Tailwind CSS to latest version for improved CSS-in-JS
support and new utility classes.
```

### Configuration Changes
```
config(client): add path aliases for imports

Configure Vite to support @ alias for src directory imports
to improve import readability and maintainability.
```

```
ci: add automated testing workflow

Add GitHub Actions workflow for running tests on pull requests
and main branch pushes.
```

## Best Practices

1. **Keep the subject line short and descriptive** (50 characters or less is ideal)
2. **Use the body to explain what and why, not how**
3. **Reference issues and pull requests when applicable**
4. **Use consistent language and terminology**
5. **Write commits as if completing the sentence: "If applied, this commit will..."**
6. **Separate concerns into different commits** rather than bundling multiple changes
7. **Test your changes** before committing
8. **Use conventional commits** to enable automatic changelog generation

## Tools and Automation

Consider using tools to help maintain consistent commit messages:

- **Commitizen**: Interactive commit message builder
- **Husky**: Git hooks for enforcing commit message format
- **Conventional Changelog**: Automatic changelog generation
- **Semantic Release**: Automated version management and release

## Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
- [How to Write Good Commit Messages](https://chris.beams.io/posts/git-commit/)
