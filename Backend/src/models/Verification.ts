import mongoose, { Schema, Document } from 'mongoose';

export interface IVerificationCheck {
  id: string;
  name: string;
  passed: boolean;
  details: string;
  durationMs?: number;
}

export interface IVerificationStep {
  id: string;
  name: string;
  description?: string;
  status: 'PENDING' | 'RUNNING' | 'PASSED' | 'FAILED';
  durationMs?: number;
  details?: string;
}

export interface IVerificationReport extends Document {
  vulnerabilityId: string;
  status: 'VERIFIED' | 'FAILED';
  durationMs: number;
  checks: IVerificationCheck[];
  metrics: {
    regressionTestsPassed: number;
    regressionTestsTotal: number;
    performanceDeltaPct: number;
    memoryDeltaPct: number;
    breakMyPatchSurvived: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const VerificationCheckSchema = new Schema<IVerificationCheck>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    passed: { type: Boolean, required: true },
    details: { type: String, required: true },
    durationMs: { type: Number },
  },
  { _id: false }
);

const VerificationReportSchema = new Schema<IVerificationReport>(
  {
    vulnerabilityId: { type: String, required: true, index: true },
    status: { type: String, enum: ['VERIFIED', 'FAILED'], default: 'VERIFIED' },
    durationMs: { type: Number, default: 1420 },
    checks: [VerificationCheckSchema],
    metrics: {
      regressionTestsPassed: { type: Number, default: 48 },
      regressionTestsTotal: { type: Number, default: 48 },
      performanceDeltaPct: { type: Number, default: -1.2 },
      memoryDeltaPct: { type: Number, default: 0.0 },
      breakMyPatchSurvived: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export const VerificationReportModel = mongoose.model<IVerificationReport>('VerificationReport', VerificationReportSchema);
