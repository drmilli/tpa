import { Router } from 'express';
import authRoutes from './auth.routes';
import politicianRoutes from './politician.routes';
import officeRoutes from './office.routes';
import rankingRoutes from './ranking.routes';
import pollRoutes from './poll.routes';
import blogRoutes from './blog.routes';
import commentRoutes from './comment.routes';
import locationRoutes from './location.routes';
import contactRoutes from './contact.routes';
import analysisRoutes from './analysis.routes';
import factcheckRoutes from './factcheck.routes';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(apiLimiter);

router.use('/auth', authRoutes);
router.use('/politicians', politicianRoutes);
router.use('/offices', officeRoutes);
router.use('/rankings', rankingRoutes);
router.use('/polls', pollRoutes);
router.use('/blogs', blogRoutes);
router.use('/', commentRoutes); // Comment routes are mounted at root since they include /blogs/:blogId/comments
router.use('/locations', locationRoutes);
router.use('/contact', contactRoutes);
router.use('/analysis', analysisRoutes);
router.use('/factcheck', factcheckRoutes);

export default router;
