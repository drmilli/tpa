"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const politician_routes_1 = __importDefault(require("./politician.routes"));
const office_routes_1 = __importDefault(require("./office.routes"));
const ranking_routes_1 = __importDefault(require("./ranking.routes"));
const poll_routes_1 = __importDefault(require("./poll.routes"));
const blog_routes_1 = __importDefault(require("./blog.routes"));
const comment_routes_1 = __importDefault(require("./comment.routes"));
const location_routes_1 = __importDefault(require("./location.routes"));
const contact_routes_1 = __importDefault(require("./contact.routes"));
const analysis_routes_1 = __importDefault(require("./analysis.routes"));
const factcheck_routes_1 = __importDefault(require("./factcheck.routes"));
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
router.use(rateLimiter_1.apiLimiter);
router.use('/auth', auth_routes_1.default);
router.use('/politicians', politician_routes_1.default);
router.use('/offices', office_routes_1.default);
router.use('/rankings', ranking_routes_1.default);
router.use('/polls', poll_routes_1.default);
router.use('/blogs', blog_routes_1.default);
router.use('/', comment_routes_1.default); // Comment routes are mounted at root since they include /blogs/:blogId/comments
router.use('/locations', location_routes_1.default);
router.use('/contact', contact_routes_1.default);
router.use('/analysis', analysis_routes_1.default);
router.use('/factcheck', factcheck_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map