import { PrismaClient } from '@prisma/client';
import { OpenAI } from 'openai';
import axios from 'axios';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Scoring weights for different metrics
const SCORING_WEIGHTS = {
  // Promise fulfillment (30%)
  promiseFulfillment: 0.30,
  // Legislative activity (20%)
  legislativeActivity: 0.20,
  // Project completion (15%)
  projectCompletion: 0.15,
  // Public sentiment (15%)
  publicSentiment: 0.15,
  // Media presence (10%)
  mediaPresence: 0.10,
  // Controversy impact (10% - negative)
  controversyImpact: 0.10,
};

interface SentimentResult {
  score: number; // -1 to 1
  positive: number;
  negative: number;
  neutral: number;
  sampleSize: number;
}

interface NewsAnalysis {
  totalMentions: number;
  sentimentScore: number;
  topTopics: string[];
  recentHeadlines: string[];
}

interface ScoringBreakdown {
  promiseFulfillment: number;
  legislativeActivity: number;
  projectCompletion: number;
  publicSentiment: number;
  mediaPresence: number;
  controversyImpact: number;
  totalScore: number;
}

export class ScoringService {
  /**
   * Calculate comprehensive score for a politician
   */
  async calculatePoliticianScore(politicianId: string): Promise<ScoringBreakdown> {
    const politician = await prisma.politician.findUnique({
      where: { id: politicianId },
      include: {
        Promise: true,
        Bill: true,
        Project: true,
        Controversy: true,
        Tenure: { include: { Office: true } },
        State: true,
      },
    });

    if (!politician) {
      throw new Error('Politician not found');
    }

    const fullName = `${politician.firstName} ${politician.lastName}`;

    // Calculate individual metrics
    const [
      promiseFulfillment,
      legislativeActivity,
      projectCompletion,
      publicSentiment,
      mediaPresence,
      controversyImpact,
    ] = await Promise.all([
      this.calculatePromiseFulfillment(politician.Promise),
      this.calculateLegislativeActivity(politician.Bill),
      this.calculateProjectCompletion(politician.Project),
      this.calculatePublicSentiment(fullName),
      this.calculateMediaPresence(fullName),
      this.calculateControversyImpact(politician.Controversy),
    ]);

    // Calculate weighted total score
    const totalScore = Math.min(100, Math.max(0,
      (promiseFulfillment * SCORING_WEIGHTS.promiseFulfillment) +
      (legislativeActivity * SCORING_WEIGHTS.legislativeActivity) +
      (projectCompletion * SCORING_WEIGHTS.projectCompletion) +
      (publicSentiment * SCORING_WEIGHTS.publicSentiment) +
      (mediaPresence * SCORING_WEIGHTS.mediaPresence) -
      (controversyImpact * SCORING_WEIGHTS.controversyImpact)
    ));

    return {
      promiseFulfillment,
      legislativeActivity,
      projectCompletion,
      publicSentiment,
      mediaPresence,
      controversyImpact,
      totalScore: Math.round(totalScore * 10) / 10,
    };
  }

  /**
   * Calculate promise fulfillment score (0-100)
   */
  private calculatePromiseFulfillment(promises: any[]): number {
    if (!promises || promises.length === 0) return 50; // Default neutral score

    const fulfilled = promises.filter(p => p.status === 'FULFILLED').length;
    const inProgress = promises.filter(p => p.status === 'IN_PROGRESS').length;
    const broken = promises.filter(p => p.status === 'BROKEN').length;
    const total = promises.length;

    // Weighted calculation: fulfilled=100%, in_progress=50%, broken=0%
    const score = ((fulfilled * 100) + (inProgress * 50) + (broken * 0)) / total;
    return Math.round(score);
  }

  /**
   * Calculate legislative activity score (0-100)
   */
  private calculateLegislativeActivity(bills: any[]): number {
    if (!bills || bills.length === 0) return 50;

    const passed = bills.filter(b => b.status === 'PASSED').length;
    const proposed = bills.filter(b => b.status === 'PROPOSED').length;
    const rejected = bills.filter(b => b.status === 'REJECTED').length;
    const total = bills.length;

    // Base score from quantity (max 50 points for 10+ bills)
    const quantityScore = Math.min(50, total * 5);

    // Quality score based on pass rate (max 50 points)
    const passRate = total > 0 ? (passed / total) * 50 : 25;

    return Math.round(quantityScore + passRate);
  }

