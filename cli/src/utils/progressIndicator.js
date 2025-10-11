import ora from 'ora';
import chalk from 'chalk';

export class ProgressTracker {
  constructor(verbose = false) {
    this.verbose = verbose;
    this.spinner = null;
  }

  start(message) {
    if (this.spinner) {
      this.spinner.stop();
    }
    
    this.spinner = ora({
      text: message,
      color: 'cyan',
      spinner: 'dots'
    }).start();

    if (this.verbose) {
      console.log(chalk.gray(`[${new Date().toISOString()}] ${message}`));
    }
  }

  succeed(message) {
    if (this.spinner) {
      this.spinner.succeed(chalk.green(message));
      this.spinner = null;
    } else {
      console.log(chalk.green(`✓ ${message}`));
    }

    if (this.verbose) {
      console.log(chalk.gray(`[${new Date().toISOString()}] Completed: ${message}`));
    }
  }

  fail(message) {
    if (this.spinner) {
      this.spinner.fail(chalk.red(message));
      this.spinner = null;
    } else {
      console.log(chalk.red(`✗ ${message}`));
    }

    if (this.verbose) {
      console.log(chalk.gray(`[${new Date().toISOString()}] Failed: ${message}`));
    }
  }

  warn(message) {
    if (this.spinner) {
      this.spinner.warn(chalk.yellow(message));
      this.spinner = null;
    } else {
      console.log(chalk.yellow(`⚠ ${message}`));
    }
  }

  info(message) {
    if (this.spinner) {
      this.spinner.info(chalk.blue(message));
      this.spinner = null;
    } else {
      console.log(chalk.blue(`ℹ ${message}`));
    }
  }

  update(message) {
    if (this.spinner) {
      this.spinner.text = message;
    }

    if (this.verbose) {
      console.log(chalk.gray(`[${new Date().toISOString()}] ${message}`));
    }
  }

  stop() {
    if (this.spinner) {
      this.spinner.stop();
      this.spinner = null;
    }
  }
}