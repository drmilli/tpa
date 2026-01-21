import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export class PollController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { active } = req.query;
      const where: any = {};

      if (active === 'true') {
        where.isActive = true;
        where.endDate = { gte: new Date() };
      }

      const polls = await prisma.poll.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        data: polls,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const poll = await prisma.poll.findUnique({
        where: { id },
      });

      if (!poll) {
        throw new AppError('Poll not found', 404);
      }

      res.json({
        success: true,
        data: poll,
      });
    } catch (error) {
      next(error);
    }
  }

  async getResults(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const votes = await prisma.vote.findMany({
        where: { pollId: id },
      });

      const results = votes.reduce((acc: any, vote) => {
        acc[vote.option] = (acc[vote.option] || 0) + 1;
        return acc;
      }, {});

      const byState = votes.reduce((acc: any, vote) => {
        if (vote.state) {
          if (!acc[vote.state]) acc[vote.state] = {};
          acc[vote.state][vote.option] = (acc[vote.state][vote.option] || 0) + 1;
        }
        return acc;
      }, {});

      res.json({
        success: true,
        data: {
          totalVotes: votes.length,
          results,
          byState,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async vote(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { option, state, region } = req.body;

      const poll = await prisma.poll.findUnique({ where: { id } });

      if (!poll) {
        throw new AppError('Poll not found', 404);
      }

      if (!poll.isActive || new Date() > poll.endDate) {
        throw new AppError('Poll is not active', 400);
      }

      const vote = await prisma.vote.create({
        data: {
          pollId: id,
          option,
          state,
          region,
        },
      });

      res.status(201).json({
        success: true,
        data: vote,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const poll = await prisma.poll.create({
        data: req.body,
      });

      res.status(201).json({
        success: true,
        data: poll,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const poll = await prisma.poll.update({
        where: { id },
        data: req.body,
      });

      res.json({
        success: true,
        data: poll,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await prisma.poll.delete({ where: { id } });

      res.json({
        success: true,
        message: 'Poll deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
