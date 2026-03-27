"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class RankingController {
    async getAll(req, res, next) {
        try {
            const { page = 1, limit = 50 } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            const rankings = await prisma.ranking.findMany({
                skip,
                take: Number(limit),
                orderBy: [{ totalScore: 'desc' }, { rank: 'asc' }],
                include: {
                    Politician: {
                        include: { State: true },
                    },
                    Office: true,
                },
            });
            res.json({
                success: true,
                data: rankings,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getByOffice(req, res, next) {
        try {
            const { officeId } = req.params;
            const { limit = 50 } = req.query;
            const rankings = await prisma.ranking.findMany({
                where: { officeId },
                take: Number(limit),
                orderBy: { rank: 'asc' },
                include: {
                    Politician: {
                        include: { State: true },
                    },
                    Office: true,
                },
            });
            res.json({
                success: true,
                data: rankings,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getByPolitician(req, res, next) {
        try {
            const { politicianId } = req.params;
            const rankings = await prisma.ranking.findMany({
                where: { politicianId },
                include: {
                    Office: true,
                },
            });
            res.json({
                success: true,
                data: rankings,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.RankingController = RankingController;
//# sourceMappingURL=ranking.controller.js.map