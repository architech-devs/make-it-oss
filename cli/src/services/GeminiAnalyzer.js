import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiAnalyzer {
  constructor(apiKey, verbose = false) {
    this.verbose = verbose;
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async analyze(scanResults, analysisType) {
    const prompt = this.buildPrompt(scanResults, analysisType);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseResponse(text);
    } catch (error) {
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }

  buildPrompt(scanResults, analysisType) {
    const { name, projectInfo, communityFiles, statistics } = scanResults;

    let prompt = `Analyze this repository for open source readiness:\n\n`;
    prompt += `Repository: ${name}\n`;
    prompt += `Languages: ${projectInfo.languages.join(', ')}\n`;
    prompt += `Frameworks: ${projectInfo.frameworks.join(', ')}\n`;
    prompt += `Total Files: ${scanResults.fileCount}\n`;
    prompt += `Code Lines: ${statistics.codeLines}\n\n`;

    prompt += `Community Files Found:\n`;
    communityFiles.found.forEach(f => {
      prompt += `- ${f.name} (${f.quality})\n`;
    });

    prompt += `\nCommunity Files Missing:\n`;
    communityFiles.missing.forEach(f => {
      prompt += `- ${f.name} (${f.priority} priority)\n`;
    });

    // Add code samples for deeper analysis
    if (analysisType === 'full' || analysisType === 'security') {
      prompt += `\n\nSample Files:\n`;
      const sampleFiles = scanResults.files
        .filter(f => f.content && this.isRelevantFile(f.name))
        .slice(0, 5);
      
      sampleFiles.forEach(f => {
        prompt += `\n--- ${f.path} ---\n`;
        prompt += f.content.substring(0, 1000) + '\n';
      });
    }

    prompt += `\n\nAnalysis Type: ${analysisType}\n\n`;

    if (analysisType === 'quick') {
      prompt += `Provide a quick assessment:\n`;
      prompt += `1. OSS Readiness Score (0-100)\n`;
      prompt += `2. Top 3 recommendations\n`;
      prompt += `3. Project summary (2-3 sentences)\n`;
    } else if (analysisType === 'full') {
      prompt += `Provide a comprehensive analysis:\n`;
      prompt += `1. OSS Readiness Score (0-100) with breakdown\n`;
      prompt += `2. Detailed recommendations (prioritized)\n`;
      prompt += `3. Code quality assessment\n`;
      prompt += `4. Documentation quality\n`;
      prompt += `5. Community engagement readiness\n`;
      prompt += `6. Suggested improvements\n`;
    } else if (analysisType === 'security') {
      prompt += `Focus on security aspects:\n`;
      prompt += `1. Security file presence\n`;
      prompt += `2. Potential security concerns\n`;
      prompt += `3. Best practices validation\n`;
      prompt += `4. Recommendations for security improvements\n`;
    }

    prompt += `\nFormat your response as JSON with clear structure.`;

    return prompt;
  }

  isRelevantFile(filename) {
    const relevant = [
      'package.json', 'README.md', 'index.js', 'main.js',
      'app.js', 'server.js', '__init__.py', 'main.py',
      'Cargo.toml', 'go.mod', 'pom.xml'
    ];
    return relevant.some(r => filename.includes(r));
  }

  parseResponse(text) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      // If JSON parsing fails, return structured text
    }

    // Fallback: parse as text
    return {
      summary: text,
      score: this.extractScore(text),
      recommendations: this.extractRecommendations(text)
    };
  }

  extractScore(text) {
    const scoreMatch = text.match(/score[:\s]+(\d+)/i);
    return scoreMatch ? parseInt(scoreMatch[1]) : null;
  }

  extractRecommendations(text) {
    const recommendations = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.match(/^\d+\./) || line.match(/^[-*]/)) {
        recommendations.push(line.replace(/^[\d+\.\-*\s]+/, '').trim());
      }
    }
    
    return recommendations.slice(0, 10);
  }
}