import mongoose, { Schema, Document } from 'mongoose';

export interface IPatch extends Document {
  vulnerabilityId: string;
  originalCode: string;
  patchedCode: string;
  diff: string;
  language: string;
  filename: string;
  synthesizer: string;
  explanation: string;
  styleMatchingScore: number;
  applied: boolean;
  appliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PatchSchema = new Schema<IPatch>(
  {
    vulnerabilityId: { type: String, required: true, index: true },
    originalCode: { type: String, required: true },
    patchedCode: { type: String, required: true },
    diff: { type: String, required: true },
    language: { type: String, default: 'java' },
    filename: { type: String, required: true },
    synthesizer: { type: String, default: 'Autonomous AST Invariant Synthesizer' },
    explanation: { type: String, required: true },
    styleMatchingScore: { type: Number, default: 99.2 },
    applied: { type: Boolean, default: false },
    appliedAt: { type: Date },
  },
  { timestamps: true }
);

export const PatchModel = mongoose.model<IPatch>('Patch', PatchSchema);
