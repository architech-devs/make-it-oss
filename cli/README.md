# Make It OSS - CLI Tool

Command-line tool to analyze and prepare repositories for open source.

## Installation

### Global Installation

```bash
npm i -g make-it-oss
```

### Local Installation
```bash
cd cli
npm install
npm link
```

## Usage

### Direct Usage

```bash
npx make-it-oss summarize
```

### Basic Analysis
```bash
make-it-oss summarize
```

### Analyze Specific Directory
```bash
make-it-oss summarize --path ./my-project
```

### With Gemini AI Analysis
```bash
export GEMINI_API_KEY=your_api_key_here
make-it-oss summarize

Or pass the API key directly:

make-it-oss summarize --api-key your_api_key_here
```

### Save Report to File
```bash
make-it-oss summarize --output report.json
```

### Analysis Types
```bash
# Quick analysis (< 30 seconds)
make-it-oss summarize --type quick

# Full analysis (2-5 minutes)
make-it-oss summarize --type full

# Security-focused analysis
make-it-oss summarize --type security
```

### Verbose Mode
```bash
make-it-oss summarize --verbose
```

## Options

- `--path`, `-p`: Path to repository (default: current directory)
- `--output`, `-o`: Output file for JSON report
- `--type`, `-t`: Analysis type (quick|full|security, default: full)
- `--verbose`, `-v`: Show detailed progress
- `--api-key`, `-k`: Gemini API key (or set GEMINI_API_KEY env variable) [Get your Gemini API for free](https://aistudio.google.com/api-keys)

## Features

- 📁 Local repository scanning
- 🤖 AI-powered analysis with Gemini
- 📊 OSS readiness scoring
- 📝 Community file detection
- 🔍 Code quality assessment
- 💾 JSON report export
- ⚡ Offline mode support