import { Request, Response } from 'express';
import { storeService } from '../services/storeService.js';

export class CertificateController {
  public async getCertificates(_req: Request, res: Response): Promise<void> {
    try {
      const certs = await storeService.getCertificates();
      res.status(200).json(certs);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public async getCertificateById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const cert = await storeService.getCertificateById(id);
      if (!cert) {
        res.status(404).json({ success: false, error: `Certificate ${id} not found` });
        return;
      }
      res.status(200).json(cert);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const certificateController = new CertificateController();
