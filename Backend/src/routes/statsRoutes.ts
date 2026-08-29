import { Router } from 'express';
import { statsController } from '../controllers/statsController.js';

const router = Router();

router.get('/stats', (req, res) => statsController.getStats(req, res));
router.get('/audit-logs', (req, res) => statsController.getAuditLogs(req, res));

export default router;
