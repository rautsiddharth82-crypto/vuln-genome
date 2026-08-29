import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  resource: string;
  ip: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    id: { type: String, required: true, unique: true, index: true },
    timestamp: { type: String, default: () => new Date().toISOString() },
    user: { type: String, default: 'secops-autonomous' },
    role: { type: String, default: 'LEAD_OFFICER' },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    ip: { type: String, default: '127.0.0.1' },
    status: { type: String, enum: ['SUCCESS', 'WARNING', 'FAILED'], default: 'SUCCESS' },
    details: { type: String },
  },
  { timestamps: true }
);

export const AuditLogModel = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
