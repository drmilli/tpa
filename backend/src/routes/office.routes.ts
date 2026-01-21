import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { OfficeController } from '../controllers/office.controller';

const router = Router();
const officeController = new OfficeController();

router.get('/', officeController.getAll);
router.get('/:id', officeController.getById);

router.post('/', authenticate, authorize('ADMIN'), officeController.create);
router.put('/:id', authenticate, authorize('ADMIN'), officeController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), officeController.delete);

export default router;
