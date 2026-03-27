import { Router } from 'express';
import multer from 'multer';
import { authenticate, authorize } from '../middleware/auth';
import { BlogController } from '../controllers/blog.controller';

const router = Router();
const blogController = new BlogController();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

// Admin routes (must be before dynamic :slug route)
router.get('/admin/all', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MODERATOR'), blogController.getAllAdmin);
router.post(
  '/admin/upload',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN', 'MODERATOR'),
  upload.single('file'),
  blogController.uploadMedia.bind(blogController)
);
router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MODERATOR'), blogController.create);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MODERATOR'), blogController.update);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), blogController.delete);

// Public routes
router.get('/', blogController.getAll);
router.get('/:slug', blogController.getBySlug);

export default router;
