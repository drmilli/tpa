"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../middleware/errorHandler");
const prisma = new client_1.PrismaClient();
class CommentController {
    // Get all comments for a blog post
    async getComments(req, res, next) {
        try {
            const { blogId } = req.params;
            const comments = await prisma.blogComment.findMany({
                where: {
                    blogId,
                    parentId: null, // Only get top-level comments
                },
                include: {
                    User: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    Replies: {
                        include: {
                            User: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                },
                            },
                        },
                        orderBy: {
                            createdAt: 'asc',
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            res.json({
                success: true,
                data: comments,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Create a new comment
    async createComment(req, res, next) {
        try {
            const { blogId } = req.params;
            const { content, parentId } = req.body;
            const userId = req.user?.id; // Optional: will be null for anonymous comments
            if (!content || content.trim().length === 0) {
                throw new errorHandler_1.AppError('Comment content is required', 400);
            }
            // Verify blog exists
            const blog = await prisma.blog.findUnique({
                where: { id: blogId },
            });
            if (!blog) {
                throw new errorHandler_1.AppError('Blog post not found', 404);
            }
            // If parentId is provided, verify it exists
            if (parentId) {
                const parentComment = await prisma.blogComment.findUnique({
                    where: { id: parentId },
                });
                if (!parentComment || parentComment.blogId !== blogId) {
                    throw new errorHandler_1.AppError('Parent comment not found', 404);
                }
            }
            const comment = await prisma.blogComment.create({
                data: {
                    blogId,
                    userId,
                    parentId: parentId || null,
                    content: content.trim(),
                },
                include: {
                    User: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
            });
            res.status(201).json({
                success: true,
                data: comment,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Update comment (like/dislike)
    async updateComment(req, res, next) {
        try {
            const { commentId } = req.params;
            const { action } = req.body; // 'like' or 'dislike'
            const comment = await prisma.blogComment.findUnique({
                where: { id: commentId },
            });
            if (!comment) {
                throw new errorHandler_1.AppError('Comment not found', 404);
            }
            let updateData = {};
            if (action === 'like') {
                updateData.likes = { increment: 1 };
            }
            else if (action === 'dislike') {
                updateData.dislikes = { increment: 1 };
            }
            else if (action === 'unlike') {
                updateData.likes = { decrement: 1 };
            }
            else if (action === 'undislike') {
                updateData.dislikes = { decrement: 1 };
            }
            else {
                throw new errorHandler_1.AppError('Invalid action', 400);
            }
            const updatedComment = await prisma.blogComment.update({
                where: { id: commentId },
                data: updateData,
                include: {
                    User: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
            });
            res.json({
                success: true,
                data: updatedComment,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Delete comment (only by comment owner or admin)
    async deleteComment(req, res, next) {
        try {
            const { commentId } = req.params;
            const userId = req.user?.id;
            const userRole = req.user?.role;
            const comment = await prisma.blogComment.findUnique({
                where: { id: commentId },
            });
            if (!comment) {
                throw new errorHandler_1.AppError('Comment not found', 404);
            }
            // Check if user is the comment owner or an admin
            if (comment.userId !== userId && !['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
                throw new errorHandler_1.AppError('Unauthorized to delete this comment', 403);
            }
            await prisma.blogComment.delete({
                where: { id: commentId },
            });
            res.json({
                success: true,
                message: 'Comment deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CommentController = CommentController;
//# sourceMappingURL=comment.controller.js.map