"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analysis_controller_1 = require("../controllers/analysis.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.get('/methodology', analysis_controller_1.analysisController.getScoringMethodology.bind(analysis_controller_1.analysisController));
router.get('/politician/:id', analysis_controller_1.analysisController.getPoliticianAnalysis.bind(analysis_controller_1.analysisController));
router.post('/compare', analysis_controller_1.analysisController.comparePoliticians.bind(analysis_controller_1.analysisController));
// Admin routes
router.post('/politician/:id/recalculate', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'SUPER_ADMIN'), analysis_controller_1.analysisController.recalculateScore.bind(analysis_controller_1.analysisController));
router.post('/update-all', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'SUPER_ADMIN'), analysis_controller_1.analysisController.updateAllScores.bind(analysis_controller_1.analysisController));
router.get('/scheduler/status', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'SUPER_ADMIN'), analysis_controller_1.analysisController.getSchedulerStatus.bind(analysis_controller_1.analysisController));
router.post('/scheduler/run/:jobName', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'SUPER_ADMIN'), analysis_controller_1.analysisController.runScheduledJob.bind(analysis_controller_1.analysisController));
exports.default = router;
//# sourceMappingURL=analysis.routes.js.map