  /**
   * Calculate project completion score (0-100)
   */
  private calculateProjectCompletion(projects: any[]): number {
    if (!projects || projects.length === 0) return 50;

    const completed = projects.filter(p => p.status === 'COMPLETED').length;
    const ongoing = projects.filter(p => p.status === 'ONGOING').length;
    const abandoned = projects.filter(p => p.status === 'ABANDONED').length;
    const total = projects.length;

    // Weighted calculation
    const score = ((completed * 100) + (ongoing * 60) + (abandoned * 0)) / total;
    return Math.round(score);
  }

  /**
   * Calculate public sentiment from social media and news
   */
  async calculatePublicSentiment(politicianName: string): Promise<number> {
    try {
      // Use AI to analyze sentiment from available data
      const sentiment = await this.analyzeSentimentWithAI(politicianName);
      // Convert -1 to 1 scale to 0-100
      return Math.round((sentiment + 1) * 50);
    } catch (error) {
      logger.warn(`Failed to calculate sentiment for ${politicianName}:`, error);
      return 50; // Neutral default
    }
  }

  /**
   * Calculate media presence score (0-100)
   */
  async calculateMediaPresence(politicianName: string): Promise<number> {
    try {
      const newsData = await this.fetchNewsData(politicianName);
      // Score based on mention frequency and recency
      const mentionScore = Math.min(50, newsData.totalMentions * 2);
      const sentimentBonus = (newsData.sentimentScore + 1) * 25;
      return Math.round(mentionScore + sentimentBonus);
    } catch (error) {
      logger.warn(`Failed to calculate media presence for ${politicianName}:`, error);
      return 50;
    }
  }

  /**
   * Calculate controversy impact (higher = worse)
   */
  private calculateControversyImpact(controversies: any[]): number {
    if (!controversies || controversies.length === 0) return 0;

    const verified = controversies.filter(c => c.isVerified);
    let totalImpact = 0;

    for (const controversy of verified) {
      switch (controversy.severity) {
        case 'HIGH': totalImpact += 30; break;
        case 'MEDIUM': totalImpact += 15; break;
        case 'LOW': totalImpact += 5; break;
      }
    }

    return Math.min(100, totalImpact);
  }

