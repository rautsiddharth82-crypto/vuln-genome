import { Request, Response } from 'express';
import { verificationEngineService } from '../services/verificationEngineService.js';
import { storeService } from '../services/storeService.js';

export class VerifyController {
  /**
   * Run 7-stage formal verification and fuzzing mutation engine
   */
  public async verifyPatch(req: Request, res: Response): Promise<void> {
    try {
      const { vulnId } = req.params;
      const result = await verificationEngineService.verifyPatch(vulnId);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Verification failed' });
    }
  }

  /**
   * Get verification report for vulnerability
   */
  public async getVerificationReport(req: Request, res: Response): Promise<void> {
    try {
      const { vulnId } = req.params;
      const report = await storeService.getVerification(vulnId);
      if (!report) {
        res.status(404).json({ success: false, error: 'Verification report not found' });
        return;
      }
      res.status(200).json(report);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const verifyController = new VerifyController();
