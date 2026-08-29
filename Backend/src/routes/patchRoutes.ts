import { Router } from 'express';
import { patchController } from '../controllers/patchController.js';
import { verifyController } from '../controllers/verifyController.js';

const router = Router();

router.post('/patch/:vulnId', (req, res) => patchController.generatePatch(req, res));
router.get('/patch/:vulnId', (req, res) => patchController.getPatch(req, res));
router.post('/patch/:vulnId/apply', (req, res) => patchController.applyPatch(req, res));
router.post('/patch/:vulnId/verify', (req, res) => verifyController.verifyPatch(req, res));
router.post('/verify/:vulnId', (req, res) => verifyController.verifyPatch(req, res));
router.get('/verify/:vulnId', (req, res) => verifyController.getVerificationReport(req, res));

export default router;
