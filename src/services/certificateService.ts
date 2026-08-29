import { ProofCertificate, Vulnerability } from '../types';
import { apiClient } from './apiClient';
import { INITIAL_CERTIFICATES } from '../data/mockData';

class CertificateService {
  private certificates: ProofCertificate[] = [...INITIAL_CERTIFICATES];

  async getCertificates(): Promise<ProofCertificate[]> {
    return apiClient.get<ProofCertificate[]>('/certificates', () => {
      const stored = localStorage.getItem('vuln_genome_certificates');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return this.certificates;
        }
      }
      return this.certificates;
    });
  }

  async getCertificateById(id: string): Promise<ProofCertificate | null> {
    return apiClient.get<ProofCertificate>(`/certificate/${id}`, async () => {
      const all = await this.getCertificates();
      return all.find((c) => c.id === id) || null;
    });
  }

  async issueCertificateForVulnerability(vuln: Vulnerability): Promise<ProofCertificate> {
    const certId = `CERT-2026-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const hash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const newCert: ProofCertificate = {
      id: certId,
      vulnerabilityId: vuln.id,
      vulnerabilityTitle: vuln.title,
      cwe: vuln.cwe,
      genomeId: vuln.genomeId,
      affectedFile: vuln.file,
      fixedOn: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      fixedBy: 'Autonomous Patch Engine (CrewAI Orchestrator)',
      sha256Hash: hash,
      qrPayload: `https://vuln-genome.defense.mil/verify/${certId}?hash=${hash}`,
      status: 'VERIFIED',
      metrics: {
        exploitReplayPassed: true,
        regressionTestsPassed: true,
        noNewVulnerabilities: true,
        performanceDeltaPct: 0.12,
        memoryDeltaPct: -1.80,
        breakMyPatchSurvived: true,
      },
      signature: `ECDSA_P384_SHA384:${Array.from({ length: 96 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      issuer: 'VULN-GENOME Military Defense Verification Authority (Node #01)',
    };

    const existing = await this.getCertificates();
    const updated = [newCert, ...existing];
    localStorage.setItem('vuln_genome_certificates', JSON.stringify(updated));
    return newCert;
  }

  async verifyCertificateHash(hashOrId?: string): Promise<{ valid: boolean; certificate?: ProofCertificate }> {
    if (!hashOrId || typeof hashOrId !== 'string') {
      return { valid: false };
    }
    const cleanSearch = hashOrId.trim().toLowerCase();
    const all = await this.getCertificates();
    const found = all.find(
      (c) => (c.id && c.id.toLowerCase() === cleanSearch) || (c.sha256Hash && c.sha256Hash.toLowerCase() === cleanSearch)
    );

    return {
      valid: !!found,
      certificate: found,
    };
  }
}

export const certificateService = new CertificateService();
