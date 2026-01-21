import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { PollController } from '../controllers/poll.controller';

const router = Router();
const pollController = new PollController();

router.get('/', pollController.getAll);
router.get('/:id', pollController.getById);
router.get('/:id/results', pollController.getResults);
router.post('/:id/vote', pollController.vote);

router.post('/', authenticate, authorize('ADMIN'), pollController.create);
router.put('/:id', authenticate, authorize('ADMIN'), pollController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), pollController.delete);

export default router;
