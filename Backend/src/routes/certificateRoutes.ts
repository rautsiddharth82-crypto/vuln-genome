import { Router } from 'express';
import { certificateController } from '../controllers/certificateController.js';

const router = Router();

router.get('/', (req, res) => certificateController.getCertificates(req, res));
router.get('/:id', (req, res) => certificateController.getCertificateById(req, res));

export default router;
