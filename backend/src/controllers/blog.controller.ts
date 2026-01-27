import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export class BlogController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, category } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      const where: any = { isPublished: true };

      if (category) where.category = category;

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
            category: true,
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
    } catch (error) {
      next(error);
    }
  }

  async getAllAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20, category, status, search } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      const where: any = {};

      if (category) where.category = category;
      if (status === 'published') where.isPublished = true;
      if (status === 'draft') where.isPublished = false;
      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: 'insensitive' } },
          { excerpt: { contains: search as string, mode: 'insensitive' } },
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
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const blog = await prisma.blog.findUnique({
        where: { slug },
      });

      if (!blog) {
        throw new AppError('Blog not found', 404);
      }

      await prisma.blog.update({
        where: { id: blog.id },
        data: { views: { increment: 1 } },
      });

      res.json({
        success: true,
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const blog = await prisma.blog.create({
        data: req.body,
      });

      res.status(201).json({
        success: true,
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
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
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await prisma.blog.delete({ where: { id } });

      res.json({
        success: true,
        message: 'Blog deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
