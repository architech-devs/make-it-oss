#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { summarizeCommand } from './commands/summarize.js';

yargs(hideBin(process.argv))
  .command(summarizeCommand)
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .alias('help', 'h')
  .version('1.0.0')
  .alias('version', 'V')
  .strict()
  .argv;