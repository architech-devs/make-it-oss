import chalk from 'chalk';
import { FileSystemScanner } from '../services/FileSystemScanner.js';
import { GeminiAnalyzer } from '../services/GeminiAnalyzer.js';
import { ReportGenerator } from '../services/ReportGenerator.js';
import { ProgressTracker } from '../utils/progressIndicator.js';
import fs from 'fs-extra';
import path from 'path';

export const summarizeCommand = {
  command: 'summarize [path]',
  describe: 'Analyze and summarize repository structure and code',
  builder: (yargs) => {
    return yargs
      .option('path', {
        alias: 'p',
        type: 'string',
        default: process.cwd(),
        describe: 'Path to repository'
      })
      .option('output', {
        alias: 'o',
        type: 'string',
        describe: 'Output file for analysis report'
      })
      .option('type', {
        alias: 't',
        type: 'string',
        choices: ['quick', 'full', 'security'],
        default: 'full',
        describe: 'Type of analysis to perform'
      })
      .option('verbose', {
        alias: 'v',
        type: 'boolean',
        default: false,
        describe: 'Show detailed progress'
      })
      .option('api-key', {
        alias: 'k',
        type: 'string',
        describe: 'Gemini API key (or set GEMINI_API_KEY env variable)'
      });
  },
  handler: async (argv) => {
    await handleSummarize(argv);
  }
};

async function handleSummarize(argv) {
  const { path: repoPath, output, type, verbose, apiKey } = argv;
  const progressTracker = new ProgressTracker(verbose);

  try {
    // Validate path
    if (!await fs.pathExists(repoPath)) {
      console.error(chalk.red(`✗ Path does not exist: ${repoPath}`));
      process.exit(1);
    }

    console.log(chalk.blue.bold('\n🔍 Make It OSS - Repository Analyzer\n'));
    console.log(chalk.gray(`Analyzing: ${repoPath}`));
    console.log(chalk.gray(`Analysis Type: ${type}\n`));

    // Step 1: Scan file system
    progressTracker.start('Scanning repository structure...');
    const scanner = new FileSystemScanner(repoPath, verbose);
    const scanResults = await scanner.scan();
    progressTracker.succeed(`Found ${scanResults.fileCount} files`);

    // Step 2: Analyze with Gemini (if API key provided)
    let aiAnalysis = null;
    const geminiApiKey = apiKey || process.env.GEMINI_API_KEY;
    
    if (geminiApiKey) {
      try {
        progressTracker.start('Analyzing with Gemini AI...');
        const geminiAnalyzer = new GeminiAnalyzer(geminiApiKey, verbose);
        aiAnalysis = await geminiAnalyzer.analyze(scanResults, type);
        progressTracker.succeed('AI analysis complete');
      } catch (error) {
        progressTracker.fail('AI analysis failed');
        if (verbose) {
          console.log(chalk.yellow(`⚠ ${error.message}`));
        }
        console.log(chalk.yellow('⚠ Continuing with basic analysis...\n'));
      }
    } else {
      console.log(chalk.yellow('⚠ No Gemini API key provided. Running offline analysis only.'));
      console.log(chalk.gray('  Set GEMINI_API_KEY environment variable or use --api-key flag\n'));
    }

    // Step 3: Generate report
    progressTracker.start('Generating report...');
    const reportGenerator = new ReportGenerator(verbose);
    const report = reportGenerator.generate(scanResults, aiAnalysis, type);
    progressTracker.succeed('Report generated');

    // Step 4: Display results
    console.log('\n' + reportGenerator.formatConsoleOutput(report));

    // Step 5: Save to file if requested
    if (output) {
      const outputPath = path.resolve(output);
      await fs.writeJson(outputPath, report, { spaces: 2 });
      console.log(chalk.green(`\n✓ Report saved to: ${outputPath}`));
    }

    console.log(chalk.blue('\n✨ Analysis complete!\n'));

  } catch (error) {
    progressTracker.fail('Analysis failed');
    console.error(chalk.red(`\n✗ Error: ${error.message}`));
    if (verbose) {
      console.error(chalk.red(error.stack));
    }
    process.exit(1);
  }
}