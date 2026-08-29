import { Router } from 'express';
import { scanController } from '../controllers/scanController.js';

const router = Router();

router.post('/scan', (req, res) => scanController.startScan(req, res));
router.get('/scans', (req, res) => scanController.getScans(req, res));
router.get('/scans/:id', (req, res) => scanController.getScanById(req, res));
router.get('/results/:id', (req, res) => scanController.getScanById(req, res));

export default router;
