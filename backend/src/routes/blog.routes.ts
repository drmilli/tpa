import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { BlogController } from '../controllers/blog.controller';

const router = Router();
const blogController = new BlogController();

// Admin routes (must be before dynamic :slug route)
router.get('/admin/all', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MODERATOR'), blogController.getAllAdmin);
router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MODERATOR'), blogController.create);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MODERATOR'), blogController.update);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), blogController.delete);

// Public routes
router.get('/', blogController.getAll);
router.get('/:slug', blogController.getBySlug);

export default router;
