import { AuditLog } from '../types';
import { apiClient } from './apiClient';
import { INITIAL_AUDIT_LOGS } from '../data/mockData';

class AuditService {
  private logs: AuditLog[] = [...INITIAL_AUDIT_LOGS];

  async getAuditLogs(): Promise<AuditLog[]> {
    return apiClient.get<AuditLog[]>('/audit-logs', () => {
      const stored = localStorage.getItem('vuln_genome_audit_logs');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return this.logs;
        }
      }
      return this.logs;
    });
  }

  async logAction(action: string, resource: string, status: 'SUCCESS' | 'WARNING' | 'FAILED', details?: string): Promise<void> {
    const user = JSON.parse(localStorage.getItem('vuln_genome_user') || '{}');
    const newLog: AuditLog = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      user: user.name || 'Security Analyst',
      role: user.role || 'ANALYST',
      action,
      resource,
      ip: '10.240.12.88 (Classified Terminal)',
      status,
      details,
    };

    const current = await this.getAuditLogs();
    const updated = [newLog, ...current];
    localStorage.setItem('vuln_genome_audit_logs', JSON.stringify(updated));
  }

  async exportLogs(format: 'json' | 'csv'): Promise<string> {
    const logs = await this.getAuditLogs();
    if (format === 'json') {
      return JSON.stringify(logs, null, 2);
    }
    const headers = 'ID,Timestamp,User,Role,Action,Resource,IP,Status,Details\n';
    const rows = logs
      .map((l) => `"${l.id}","${l.timestamp}","${l.user}","${l.role}","${l.action}","${l.resource}","${l.ip}","${l.status}","${l.details || ''}"`)
      .join('\n');
    return headers + rows;
  }
}

export const auditService = new AuditService();