  /**
   * Use OpenAI to analyze sentiment from web data
   */
  async analyzeSentimentWithAI(politicianName: string): Promise<number> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a sentiment analysis expert for Nigerian politics. Analyze public sentiment about politicians based on your knowledge. Return ONLY a JSON object with no additional text.`,
          },
          {
            role: 'user',
            content: `Analyze the general public sentiment about Nigerian politician "${politicianName}". Consider:
1. Their track record and achievements
2. Public perception and approval
3. Media coverage tone
4. Controversies or scandals
5. Policy effectiveness

Return ONLY a JSON object in this exact format:
{
  "sentimentScore": <number between -1 (very negative) and 1 (very positive)>,
  "confidence": <number between 0 and 1>,
  "summary": "<brief explanation>"
}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 200,
      });

      const content = response.choices[0]?.message?.content || '{}';
      const result = JSON.parse(content);
      return result.sentimentScore || 0;
    } catch (error) {
      logger.error('AI sentiment analysis failed:', error);
      return 0; // Neutral
    }
  }

  /**
   * Fetch news data about a politician using web search
   */
  async fetchNewsData(politicianName: string): Promise<NewsAnalysis> {
    try {
      // Use a news API or web scraping service
      // For production, integrate with NewsAPI, Google News API, or similar
      const searchQuery = `${politicianName} Nigeria politician news`;

      // Attempt to use Google Custom Search API if available
      const googleApiKey = process.env.GOOGLE_API_KEY;
      const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

      if (googleApiKey && searchEngineId) {
        const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
          params: {
            key: googleApiKey,
            cx: searchEngineId,
            q: searchQuery,
            num: 10,
            dateRestrict: 'm3', // Last 3 months
          },
        });

        const items = response.data.items || [];
        const headlines = items.map((item: any) => item.title);

        // Use AI to analyze sentiment of headlines
        const sentimentScore = await this.analyzeHeadlinesSentiment(headlines, politicianName);

        return {
          totalMentions: items.length,
          sentimentScore,
          topTopics: this.extractTopics(items),
          recentHeadlines: headlines.slice(0, 5),
        };
      }

      // Fallback: Use AI knowledge
      return await this.getAIBasedNewsAnalysis(politicianName);
    } catch (error) {
      logger.error('News fetch failed:', error);
      return {
        totalMentions: 0,
        sentimentScore: 0,
        topTopics: [],
        recentHeadlines: [],
      };
    }
  }

  /**
   * Analyze headlines sentiment using AI
   */
  async analyzeHeadlinesSentiment(headlines: string[], politicianName: string): Promise<number> {
    if (headlines.length === 0) return 0;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Analyze news headlines sentiment. Return only a number between -1 (negative) and 1 (positive).',
          },
          {
            role: 'user',
            content: `Analyze sentiment of these headlines about ${politicianName}:\n${headlines.join('\n')}\n\nReturn only a number between -1 and 1:`,
          },
        ],
        temperature: 0.1,
        max_tokens: 10,
      });

      const score = parseFloat(response.choices[0]?.message?.content || '0');
      return isNaN(score) ? 0 : Math.max(-1, Math.min(1, score));
    } catch {
      return 0;
    }
  }

  /**
   * Get AI-based news analysis when APIs unavailable
   */
  async getAIBasedNewsAnalysis(politicianName: string): Promise<NewsAnalysis> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a Nigerian politics expert. Provide analysis based on your knowledge.',
          },
          {
            role: 'user',
            content: `Provide news analysis for Nigerian politician "${politicianName}". Return ONLY JSON:
{
  "totalMentions": <estimated recent media mentions 0-50>,
  "sentimentScore": <-1 to 1>,
  "topTopics": ["topic1", "topic2", "topic3"],
  "recentHeadlines": ["headline1", "headline2"]
}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 300,
      });

      return JSON.parse(response.choices[0]?.message?.content || '{}');
    } catch {
      return { totalMentions: 10, sentimentScore: 0, topTopics: [], recentHeadlines: [] };
    }
  }

  /**
   * Extract topics from search results
   */
  private extractTopics(items: any[]): string[] {
    const topics = new Set<string>();
    const keywords = ['economy', 'security', 'education', 'health', 'infrastructure',
                      'corruption', 'election', 'policy', 'development', 'reform'];

    for (const item of items) {
      const text = `${item.title} ${item.snippet}`.toLowerCase();
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          topics.add(keyword);
        }
      }
    }

    return Array.from(topics).slice(0, 5);
  }

  /**
   * Update all politician scores
   */
  async updateAllScores(): Promise<void> {
    const politicians = await prisma.politician.findMany({
      where: { isActive: true },
      select: { id: true, firstName: true, lastName: true },
    });

    logger.info(`Updating scores for ${politicians.length} politicians...`);

    for (const politician of politicians) {
      try {
        const breakdown = await this.calculatePoliticianScore(politician.id);

        await prisma.politician.update({
          where: { id: politician.id },
          data: { performanceScore: breakdown.totalScore },
        });

        // Store detailed metrics
        await this.storeMetrics(politician.id, breakdown);

        logger.info(`Updated score for ${politician.firstName} ${politician.lastName}: ${breakdown.totalScore}`);
      } catch (error) {
        logger.error(`Failed to update score for ${politician.id}:`, error);
      }
    }

    // Update rankings after all scores are calculated
    await this.updateRankings();
  }

  /**
   * Store detailed metrics for a politician
   */
  async storeMetrics(politicianId: string, breakdown: ScoringBreakdown): Promise<void> {
    const metricsToStore = [
      { name: 'Promise Fulfillment', value: breakdown.promiseFulfillment },
      { name: 'Legislative Activity', value: breakdown.legislativeActivity },
      { name: 'Project Completion', value: breakdown.projectCompletion },
      { name: 'Public Sentiment', value: breakdown.publicSentiment },
      { name: 'Media Presence', value: breakdown.mediaPresence },
      { name: 'Controversy Impact', value: breakdown.controversyImpact },
    ];

    // Get or create metrics and store scores
    const tenure = await prisma.tenure.findFirst({
      where: { politicianId, isCurrentRole: true },
      include: { Office: true },
    });

    if (!tenure) return;

    for (const metric of metricsToStore) {
      const existingMetric = await prisma.metric.findFirst({
        where: { officeId: tenure.officeId, name: metric.name },
      });

      let metricId: string;
      if (existingMetric) {
        metricId = existingMetric.id;
      } else {
        const newMetric = await prisma.metric.create({
          data: {
            officeId: tenure.officeId,
            name: metric.name,
            description: `${metric.name} metric`,
            weight: SCORING_WEIGHTS[metric.name.toLowerCase().replace(' ', '') as keyof typeof SCORING_WEIGHTS] || 0.1,
          },
        });
        metricId = newMetric.id;
      }

      await prisma.score.upsert({
        where: { politicianId_metricId: { politicianId, metricId } },
        create: { politicianId, metricId, value: metric.value },
        update: { value: metric.value, calculatedAt: new Date() },
      });
    }
  }

  /**
   * Update rankings based on scores
   */
  async updateRankings(): Promise<void> {
    const offices = await prisma.office.findMany();

    for (const office of offices) {
      // Get all politicians with current tenure in this office
      const politicians = await prisma.politician.findMany({
        where: {
          isActive: true,
          Tenure: { some: { officeId: office.id, isCurrentRole: true } },
        },
        orderBy: { performanceScore: 'desc' },
      });

      // Update rankings
      for (let i = 0; i < politicians.length; i++) {
        await prisma.ranking.upsert({
          where: { politicianId_officeId: { politicianId: politicians[i].id, officeId: office.id } },
          create: {
            politicianId: politicians[i].id,
            officeId: office.id,
            rank: i + 1,
            totalScore: politicians[i].performanceScore,
          },
          update: {
            rank: i + 1,
            totalScore: politicians[i].performanceScore,
            calculatedAt: new Date(),
          },
        });
      }
    }

    logger.info('Rankings updated successfully');
  }

  /**
   * Get detailed analysis for a politician
   */
  async getDetailedAnalysis(politicianId: string): Promise<any> {
    const politician = await prisma.politician.findUnique({
      where: { id: politicianId },
      include: {
        State: true,
        Tenure: { include: { Office: true } },
        Score: { include: { Metric: true } },
        Ranking: { include: { Office: true } },
      },
    });

    if (!politician) {
      throw new Error('Politician not found');
    }

    const fullName = `${politician.firstName} ${politician.lastName}`;
    const newsAnalysis = await this.fetchNewsData(fullName);

    // Get AI-powered comprehensive analysis
    const aiAnalysis = await this.getAIComprehensiveAnalysis(politician, newsAnalysis);

    return {
      politician,
      scoreBreakdown: politician.Score.reduce((acc: any, s: any) => {
        acc[s.Metric.name] = s.value;
        return acc;
      }, {}),
      newsAnalysis,
      aiAnalysis,
      rankings: politician.Ranking,
    };
  }

  /**
   * Get comprehensive AI analysis
   */
  async getAIComprehensiveAnalysis(politician: any, newsAnalysis: NewsAnalysis): Promise<any> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a Nigerian political analyst providing objective assessments.',
          },
          {
            role: 'user',
            content: `Provide a comprehensive analysis of ${politician.firstName} ${politician.lastName},
${politician.Tenure?.[0]?.Office?.name || 'politician'} from ${politician.State?.name || 'Nigeria'}.

Current performance score: ${politician.performanceScore}
Recent media topics: ${newsAnalysis.topTopics.join(', ')}

Return JSON with:
{
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "keyAchievements": ["achievement1", "achievement2"],
  "areasOfConcern": ["concern1", "concern2"],
  "publicPerception": "brief description",
  "recommendation": "brief recommendation for voters"
}`,
          },
        ],
        temperature: 0.4,
        max_tokens: 500,
      });

      return JSON.parse(response.choices[0]?.message?.content || '{}');
    } catch {
      return {
        strengths: [],
        weaknesses: [],
        keyAchievements: [],
        areasOfConcern: [],
        publicPerception: 'Analysis unavailable',
        recommendation: 'Insufficient data for recommendation',
      };
    }
  }
}

export const scoringService = new ScoringService();
