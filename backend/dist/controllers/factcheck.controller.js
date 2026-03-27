"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.factCheckController = exports.FactCheckController = void 0;
const factcheck_service_1 = require("../services/factcheck.service");
const logger_1 = require("../utils/logger");
class FactCheckController {
    /**
     * Analyze a political claim using AI
     */
    async analyzeClaim(req, res, next) {
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
            logger_1.logger.info(`Analyzing claim: ${claim.substring(0, 50)}...`);
            const result = await factcheck_service_1.factCheckService.analyzeClaimWithAI(claim);
            res.json({
                success: true,
                data: {
                    claim,
                    ...result,
                    analyzedAt: new Date().toISOString(),
                },
            });
        }
        catch (error) {
            logger_1.logger.error('Error in fact check controller:', error);
            next(error);
        }
    }
}
exports.FactCheckController = FactCheckController;
exports.factCheckController = new FactCheckController();
//# sourceMappingURL=factcheck.controller.js.map