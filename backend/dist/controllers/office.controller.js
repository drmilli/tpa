"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficeController = void 0;
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../middleware/errorHandler");
const prisma = new client_1.PrismaClient();
class OfficeController {
    async getAll(_req, res, next) {
        try {
            const offices = await prisma.office.findMany({
                orderBy: { name: 'asc' },
            });
            res.json({
                success: true,
                data: offices,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const office = await prisma.office.findUnique({
                where: { id },
                include: {
                    Metric: true,
                },
            });
            if (!office) {
                throw new errorHandler_1.AppError('Office not found', 404);
            }
            res.json({
                success: true,
                data: office,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const office = await prisma.office.create({
                data: req.body,
            });
            res.status(201).json({
                success: true,
                data: office,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
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
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await prisma.office.delete({ where: { id } });
            res.json({
                success: true,
                message: 'Office deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OfficeController = OfficeController;
//# sourceMappingURL=office.controller.js.map