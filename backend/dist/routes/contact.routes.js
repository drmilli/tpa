"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const contact_controller_1 = require("../controllers/contact.controller");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
const contactController = new contact_controller_1.ContactController();
// Public route - submit contact inquiry
router.post('/', rateLimiter_1.apiLimiter, [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('phone').optional().trim(),
    (0, express_validator_1.body)('company').optional().trim(),
    (0, express_validator_1.body)('type').isIn(['GENERAL', 'ADVERTISING', 'PARTNERSHIP', 'MEDIA', 'SUPPORT', 'OTHER']).withMessage('Invalid contact type'),
    (0, express_validator_1.body)('subject').trim().notEmpty().withMessage('Subject is required'),
    (0, express_validator_1.body)('message').trim().notEmpty().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
], contactController.create);
// Admin routes
router.get('/', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MODERATOR'), contactController.getAll);
router.get('/stats', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MODERATOR'), contactController.getStats);
router.get('/:id', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MODERATOR'), contactController.getById);
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MODERATOR'), contactController.update);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'), contactController.delete);
exports.default = router;
//# sourceMappingURL=contact.routes.js.map