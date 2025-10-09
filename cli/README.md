# Make It OSS - CLI Tool

Command-line tool to analyze and prepare repositories for open source.

## Installation

### Global Installation
```bash
cd cli
npm install
npm link
Direct Usage
bashnpx make-it-oss summarize
Usage
Basic Analysis
bashmake-it-oss summarize
Analyze Specific Directory
bashmake-it-oss summarize --path ./my-project
With Gemini AI Analysis
bashexport GEMINI_API_KEY=your_api_key_here
make-it-oss summarize
Or pass the API key directly:
bashmake-it-oss summarize --api-key your_api_key_here
Save Report to File
bashmake-it-oss summarize --output report.json
Analysis Types
bash# Quick analysis (< 30 seconds)
make-it-oss summarize --type quick

# Full analysis (2-5 minutes)
make-it-oss summarize --type full

# Security-focused analysis
make-it-oss summarize --type security
Verbose Mode
bashmake-it-oss summarize --verbose
Options

--path, -p: Path to repository (default: current directory)
--output, -o: Output file for JSON report
--type, -t: Analysis type (quick|full|security, default: full)
--verbose, -v: Show detailed progress
--api-key, -k: Gemini API key (or set GEMINI_API_KEY env variable)

Features

📁 Local repository scanning
🤖 AI-powered analysis with Gemini
📊 OSS readiness scoring
📝 Community file detection
🔍 Code quality assessment
💾 JSON report export
⚡ Offline mode support

Getting Gemini API Key

Visit Google AI Studio
Create a new API key
Set it as environment variable: export GEMINI_API_KEY=your_key

Development
bashcd cli
npm install
npm link
make-it-oss summarize
License
MIT

---

## 4️⃣ **cli/src/index.js**
```javascript
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