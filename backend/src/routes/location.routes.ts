import { Router } from 'express';
import { LocationController } from '../controllers/location.controller';

const router = Router();
const locationController = new LocationController();

router.get('/states', locationController.getStates);
router.get('/states/:stateId/lgas', locationController.getLGAs);
router.get('/states/:stateId/senatorial-districts', locationController.getSenatorialDistricts);

export default router;
