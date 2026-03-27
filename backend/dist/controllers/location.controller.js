"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class LocationController {
    async getStates(_req, res, next) {
        try {
            const states = await prisma.state.findMany({
                orderBy: { name: 'asc' },
            });
            res.json({
                success: true,
                data: states,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getLGAs(req, res, next) {
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
        }
        catch (error) {
            next(error);
        }
    }
    async getSenatorialDistricts(req, res, next) {
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
        }
        catch (error) {
            next(error);
        }
    }
}
exports.LocationController = LocationController;
//# sourceMappingURL=location.controller.js.map