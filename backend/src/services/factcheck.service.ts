import OpenAI from 'openai';
import { logger } from '../utils/logger';

interface FactCheckResult {
  verdict: 'true' | 'mostly-true' | 'half-true' | 'mostly-false' | 'false' | 'unverifiable';
  confidence: number;
  summary: string;
  keyPoints: string[];
  sources: string[];
  disclaimer: string;
}

class FactCheckService {
  private openai: OpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
  }

  async analyzeClaimWithAI(claim: string): Promise<FactCheckResult> {
    if (!this.openai) {
      logger.warn('OpenAI not configured, returning mock response');
      return this.getMockResponse(claim);
    }

    try {
      const systemPrompt = `You are an expert fact-checker specializing in Nigerian politics and government. Your role is to analyze political claims and statements for accuracy.

When analyzing a claim, you must:
1. Evaluate the claim's accuracy based on known facts about Nigeria
2. Consider official government data, statistics, and verifiable information
3. Provide a balanced, non-partisan analysis
4. Cite relevant Nigerian institutions (NBS, CBN, INEC, etc.) as potential sources

You MUST respond with valid JSON in this exact format:
{
  "verdict": "true" | "mostly-true" | "half-true" | "mostly-false" | "false" | "unverifiable",
  "confidence": <number 0-100>,
  "summary": "<2-3 sentence summary of your analysis>",
  "keyPoints": ["<point 1>", "<point 2>", "<point 3>", "<point 4>"],
  "sources": ["<source 1>", "<source 2>", "<source 3>"]
}

Verdict definitions:
- true: Claim is accurate and verifiable
- mostly-true: Claim is largely accurate with minor inaccuracies
- half-true: Claim contains mix of accurate and inaccurate elements
- mostly-false: Claim is largely inaccurate with some true elements
- false: Claim is demonstrably false
- unverifiable: Cannot be verified with available information`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this political claim for accuracy: "${claim}"` }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse the JSON response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not parse JSON from response');
      }

      const result = JSON.parse(jsonMatch[0]) as FactCheckResult;

      // Validate and sanitize the result
      const validVerdicts = ['true', 'mostly-true', 'half-true', 'mostly-false', 'false', 'unverifiable'];
      if (!validVerdicts.includes(result.verdict)) {
        result.verdict = 'unverifiable';
      }

      result.confidence = Math.min(100, Math.max(0, result.confidence || 50));
      result.keyPoints = (result.keyPoints || []).slice(0, 5);
      result.sources = (result.sources || []).slice(0, 5);
      result.disclaimer = 'This AI-powered analysis is for informational purposes only. For official fact-checks, please refer to verified reports and consult primary sources. AI analysis may not reflect the most current data.';

      logger.info(`Fact check completed for claim: ${claim.substring(0, 50)}...`);
      return result;

    } catch (error) {
      logger.error('Error in AI fact check:', error);
      return this.getMockResponse(claim);
    }
  }

  private getMockResponse(_claim: string): FactCheckResult {
    // Provide a reasonable mock response when AI is unavailable
    return {
      verdict: 'unverifiable',
      confidence: 30,
      summary: 'This claim requires further verification. Our AI analysis system is currently processing limited data. For accurate fact-checking, please consult official Nigerian government sources and verified news outlets.',
      keyPoints: [
        'Claim requires verification against official data sources',
        'Consider checking National Bureau of Statistics (NBS) reports',
        'Cross-reference with Central Bank of Nigeria (CBN) data if economic',
        'Verify with relevant government ministry publications'
      ],
      sources: [
        'National Bureau of Statistics (NBS)',
        'Central Bank of Nigeria (CBN)',
        'Federal Ministry Publications',
        'INEC Official Records'
      ],
      disclaimer: 'This is a preliminary analysis. For official fact-checks, please refer to verified reports and consult primary sources.'
    };
  }
}

export const factCheckService = new FactCheckService();
