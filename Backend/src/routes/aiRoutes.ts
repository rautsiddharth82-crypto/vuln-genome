import { Router } from 'express';
import { aiController } from '../controllers/aiController.js';

const router = Router();

router.post('/agent-command', (req, res) => aiController.handleAgentCommand(req, res));
router.post('/agent-reasoning', (req, res) => aiController.handleAgentReasoning(req, res));
router.post('/agent-swarm-action', (req, res) => aiController.handleSwarmAction(req, res));

export default router;
