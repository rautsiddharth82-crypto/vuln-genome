import { Router } from 'express';
import { genomeController } from '../controllers/genomeController.js';

const router = Router();

router.get('/', (req, res) => genomeController.getGenomes(req, res));
router.get('/:id', (req, res) => genomeController.getGenomeById(req, res));
router.post('/', (req, res) => genomeController.createGenome(req, res));

export default router;
