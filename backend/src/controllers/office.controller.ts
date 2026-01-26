import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export class OfficeController {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const offices = await prisma.office.findMany({
        orderBy: { name: 'asc' },
      });

      res.json({
        success: true,
        data: offices,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const office = await prisma.office.findUnique({
        where: { id },
        include: {
          Metric: true,
        },
      });

      if (!office) {
        throw new AppError('Office not found', 404);
      }

      res.json({
        success: true,
        data: office,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const office = await prisma.office.create({
        data: req.body,
      });

      res.status(201).json({
        success: true,
        data: office,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const office = await prisma.office.update({
        where: { id },
        data: req.body,
      });

      res.json({
        success: true,
        data: office,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await prisma.office.delete({ where: { id } });

      res.json({
        success: true,
        message: 'Office deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
