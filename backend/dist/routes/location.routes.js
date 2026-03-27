"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const location_controller_1 = require("../controllers/location.controller");
const router = (0, express_1.Router)();
const locationController = new location_controller_1.LocationController();
router.get('/states', locationController.getStates);
router.get('/states/:stateId/lgas', locationController.getLGAs);
router.get('/states/:stateId/senatorial-districts', locationController.getSenatorialDistricts);
exports.default = router;
//# sourceMappingURL=location.routes.js.map