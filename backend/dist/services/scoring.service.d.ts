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
export declare class ScoringService {
    /**
     * Calculate comprehensive score for a politician
     */
    calculatePoliticianScore(politicianId: string): Promise<ScoringBreakdown>;
    /**
     * Calculate promise fulfillment score (0-100)
     */
    private calculatePromiseFulfillment;
    /**
     * Calculate legislative activity score (0-100)
     */
    private calculateLegislativeActivity;
    /**
     * Calculate project completion score (0-100)
     */
    private calculateProjectCompletion;
    /**
     * Calculate public sentiment from social media and news
     */
    calculatePublicSentiment(politicianName: string): Promise<number>;
    /**
     * Calculate media presence score (0-100)
     */
    calculateMediaPresence(politicianName: string): Promise<number>;
    /**
     * Calculate controversy impact (higher = worse)
     */
    private calculateControversyImpact;
    /**
     * Use OpenAI to analyze sentiment from web data
     */
    analyzeSentimentWithAI(politicianName: string): Promise<number>;
    /**
     * Fetch news data about a politician using web search
     */
    fetchNewsData(politicianName: string): Promise<NewsAnalysis>;
    /**
     * Analyze headlines sentiment using AI
     */
    analyzeHeadlinesSentiment(headlines: string[], politicianName: string): Promise<number>;
    /**
     * Get AI-based news analysis when APIs unavailable
     */
    getAIBasedNewsAnalysis(politicianName: string): Promise<NewsAnalysis>;
    /**
     * Extract topics from search results
     */
    private extractTopics;
    /**
     * Update all politician scores
     */
    updateAllScores(): Promise<void>;
    /**
     * Store detailed metrics for a politician
     */
    storeMetrics(politicianId: string, breakdown: ScoringBreakdown): Promise<void>;
    /**
     * Update rankings based on scores
     */
    updateRankings(): Promise<void>;
    /**
     * Get detailed analysis for a politician
     */
    getDetailedAnalysis(politicianId: string): Promise<any>;
    /**
     * Get comprehensive AI analysis
     */
    getAIComprehensiveAnalysis(politician: any, newsAnalysis: NewsAnalysis): Promise<any>;
}
export declare const scoringService: ScoringService;
export {};
//# sourceMappingURL=scoring.service.d.ts.map