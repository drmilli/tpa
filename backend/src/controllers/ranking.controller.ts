import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RankingController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 50 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const rankings = await prisma.ranking.findMany({
        skip,
        take: Number(limit),
        orderBy: [{ totalScore: 'desc' }, { rank: 'asc' }],
        include: {
          politician: {
            include: { state: true },
          },
          office: true,
        },
      });

      res.json({
        success: true,
        data: rankings,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByOffice(req: Request, res: Response, next: NextFunction) {
    try {
      const { officeId } = req.params;
      const { limit = 50 } = req.query;

      const rankings = await prisma.ranking.findMany({
        where: { officeId },
        take: Number(limit),
        orderBy: { rank: 'asc' },
        include: {
          politician: {
            include: { state: true },
          },
          office: true,
        },
      });

      res.json({
        success: true,
        data: rankings,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByPolitician(req: Request, res: Response, next: NextFunction) {
    try {
      const { politicianId } = req.params;

      const rankings = await prisma.ranking.findMany({
        where: { politicianId },
        include: {
          office: true,
        },
      });

      res.json({
        success: true,
        data: rankings,
      });
    } catch (error) {
      next(error);
    }
  }
}
