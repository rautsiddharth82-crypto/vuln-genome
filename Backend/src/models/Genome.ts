import mongoose, { Schema, Document } from 'mongoose';
import { Severity } from './Vulnerability.js';

export interface IVulnerabilityGenome extends Document {
  id: string; // e.g. SQLi-v1
  cwe: string;
  title: string;
  description: string;
  severity: Severity;
  languages: string[];
  occurrences: number;
  sourcePattern?: string;
  transformationPattern?: string;
  sinkPattern?: string;
  missingGuardPattern?: string;
  invariantRule?: string;
  detectionRule?: string;
  relatedCves?: string[];
  author?: string;
  firstSeen: string;
  lastUpdated: string;
  createdAt: Date;
  updatedAt: Date;
}

const VulnerabilityGenomeSchema = new Schema<IVulnerabilityGenome>(
  {
    id: { type: String, required: true, unique: true, index: true },
    cwe: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    severity: {
      type: String,
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'],
      default: 'HIGH',
    },
    languages: [{ type: String }],
    occurrences: { type: Number, default: 1 },
    sourcePattern: { type: String },
    transformationPattern: { type: String },
    sinkPattern: { type: String },
    missingGuardPattern: { type: String },
    invariantRule: { type: String },
    detectionRule: { type: String },
    relatedCves: [{ type: String }],
    author: { type: String, default: 'Autonomous Swarm Invariant Synthesizer' },
    firstSeen: { type: String, default: () => new Date().toISOString().split('T')[0] },
    lastUpdated: { type: String, default: () => new Date().toISOString().split('T')[0] },
  },
  { timestamps: true }
);

export const VulnerabilityGenomeModel = mongoose.model<IVulnerabilityGenome>('VulnerabilityGenome', VulnerabilityGenomeSchema);
