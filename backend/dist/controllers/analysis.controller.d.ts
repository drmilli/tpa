import { Request, Response, NextFunction } from 'express';
export declare class AnalysisController {
    /**
     * Get detailed analysis for a politician
     */
    getPoliticianAnalysis(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Recalculate score for a specific politician
     */
    recalculateScore(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Trigger full score update for all politicians (admin only)
     */
    updateAllScores(_req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get scheduler status
     */
    getSchedulerStatus(_req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Manually run a scheduled job (admin only)
     */
    runScheduledJob(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get scoring methodology explanation
     */
    getScoringMethodology(_req: Request, res: Response, _next: NextFunction): Promise<void>;
    /**
     * Compare multiple politicians
     */
    comparePoliticians(req: Request, res: Response, next: NextFunction): Promise<void>;
    private generateComparisonSummary;
}
export declare const analysisController: AnalysisController;
//# sourceMappingURL=analysis.controller.d.ts.map