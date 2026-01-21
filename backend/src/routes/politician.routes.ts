import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { PoliticianController } from '../controllers/politician.controller';

const router = Router();
const politicianController = new PoliticianController();

router.get('/', politicianController.getAll);
router.get('/search', politicianController.search);
router.get('/:id', politicianController.getById);
router.get('/:id/profile', politicianController.getProfile);

router.post('/', authenticate, authorize('ADMIN', 'MODERATOR'), politicianController.create);
router.put('/:id', authenticate, authorize('ADMIN', 'MODERATOR'), politicianController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), politicianController.delete);

export default router;
