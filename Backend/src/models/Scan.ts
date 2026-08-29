import mongoose, { Schema, Document } from 'mongoose';
import { IVulnerability } from './Vulnerability.js';

export type ScanStatus = 'QUEUED' | 'ANALYZING' | 'SCANNING' | 'EXTRACTING' | 'COMPLETED' | 'FAILED';
export type ScanStage = 'LEARN' | 'EXTRACT' | 'SCAN' | 'CONFIRM' | 'PATCH' | 'PROVE' | 'REMEMBER' | 'COMPLETE';

export interface ITerminalLog {
  timestamp: string;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR' | 'GENOME';
  message: string;
}

export interface IScanJob extends Document {
  id: string; // e.g. SCN-2026-9041
  target: string;
  repository?: string;
  branch: string;
  filesCount: number;
  linesAnalyzed: number;
  status: ScanStatus;
  currentStage: ScanStage;
  progress: number;
  vulnerabilitiesFound: number;
  breakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    fixed: number;
  };
  securityScore: number;
  durationSeconds: number;
  startedAt: Date;
  completedAt?: Date;
  options: {
    staticAnalysis: boolean;
    fuzzing: boolean;
    dynamicAnalysis: boolean;
    regressionTesting: boolean;
    generateProofCertificate: boolean;
    airGappedMode: boolean;
  };
  fileNames: string[];
  vulnerabilities: any[]; // Embedded or referenced vulnerability objects
  terminalLogs: ITerminalLog[];
  createdAt: Date;
  updatedAt: Date;
}

const TerminalLogSchema = new Schema<ITerminalLog>(
  {
    timestamp: { type: String, required: true },
    level: { type: String, enum: ['INFO', 'SUCCESS', 'WARN', 'ERROR', 'GENOME'], default: 'INFO' },
    message: { type: String, required: true },
  },
  { _id: false }
);

const ScanJobSchema = new Schema<IScanJob>(
  {
    id: { type: String, required: true, unique: true, index: true },
    target: { type: String, default: 'uploaded-source-package' },
    repository: { type: String },
    branch: { type: String, default: 'main' },
    filesCount: { type: Number, default: 0 },
    linesAnalyzed: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['QUEUED', 'ANALYZING', 'SCANNING', 'EXTRACTING', 'COMPLETED', 'FAILED'],
      default: 'ANALYZING',
      index: true,
    },
    currentStage: {
      type: String,
      enum: ['LEARN', 'EXTRACT', 'SCAN', 'CONFIRM', 'PATCH', 'PROVE', 'REMEMBER', 'COMPLETE'],
      default: 'LEARN',
    },
    progress: { type: Number, default: 0 },
    vulnerabilitiesFound: { type: Number, default: 0 },
    breakdown: {
      critical: { type: Number, default: 0 },
      high: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      low: { type: Number, default: 0 },
      fixed: { type: Number, default: 0 },
    },
    securityScore: { type: Number, default: 100 },
    durationSeconds: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    options: {
      staticAnalysis: { type: Boolean, default: true },
      fuzzing: { type: Boolean, default: true },
      dynamicAnalysis: { type: Boolean, default: true },
      regressionTesting: { type: Boolean, default: true },
      generateProofCertificate: { type: Boolean, default: true },
      airGappedMode: { type: Boolean, default: false },
    },
    fileNames: [{ type: String }],
    vulnerabilities: [{ type: Schema.Types.Mixed }],
    terminalLogs: [TerminalLogSchema],
  },
  { timestamps: true }
);

export const ScanJobModel = mongoose.model<IScanJob>('ScanJob', ScanJobSchema);
