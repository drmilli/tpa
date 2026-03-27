"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const factcheck_controller_1 = require("../controllers/factcheck.controller");
const router = (0, express_1.Router)();
// Public route - analyze a claim
router.post('/analyze', factcheck_controller_1.factCheckController.analyzeClaim.bind(factcheck_controller_1.factCheckController));
exports.default = router;
//# sourceMappingURL=factcheck.routes.js.map