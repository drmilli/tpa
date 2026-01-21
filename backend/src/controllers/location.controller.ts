import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LocationController {
  async getStates(_req: Request, res: Response, next: NextFunction) {
    try {
      const states = await prisma.state.findMany({
        orderBy: { name: 'asc' },
      });

      res.json({
        success: true,
        data: states,
      });
    } catch (error) {
      next(error);
    }
  }

  async getLGAs(req: Request, res: Response, next: NextFunction) {
    try {
      const { stateId } = req.params;

      const lgas = await prisma.localGovernment.findMany({
        where: { stateId },
        orderBy: { name: 'asc' },
      });

      res.json({
        success: true,
        data: lgas,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSenatorialDistricts(req: Request, res: Response, next: NextFunction) {
    try {
      const { stateId } = req.params;

      const districts = await prisma.senatorialDistrict.findMany({
        where: { stateId },
        orderBy: { name: 'asc' },
      });

      res.json({
        success: true,
        data: districts,
      });
    } catch (error) {
      next(error);
    }
  }
}
