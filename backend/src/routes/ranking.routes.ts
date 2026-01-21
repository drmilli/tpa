import { Router } from 'express';
import { RankingController } from '../controllers/ranking.controller';

const router = Router();
const rankingController = new RankingController();

router.get('/', rankingController.getAll);
router.get('/office/:officeId', rankingController.getByOffice);
router.get('/politician/:politicianId', rankingController.getByPolitician);

export default router;
