import { Request, Response, NextFunction } from 'express';
import { scoringService } from '../services/scoring.service';
import { schedulerService } from '../services/scheduler.service';
import { logger } from '../utils/logger';

export class AnalysisController {
  /**
   * Get detailed analysis for a politician
   */
  async getPoliticianAnalysis(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const analysis = await scoringService.getDetailedAnalysis(id);

      res.json({
        success: true,
        data: analysis,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Recalculate score for a specific politician
   */
  async recalculateScore(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const breakdown = await scoringService.calculatePoliticianScore(id);

      res.json({
        success: true,
        data: {
          politicianId: id,
          breakdown,
          calculatedAt: new Date(),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Trigger full score update for all politicians (admin only)
   */
  async updateAllScores(_req: Request, res: Response, next: NextFunction) {
    try {
      // Run in background
      scoringService.updateAllScores().catch(err => {
        logger.error('Background score update failed:', err);
      });

      res.json({
        success: true,
        message: 'Score update started in background',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get scheduler status
   */
  async getSchedulerStatus(_req: Request, res: Response, next: NextFunction) {
    try {
      const status = schedulerService.getJobStatus();

      res.json({
        success: true,
        data: status,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Manually run a scheduled job (admin only)
   */
  async runScheduledJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobName } = req.params;

      // Run in background
      schedulerService.runJob(jobName).catch(err => {
        logger.error(`Manual job run failed for ${jobName}:`, err);
      });

      res.json({
        success: true,
        message: `Job "${jobName}" started`,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get scoring methodology explanation
   */
  async getScoringMethodology(_req: Request, res: Response, _next: NextFunction) {
    const methodology = {
      overview: 'Our scoring system uses a weighted combination of multiple factors to provide an objective assessment of politician performance.',
      weights: {
        promiseFulfillment: {
          weight: '30%',
          description: 'Tracks campaign promises and their fulfillment status. Fulfilled promises contribute positively, broken promises negatively.',
          calculation: 'Fulfilled (100%) + In Progress (50%) + Pending (30%) + Broken (0%) / Total Promises',
        },
        legislativeActivity: {
          weight: '20%',
          description: 'Measures legislative contributions including bills sponsored and their passage rate.',
          calculation: 'Quantity Score (up to 50 points) + Pass Rate Score (up to 50 points)',
        },
        projectCompletion: {
          weight: '15%',
          description: 'Evaluates infrastructure and development projects initiated and completed.',
          calculation: 'Completed (100%) + Ongoing (60%) + Abandoned (0%) / Total Projects',
        },
        publicSentiment: {
          weight: '15%',
          description: 'AI-analyzed public opinion from social media and news sources.',
          calculation: 'Sentiment analysis score (-1 to +1) converted to 0-100 scale',
        },
        mediaPresence: {
          weight: '10%',
          description: 'Media coverage frequency and tone analysis.',
          calculation: 'Mention frequency score + Sentiment bonus',
        },
        controversyImpact: {
          weight: '-10%',
          description: 'Negative impact from verified controversies and scandals.',
          calculation: 'Sum of severity scores (High: 30, Medium: 15, Low: 5)',
        },
      },
      dataSources: [
        'Official government records and publications',
        'INEC (Independent National Electoral Commission) data',
        'News media analysis (major Nigerian news outlets)',
        'Social media sentiment analysis',
        'Academic and research publications',
        'NGO and civil society reports',
      ],
      updateFrequency: 'Scores are automatically updated every 6 hours, with rankings recalculated every 12 hours.',
      disclaimer: 'Scores are based on available data and AI analysis. They should be considered as one of many factors when evaluating politicians.',
    };

    res.json({
      success: true,
      data: methodology,
    });
  }

  /**
   * Compare multiple politicians
   */
  async comparePoliticians(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids } = req.body; // Array of politician IDs

      if (!ids || !Array.isArray(ids) || ids.length < 2) {
        res.status(400).json({
          success: false,
          error: 'Please provide at least 2 politician IDs to compare',
        });
        return;
      }

      const comparisons = await Promise.all(
        ids.map(async (id: string) => {
          try {
            const analysis = await scoringService.getDetailedAnalysis(id);
            return analysis;
          } catch {
            return null;
          }
        })
      );

      const validComparisons = comparisons.filter(c => c !== null);

      res.json({
        success: true,
        data: {
          politicians: validComparisons,
          comparisonSummary: this.generateComparisonSummary(validComparisons),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  private generateComparisonSummary(politicians: any[]): any {
    if (politicians.length === 0) return null;

    const scores = politicians.map(p => ({
      name: `${p.politician.firstName} ${p.politician.lastName}`,
      score: p.politician.performanceScore,
      breakdown: p.scoreBreakdown,
    }));

    // Sort by score
    scores.sort((a, b) => b.score - a.score);

    return {
      ranking: scores.map((s, i) => ({ rank: i + 1, ...s })),
      highestScore: scores[0],
      lowestScore: scores[scores.length - 1],
      averageScore: scores.reduce((sum, s) => sum + s.score, 0) / scores.length,
    };
  }
}

export const analysisController = new AnalysisController();
