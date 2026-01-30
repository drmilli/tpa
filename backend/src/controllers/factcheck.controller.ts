import { Request, Response, NextFunction } from 'express';
import { factCheckService } from '../services/factcheck.service';
import { logger } from '../utils/logger';

export class FactCheckController {
  /**
   * Analyze a political claim using AI
   */
  async analyzeClaim(req: Request, res: Response, next: NextFunction) {
    try {
      const { claim } = req.body;

      if (!claim || typeof claim !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Please provide a claim to analyze',
        });
        return;
      }

      if (claim.length < 10) {
        res.status(400).json({
          success: false,
          error: 'Claim must be at least 10 characters long',
        });
        return;
      }

      if (claim.length > 1000) {
        res.status(400).json({
          success: false,
          error: 'Claim must not exceed 1000 characters',
        });
        return;
      }

      logger.info(`Analyzing claim: ${claim.substring(0, 50)}...`);

      const result = await factCheckService.analyzeClaimWithAI(claim);

      res.json({
        success: true,
        data: {
          claim,
          ...result,
          analyzedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      logger.error('Error in fact check controller:', error);
      next(error);
    }
  }
}

export const factCheckController = new FactCheckController();
