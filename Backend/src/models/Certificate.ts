import mongoose, { Schema, Document } from 'mongoose';

export interface IProofCertificate extends Document {
  id: string; // e.g. CERT-2026-0847-F4A
  vulnerabilityId: string;
  vulnerabilityTitle: string;
  cwe: string;
  genomeId: string;
  affectedFile: string;
  fixedOn: string;
  fixedBy: string;
  sha256Hash: string;
  qrPayload: string;
  status: 'FIXED' | 'VERIFIED' | 'REVOKED';
  metrics: {
    exploitReplayPassed: boolean;
    regressionTestsPassed: boolean;
    noNewVulnerabilities: boolean;
    performanceDeltaPct: number;
    memoryDeltaPct: number;
    breakMyPatchSurvived: boolean;
  };
  signature: string;
  issuer: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProofCertificateSchema = new Schema<IProofCertificate>(
  {
    id: { type: String, required: true, unique: true, index: true },
    vulnerabilityId: { type: String, required: true, index: true },
    vulnerabilityTitle: { type: String, required: true },
    cwe: { type: String, required: true },
    genomeId: { type: String, required: true },
    affectedFile: { type: String, required: true },
    fixedOn: { type: String, required: true },
    fixedBy: { type: String, default: 'Autonomous Swarm Synthesizer & Formal Verifier' },
    sha256Hash: { type: String, required: true },
    qrPayload: { type: String, required: true },
    status: { type: String, enum: ['FIXED', 'VERIFIED', 'REVOKED'], default: 'VERIFIED' },
    metrics: {
      exploitReplayPassed: { type: Boolean, default: true },
      regressionTestsPassed: { type: Boolean, default: true },
      noNewVulnerabilities: { type: Boolean, default: true },
      performanceDeltaPct: { type: Number, default: -1.2 },
      memoryDeltaPct: { type: Number, default: 0.0 },
      breakMyPatchSurvived: { type: Boolean, default: true },
    },
    signature: { type: String, required: true },
    issuer: { type: String, default: 'VULN-GENOME Zero-Regression Cryptographic Authority' },
  },
  { timestamps: true }
);

export const ProofCertificateModel = mongoose.model<IProofCertificate>('ProofCertificate', ProofCertificateSchema);
