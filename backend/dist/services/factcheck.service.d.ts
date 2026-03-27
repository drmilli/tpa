interface FactCheckResult {
    verdict: 'true' | 'mostly-true' | 'half-true' | 'mostly-false' | 'false' | 'unverifiable';
    confidence: number;
    summary: string;
    keyPoints: string[];
    sources: string[];
    disclaimer: string;
}
declare class FactCheckService {
    private openai;
    constructor();
    analyzeClaimWithAI(claim: string): Promise<FactCheckResult>;
    private getMockResponse;
}
export declare const factCheckService: FactCheckService;
export {};
//# sourceMappingURL=factcheck.service.d.ts.map