"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../middleware/auth");
const blog_controller_1 = require("../controllers/blog.controller");
const router = (0, express_1.Router)();
const blogController = new blog_controller_1.BlogController();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024,
    },
});
// Admin routes (must be before dynamic :slug route)
router.get('/admin/all', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MODERATOR'), blogController.getAllAdmin);
router.post('/admin/upload', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MODERATOR'), upload.single('file'), blogController.uploadMedia.bind(blogController));
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MODERATOR'), blogController.create);
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN', 'MODERATOR'), blogController.update);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('SUPER_ADMIN', 'ADMIN'), blogController.delete);
// Public routes
router.get('/', blogController.getAll);
router.get('/:slug', blogController.getBySlug);
exports.default = router;
//# sourceMappingURL=blog.routes.js.map