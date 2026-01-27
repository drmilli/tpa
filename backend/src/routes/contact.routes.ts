import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth';
import { ContactController } from '../controllers/contact.controller';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();
const contactController = new ContactController();

// Public route - submit contact inquiry
router.post(
  '/',
  apiLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').optional().trim(),
    body('company').optional().trim(),
    body('type').isIn(['GENERAL', 'ADVERTISING', 'PARTNERSHIP', 'MEDIA', 'SUPPORT', 'OTHER']).withMessage('Invalid contact type'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  ],
  contactController.create
);

// Admin routes
router.get('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MODERATOR'), contactController.getAll);
router.get('/stats', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MODERATOR'), contactController.getStats);
router.get('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MODERATOR'), contactController.getById);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'MODERATOR'), contactController.update);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), contactController.delete);

export default router;
