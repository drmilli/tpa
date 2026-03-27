"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const politician_controller_1 = require("../controllers/politician.controller");
const router = (0, express_1.Router)();
const politicianController = new politician_controller_1.PoliticianController();
router.get('/', politicianController.getAll);
router.get('/search', politicianController.search);
router.get('/:id', politicianController.getById);
router.get('/:id/profile', politicianController.getProfile);
router.get('/:id/wikipedia', politicianController.fetchWikipediaInfo.bind(politicianController));
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'MODERATOR'), politicianController.create);
router.post('/:id/submit', auth_1.authenticate, politicianController.submitContribution.bind(politicianController));
router.post('/vote/:type/:itemId', auth_1.authenticate, politicianController.voteOnSubmission.bind(politicianController));
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)('ADMIN', 'MODERATOR'), politicianController.update);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), politicianController.delete);
exports.default = router;
//# sourceMappingURL=politician.routes.js.map