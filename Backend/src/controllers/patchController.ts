import { Request, Response } from 'express';
import { patchSynthesizerService } from '../services/patchSynthesizerService.js';
import { storeService } from '../services/storeService.js';

export class PatchController {
  /**
   * Synthesize zero-regression patch
   */
  public async generatePatch(req: Request, res: Response): Promise<void> {
    try {
      const { vulnId } = req.params;
      const patch = await patchSynthesizerService.generatePatch(vulnId);
      res.status(200).json(patch);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Patch synthesis failed' });
    }
  }

  /**
   * Apply patch to codebase / record state
   */
  public async applyPatch(req: Request, res: Response): Promise<void> {
    try {
      const { vulnId } = req.params;
      await patchSynthesizerService.applyPatch(vulnId);
      const updatedVuln = await storeService.getVulnerabilityById(vulnId);
      res.status(200).json(updatedVuln);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Patch application failed' });
    }
  }

  /**
   * Get patch details
   */
  public async getPatch(req: Request, res: Response): Promise<void> {
    try {
      const { vulnId } = req.params;
      const patch = await storeService.getPatch(vulnId);
      if (!patch) {
        res.status(404).json({ success: false, error: 'Patch not found' });
        return;
      }
      res.status(200).json(patch);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const patchController = new PatchController();
