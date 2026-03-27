"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const poll_controller_1 = require("../controllers/poll.controller");
const router = (0, express_1.Router)();
const pollController = new poll_controller_1.PollController();
router.get('/', pollController.getAll);
router.get('/:id', pollController.getById);
router.get('/:id/results', pollController.getResults);
router.post('/:id/vote', pollController.vote);
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MODERATOR'), pollController.create);
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MODERATOR'), pollController.update);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'), pollController.delete);
exports.default = router;
//# sourceMappingURL=poll.routes.js.map