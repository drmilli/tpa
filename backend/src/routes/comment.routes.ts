import { Router } from 'express';
import { body } from 'express-validator';
import { CommentController } from '../controllers/comment.controller';
import { optionalAuth } from '../middleware/auth';

const router = Router();
const commentController = new CommentController();

// Get all comments for a blog
router.get('/blogs/:blogId/comments', commentController.getComments);

// Create a new comment (with optional authentication)
router.post(
  '/blogs/:blogId/comments',
  optionalAuth,
  [
    body('content')
      .trim()
      .isLength({ min: 1, max: 2000 })
      .withMessage('Comment must be between 1 and 2000 characters'),
    body('parentId').optional().isUUID().withMessage('Invalid parent comment ID'),
  ],
  commentController.createComment
);

// Update comment (like/dislike)
router.patch(
  '/comments/:commentId',
  [
    body('action')
      .isIn(['like', 'dislike', 'unlike', 'undislike'])
      .withMessage('Invalid action'),
  ],
  commentController.updateComment
);

// Delete comment (requires authentication)
router.delete('/comments/:commentId', optionalAuth, commentController.deleteComment);

export default router;
