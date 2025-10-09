import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import ignore from 'ignore';

export class FileSystemScanner {
  constructor(repoPath, verbose = false) {
    this.repoPath = path.resolve(repoPath);
    this.verbose = verbose;
    this.ig = ignore();
    this.communityFiles = [
      'README.md',
      'LICENSE',
      'LICENSE.md',
      'CONTRIBUTING.md',
      'CODE_OF_CONDUCT.md',
      'SECURITY.md',
      'CHANGELOG.md',
      'CHANGELOG',
      '.github/ISSUE_TEMPLATE',
      '.github/PULL_REQUEST_TEMPLATE.md',
      '.github/workflows'
    ];
  }

  async scan() {
    // Load .gitignore
    await this.loadGitignore();

    // Scan repository
    const files = await this.getAllFiles();
    const fileStats = await this.analyzeFiles(files);
    const communityFilesStatus = await this.checkCommunityFiles();
    const projectInfo = await this.detectProjectType(files);
    const statistics = this.calculateStatistics(fileStats);

    return {
      path: this.repoPath,
      name: path.basename(this.repoPath),
      timestamp: new Date().toISOString(),
      fileCount: files.length,
      files: fileStats,
      communityFiles: communityFilesStatus,
      projectInfo,
      statistics
    };
  }

  async loadGitignore() {
    const gitignorePath = path.join(this.repoPath, '.gitignore');
    
    // Add default ignores
    this.ig.add([
      'node_modules',
      '.git',
      'dist',
      'build',
      '.next',
      'coverage',
      '.env',
      '.env.local',
      '*.log'
    ]);

    if (await fs.pathExists(gitignorePath)) {
      const gitignoreContent = await fs.readFile(gitignorePath, 'utf-8');
      this.ig.add(gitignoreContent);
    }
  }

  async getAllFiles() {
    const pattern = '**/*';
    const files = await glob(pattern, {
      cwd: this.repoPath,
      nodir: true,
      dot: true,
      ignore: ['node_modules/**', '.git/**']
    });

    // Filter using .gitignore rules
    return files.filter(file => !this.ig.ignores(file));
  }

  async analyzeFiles(files) {
    const analyzed = [];

    for (const file of files) {
      const fullPath = path.join(this.repoPath, file);
      try {
        const stats = await fs.stat(fullPath);
        const ext = path.extname(file);
        
        let content = null;
        let lines = 0;

        // Read content for text files
        if (this.isTextFile(ext) && stats.size < 1024 * 1024) { // < 1MB
          try {
            content = await fs.readFile(fullPath, 'utf-8');
            lines = content.split('\n').length;
          } catch (error) {
            // File might be binary or unreadable
          }
        }

        analyzed.push({
          path: file,
          name: path.basename(file),
          extension: ext,
          size: stats.size,
          lines,
          content: content ? content.substring(0, 5000) : null, // Limit content
          modified: stats.mtime
        });
      } catch (error) {
        if (this.verbose) {
          console.warn(`Warning: Could not analyze ${file}`);
        }
      }
    }

    return analyzed;
  }

  isTextFile(ext) {
    const textExtensions = [
      '.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.txt',
      '.yml', '.yaml', '.xml', '.html', '.css', '.scss',
      '.py', '.java', '.go', '.rs', '.c', '.cpp', '.h',
      '.sh', '.bash', '.env', '.gitignore', '.dockerignore',
      '.sql', '.graphql', '.vue', '.svelte'
    ];
    return textExtensions.includes(ext.toLowerCase()) || ext === '';
  }

  async checkCommunityFiles() {
    const found = [];
    const missing = [];

    for (const file of this.communityFiles) {
      const filePath = path.join(this.repoPath, file);
      const exists = await fs.pathExists(filePath);

      if (exists) {
        const stats = await fs.stat(filePath);
        let quality = 'unknown';
        
        if (stats.isFile()) {
          const content = await fs.readFile(filePath, 'utf-8');
          quality = this.assessFileQuality(file, content);
        }

        found.push({
          name: file,
          path: file,
          quality,
          size: stats.size
        });
      } else {
        missing.push({
          name: file,
          priority: this.getFilePriority(file)
        });
      }
    }

    return { found, missing };
  }

  assessFileQuality(filename, content) {
    const length = content.length;
    
    if (filename.includes('README')) {
      if (length > 2000) return 'excellent';
      if (length > 500) return 'good';
      if (length > 100) return 'basic';
      return 'minimal';
    }

    if (filename.includes('LICENSE')) {
      return length > 100 ? 'complete' : 'incomplete';
    }

    if (length > 1000) return 'comprehensive';
    if (length > 300) return 'good';
    if (length > 50) return 'basic';
    return 'minimal';
  }

  getFilePriority(filename) {
    if (filename.includes('README') || filename.includes('LICENSE')) {
      return 'critical';
    }
    if (filename.includes('CONTRIBUTING') || filename.includes('SECURITY')) {
      return 'high';
    }
    return 'medium';
  }

  async detectProjectType(files) {
    const languages = new Set();
    const frameworks = new Set();
    let packageManager = null;

    for (const file of files) {
      const ext = path.extname(file);
      const basename = path.basename(file);

      // Detect languages
      if (ext === '.js' || ext === '.jsx') languages.add('JavaScript');
      if (ext === '.ts' || ext === '.tsx') languages.add('TypeScript');
      if (ext === '.py') languages.add('Python');
      if (ext === '.java') languages.add('Java');
      if (ext === '.go') languages.add('Go');
      if (ext === '.rs') languages.add('Rust');
      if (ext === '.rb') languages.add('Ruby');
      if (ext === '.php') languages.add('PHP');

      // Detect frameworks
      if (basename === 'package.json') {
        packageManager = 'npm';
        const content = await fs.readJson(path.join(this.repoPath, file));
        const deps = { ...content.dependencies, ...content.devDependencies };
        
        if (deps.react) frameworks.add('React');
        if (deps.vue) frameworks.add('Vue');
        if (deps.angular) frameworks.add('Angular');
        if (deps.next) frameworks.add('Next.js');
        if (deps.express) frameworks.add('Express');
        if (deps.nestjs) frameworks.add('NestJS');
      }

      if (basename === 'requirements.txt' || basename === 'setup.py') {
        packageManager = 'pip';
      }
      if (basename === 'Cargo.toml') packageManager = 'cargo';
      if (basename === 'go.mod') packageManager = 'go modules';
    }

    return {
      languages: Array.from(languages),
      frameworks: Array.from(frameworks),
      packageManager
    };
  }

  calculateStatistics(files) {
    let totalLines = 0;
    let codeLines = 0;
    const languageStats = {};

    for (const file of files) {
      if (file.lines) {
        totalLines += file.lines;
        
        if (file.extension && this.isCodeFile(file.extension)) {
          codeLines += file.lines;
          
          if (!languageStats[file.extension]) {
            languageStats[file.extension] = { files: 0, lines: 0 };
          }
          languageStats[file.extension].files++;
          languageStats[file.extension].lines += file.lines;
        }
      }
    }

    return {
      totalLines,
      codeLines,
      languageStats
    };
  }

  isCodeFile(ext) {
    const codeExtensions = [
      '.js', '.jsx', '.ts', '.tsx', '.py', '.java',
      '.go', '.rs', '.c', '.cpp', '.h', '.rb', '.php'
    ];
    return codeExtensions.includes(ext);
  }
}