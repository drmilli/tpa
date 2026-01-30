import { Router } from 'express';
import { factCheckController } from '../controllers/factcheck.controller';

const router = Router();

// Public route - analyze a claim
router.post('/analyze', factCheckController.analyzeClaim.bind(factCheckController));

export default router;
