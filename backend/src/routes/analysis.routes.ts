import { Router } from 'express';
import { analysisController } from '../controllers/analysis.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/methodology', analysisController.getScoringMethodology.bind(analysisController));
router.get('/politician/:id', analysisController.getPoliticianAnalysis.bind(analysisController));
router.post('/compare', analysisController.comparePoliticians.bind(analysisController));

// Admin routes
router.post('/politician/:id/recalculate', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), analysisController.recalculateScore.bind(analysisController));
router.post('/update-all', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), analysisController.updateAllScores.bind(analysisController));
router.get('/scheduler/status', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), analysisController.getSchedulerStatus.bind(analysisController));
router.post('/scheduler/run/:jobName', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), analysisController.runScheduledJob.bind(analysisController));

export default router;
