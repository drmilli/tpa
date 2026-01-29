import { Router } from 'express';
import { analysisController } from '../controllers/analysis.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/methodology', analysisController.getScoringMethodology.bind(analysisController));
router.get('/politician/:id', analysisController.getPoliticianAnalysis.bind(analysisController));
router.post('/compare', analysisController.comparePoliticians.bind(analysisController));

// Admin routes
router.post('/politician/:id/recalculate', authMiddleware, adminMiddleware, analysisController.recalculateScore.bind(analysisController));
router.post('/update-all', authMiddleware, adminMiddleware, analysisController.updateAllScores.bind(analysisController));
router.get('/scheduler/status', authMiddleware, adminMiddleware, analysisController.getSchedulerStatus.bind(analysisController));
router.post('/scheduler/run/:jobName', authMiddleware, adminMiddleware, analysisController.runScheduledJob.bind(analysisController));

export default router;
