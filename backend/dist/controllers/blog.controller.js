"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../middleware/errorHandler");
const cloudinary_service_1 = require("../services/cloudinary.service");
const prisma = new client_1.PrismaClient();
class BlogController {
    async getAll(req, res, next) {
        try {
            const { page = 1, limit = 10, category } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            const where = { isPublished: true };
            if (category)
                where.category = category;
            const [blogs, total] = await Promise.all([
                prisma.blog.findMany({
                    where,
                    skip,
                    take: Number(limit),
                    orderBy: { publishedAt: 'desc' },
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        excerpt: true,
                        coverImage: true,
                        videoUrl: true,
                        tags: true,
                        publishedAt: true,
                        views: true,
                    },
                }),
                prisma.blog.count({ where }),
            ]);
            res.json({
                success: true,
                data: {
                    blogs,
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total,
                        totalPages: Math.ceil(total / Number(limit)),
                    },
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAllAdmin(req, res, next) {
        try {
            const { page = 1, limit = 20, category, status, search } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            const where = {};
            if (category)
                where.category = category;
            if (status === 'published')
                where.isPublished = true;
            if (status === 'draft')
                where.isPublished = false;
            if (search) {
                where.OR = [
                    { title: { contains: search, mode: 'insensitive' } },
                    { excerpt: { contains: search, mode: 'insensitive' } },
                ];
            }
            const [blogs, total] = await Promise.all([
                prisma.blog.findMany({
                    where,
                    skip,
                    take: Number(limit),
                    orderBy: { createdAt: 'desc' },
                }),
                prisma.blog.count({ where }),
            ]);
            res.json({
                success: true,
                data: {
                    blogs,
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total,
                        totalPages: Math.ceil(total / Number(limit)),
                    },
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const blog = await prisma.blog.findUnique({
                where: { slug },
            });
            if (!blog) {
                throw new errorHandler_1.AppError('Blog not found', 404);
            }
            const updatedBlog = await prisma.blog.update({
                where: { id: blog.id },
                data: { views: { increment: 1 } },
            });
            res.json({
                success: true,
                data: updatedBlog,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const blog = await prisma.blog.create({
                data: req.body,
            });
            res.status(201).json({
                success: true,
                data: blog,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const blog = await prisma.blog.update({
                where: { id },
                data: req.body,
            });
            res.json({
                success: true,
                data: blog,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await prisma.blog.delete({ where: { id } });
            res.json({
                success: true,
                message: 'Blog deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async uploadMedia(req, res, next) {
        try {
            const file = req.file;
            if (!file) {
                throw new errorHandler_1.AppError('No file uploaded', 400);
            }
            if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
                throw new errorHandler_1.AppError('Only image and video uploads are supported', 400);
            }
            const upload = await cloudinary_service_1.cloudinaryService.uploadBuffer(file.buffer, {
                folder: file.mimetype.startsWith('video/') ? 'tpa/blog-videos' : 'tpa/blog-images',
                filename: file.originalname,
                mimeType: file.mimetype,
            });
            res.status(201).json({
                success: true,
                data: upload,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.BlogController = BlogController;
//# sourceMappingURL=blog.controller.js.map