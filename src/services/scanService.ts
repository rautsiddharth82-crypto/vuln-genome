import { ScanJob, TerminalLog, Vulnerability } from '../types';
import { apiClient } from './apiClient';
import { INITIAL_SCANS, INITIAL_VULNERABILITIES } from '../data/mockData';

export interface StartScanPayload {
  files?: { name: string; content: string; language: string }[];
  repositoryUrl?: string;
  branch?: string;
  options: {
    staticAnalysis: boolean;
    fuzzing: boolean;
    dynamicAnalysis: boolean;
    regressionTesting: boolean;
    generateProofCertificate: boolean;
    airGappedMode: boolean;
  };
}

class ScanService {
  private scans: ScanJob[] = [...INITIAL_SCANS];

  async getScans(): Promise<ScanJob[]> {
    return apiClient.get<ScanJob[]>('/scans', () => {
      const stored = localStorage.getItem('vuln_genome_scans');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return this.scans;
        }
      }
      return this.scans;
    });
  }

  async getScanHistory(): Promise<ScanJob[]> {
    return this.getScans();
  }

  async getScanById(id: string): Promise<ScanJob | null> {
    return apiClient.get<ScanJob>(`/results/${id}`, async () => {
      const allScans = await this.getScans();
      return allScans.find((s) => s.id === id) || null;
    });
  }

  async startScan(payload: StartScanPayload): Promise<ScanJob> {
    return apiClient.post<ScanJob>('/scan', payload, async () => {
      const scanId = `SCN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const fileNames = payload.files && payload.files.length > 0 
        ? payload.files.map(f => f.name)
        : ['UserSearchService.java', 'network_probe.py', 'packet_parser.cpp'];
      
      const totalLines = payload.files && payload.files.length > 0
        ? payload.files.reduce((acc, f) => acc + (f.content ? f.content.split('\n').length : 0), 0) + 12400
        : 18450;

      // Determine detected vulnerabilities based on uploaded files or defaults
      let detectedVulns: Vulnerability[] = [];
      if (payload.files && payload.files.length > 0) {
        const fileCodes = payload.files.map(f => (f.content || '').toLowerCase()).join(' ');
        if (fileCodes.includes('statement') || fileCodes.includes('select') || fileCodes.includes('query')) {
          detectedVulns.push(INITIAL_VULNERABILITIES[0]);
        }
        if (fileCodes.includes('os.system') || fileCodes.includes('subprocess') || fileCodes.includes('ping')) {
          detectedVulns.push(INITIAL_VULNERABILITIES[1]);
        }
        if (fileCodes.includes('strcpy') || fileCodes.includes('header_buffer') || fileCodes.includes('memcpy')) {
          detectedVulns.push(INITIAL_VULNERABILITIES[2]);
        }
        if (detectedVulns.length === 0) {
          detectedVulns = [INITIAL_VULNERABILITIES[0], INITIAL_VULNERABILITIES[1]];
        }
      } else {
        detectedVulns = [INITIAL_VULNERABILITIES[0], INITIAL_VULNERABILITIES[1], INITIAL_VULNERABILITIES[4]];
      }

      const criticals = detectedVulns.filter(v => v.severity === 'CRITICAL').length;
      const highs = detectedVulns.filter(v => v.severity === 'HIGH').length;

      const newScan: ScanJob = {
        id: scanId,
        target: payload.repositoryUrl || (payload.files && payload.files.length > 0 ? payload.files[0].name : 'uploaded-source-package'),
        repository: payload.repositoryUrl || 'uploaded-source-package',
        branch: payload.branch || 'HEAD',
        filesCount: fileNames.length,
        linesAnalyzed: totalLines,
        status: 'ANALYZING',
        currentStage: 'LEARN',
        progress: 10,
        vulnerabilitiesFound: detectedVulns.length,
        breakdown: {
          critical: criticals,
          high: highs,
          medium: 0,
          low: 0,
          fixed: 0,
        },
        criticalCount: criticals,
        highCount: highs,
        mediumCount: 0,
        lowCount: 0,
        fixedCount: 0,
        securityScore: Math.max(68, 100 - (criticals * 15 + highs * 8)),
        durationSeconds: 0,
        startedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        options: payload.options,
        fileNames,
        vulnerabilities: detectedVulns,
        terminalLogs: [
          { timestamp: new Date().toLocaleTimeString(), level: 'INFO', message: `Initializing VULN-GENOME Engine (Air-Gapped: ${payload.options.airGappedMode ? 'ON' : 'OFF'}).` },
          { timestamp: new Date().toLocaleTimeString(), level: 'INFO', message: `AST Ingestion started for ${fileNames.length} module(s).` },
        ]
      };

      const existing = await this.getScans();
      const updated = [newScan, ...existing];
      localStorage.setItem('vuln_genome_scans', JSON.stringify(updated));
      return newScan;
    });
  }

  // Helper to simulate progressive real-time scan stages
  async stepScanProgress(
    scanId: string, 
    onProgress: (scan: ScanJob) => void
  ): Promise<ScanJob> {
    const scan = await this.getScanById(scanId);
    if (!scan) throw new Error('Scan not found');

    const stages: Array<{ stage: ScanJob['currentStage']; progress: number; log: TerminalLog }> = [
      { stage: 'LEARN', progress: 18, log: { timestamp: new Date().toLocaleTimeString(), level: 'INFO', message: 'Stage [LEARN]: Ingesting AST and control flow graph...' } },
      { stage: 'EXTRACT', progress: 34, log: { timestamp: new Date().toLocaleTimeString(), level: 'GENOME', message: 'Stage [EXTRACT]: Extracting candidate execution traces and sinks...' } },
      { stage: 'SCAN', progress: 52, log: { timestamp: new Date().toLocaleTimeString(), level: 'WARN', message: 'Stage [SCAN]: Taint matching against Genome Knowledge Base (127 patterns)...' } },
      { stage: 'CONFIRM', progress: 68, log: { timestamp: new Date().toLocaleTimeString(), level: 'GENOME', message: 'Stage [CONFIRM]: Fuzzing harness reproduced unhandled boundary conditions.' } },
      { stage: 'PATCH', progress: 82, log: { timestamp: new Date().toLocaleTimeString(), level: 'SUCCESS', message: 'Stage [PATCH]: CrewAI Multi-Agent synthesizer compiled contextual diff.' } },
      { stage: 'PROVE', progress: 92, log: { timestamp: new Date().toLocaleTimeString(), level: 'SUCCESS', message: 'Stage [PROVE]: Dynamic exploit replay verified exploit neutralization.' } },
      { stage: 'REMEMBER', progress: 98, log: { timestamp: new Date().toLocaleTimeString(), level: 'GENOME', message: 'Stage [REMEMBER]: Embedding newly confirmed invariants into Genome Memory.' } },
      { stage: 'COMPLETE', progress: 100, log: { timestamp: new Date().toLocaleTimeString(), level: 'INFO', message: 'Scan & Autonomous Analysis finished successfully.' } }
    ];

    let current = { ...scan };
    for (const step of stages) {
      await new Promise(r => setTimeout(r, 650));
      current = {
        ...current,
        currentStage: step.stage,
        progress: step.progress,
        status: step.stage === 'COMPLETE' ? 'COMPLETED' : 'SCANNING',
        durationSeconds: Number((current.durationSeconds + 1.2).toFixed(1)),
        terminalLogs: [...current.terminalLogs, step.log]
      };
      if (step.stage === 'COMPLETE') {
        current.completedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
      }
      onProgress(current);
    }

    const scans = await this.getScans();
    const updated = scans.map(s => s.id === scanId ? current : s);
    localStorage.setItem('vuln_genome_scans', JSON.stringify(updated));
    return current;
  }
}

export const scanService = new ScanService();
