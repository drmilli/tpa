"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ranking_controller_1 = require("../controllers/ranking.controller");
const router = (0, express_1.Router)();
const rankingController = new ranking_controller_1.RankingController();
router.get('/', rankingController.getAll);
router.get('/office/:officeId', rankingController.getByOffice);
router.get('/politician/:politicianId', rankingController.getByPolitician);
exports.default = router;
//# sourceMappingURL=ranking.routes.js.map