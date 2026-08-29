import { Request, Response } from 'express';
import { storeService } from '../services/storeService.js';

export class GenomeController {
  public async getGenomes(_req: Request, res: Response): Promise<void> {
    try {
      const genomes = await storeService.getGenomes();
      res.status(200).json(genomes);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public async getGenomeById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const genome = await storeService.getGenomeById(id);
      if (!genome) {
        res.status(404).json({ success: false, error: `Genome ${id} not found` });
        return;
      }
      res.status(200).json(genome);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public async createGenome(req: Request, res: Response): Promise<void> {
    try {
      const genome = await storeService.saveGenome(req.body);
      res.status(201).json(genome);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const genomeController = new GenomeController();
