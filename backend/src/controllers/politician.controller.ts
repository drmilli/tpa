import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { esClient } from '../config/elasticsearch';

const prisma = new PrismaClient();

export class PoliticianController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = 1,
        limit = 20,
        state,
        party,
        office: _office,
        minScore,
        maxScore,
        sortBy = 'performanceScore',
        order = 'desc',
      } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const where: any = { isActive: true };

      if (state) where.stateId = state as string;
      if (party) where.partyAffiliation = party as string;
      if (minScore || maxScore) {
        where.performanceScore = {};
        if (minScore) where.performanceScore.gte = Number(minScore);
        if (maxScore) where.performanceScore.lte = Number(maxScore);
      }

      const [politicians, total] = await Promise.all([
        prisma.politician.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: { [sortBy as string]: order as string },
          include: {
            state: true,
            tenures: {
              where: { isCurrentRole: true },
              include: { office: true },
            },
          },
        }),
        prisma.politician.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          politicians,
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

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { q, page = 1, limit = 20 } = req.query;

      if (!q) {
        throw new AppError('Search query required', 400);
      }

      const from = (Number(page) - 1) * Number(limit);

      const { hits } = await esClient.search({
        index: 'politicians',
        body: {
          from,
          size: Number(limit),
          query: {
            multi_match: {
              query: q as string,
              fields: ['firstName^2', 'lastName^2', 'fullName^3', 'biography'],
              fuzziness: 'AUTO',
            },
          },
        },
      });

      res.json({
        success: true,
        data: {
          results: hits.hits.map((hit: any) => hit._source),
          total: hits.total,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const politician = await prisma.politician.findUnique({
        where: { id },
        include: {
          state: true,
          senatorialDistrict: true,
          localGovernment: true,
          tenures: {
            include: { office: true },
            orderBy: { startDate: 'desc' },
          },
        },
      });

      if (!politician) {
        throw new AppError('Politician not found', 404);
      }

      res.json({
        success: true,
        data: politician,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const [politician, promises, bills, projects, controversies, rankings] = await Promise.all([
        prisma.politician.findUnique({
          where: { id },
          include: {
            state: true,
            senatorialDistrict: true,
            localGovernment: true,
            tenures: {
              include: { office: true },
              orderBy: { startDate: 'desc' },
            },
          },
        }),
        prisma.promise.findMany({ where: { politicianId: id }, orderBy: { createdAt: 'desc' } }),
        prisma.bill.findMany({ where: { politicianId: id }, orderBy: { dateProposed: 'desc' } }),
        prisma.project.findMany({ where: { politicianId: id }, orderBy: { createdAt: 'desc' } }),
        prisma.controversy.findMany({ where: { politicianId: id, isVerified: true } }),
        prisma.ranking.findMany({ where: { politicianId: id }, include: { office: true } }),
      ]);

      if (!politician) {
        throw new AppError('Politician not found', 404);
      }

      res.json({
        success: true,
        data: {
          politician,
          promises,
          bills,
          projects,
          controversies,
          rankings,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const politician = await prisma.politician.create({
        data: req.body,
        include: {
          state: true,
          tenures: { include: { office: true } },
        },
      });

      res.status(201).json({
        success: true,
        data: politician,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const politician = await prisma.politician.update({
        where: { id },
        data: req.body,
        include: {
          state: true,
          tenures: { include: { office: true } },
        },
      });

      res.json({
        success: true,
        data: politician,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await prisma.politician.delete({ where: { id } });

      res.json({
        success: true,
        message: 'Politician deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
