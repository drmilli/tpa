"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const comment_controller_1 = require("../controllers/comment.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const commentController = new comment_controller_1.CommentController();
// Get all comments for a blog
router.get('/blogs/:blogId/comments', commentController.getComments);
// Create a new comment (with optional authentication)
router.post('/blogs/:blogId/comments', auth_1.optionalAuth, [
    (0, express_validator_1.body)('content')
        .trim()
        .isLength({ min: 1, max: 2000 })
        .withMessage('Comment must be between 1 and 2000 characters'),
    (0, express_validator_1.body)('parentId').optional().isUUID().withMessage('Invalid parent comment ID'),
], commentController.createComment);
// Update comment (like/dislike)
router.patch('/comments/:commentId', [
    (0, express_validator_1.body)('action')
        .isIn(['like', 'dislike', 'unlike', 'undislike'])
        .withMessage('Invalid action'),
], commentController.updateComment);
// Delete comment (requires authentication)
router.delete('/comments/:commentId', auth_1.optionalAuth, commentController.deleteComment);
exports.default = router;
//# sourceMappingURL=comment.routes.js.map