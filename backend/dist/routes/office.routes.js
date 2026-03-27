"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const office_controller_1 = require("../controllers/office.controller");
const router = (0, express_1.Router)();
const officeController = new office_controller_1.OfficeController();
router.get('/', officeController.getAll);
router.get('/:id', officeController.getById);
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), officeController.create);
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), officeController.update);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), officeController.delete);
exports.default = router;
//# sourceMappingURL=office.routes.js.map