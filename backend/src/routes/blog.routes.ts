import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { BlogController } from '../controllers/blog.controller';

const router = Router();
const blogController = new BlogController();

router.get('/', blogController.getAll);
router.get('/:slug', blogController.getBySlug);

router.post('/', authenticate, authorize('ADMIN'), blogController.create);
router.put('/:id', authenticate, authorize('ADMIN'), blogController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), blogController.delete);

export default router;
