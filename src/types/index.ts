export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export type SeverityLevel = Severity;

export type VulnStatus = 'CONFIRMED' | 'PATCH_GENERATED' | 'PATCHING' | 'VERIFIED' | 'FIXED' | 'IGNORED' | 'PENDING';
export type VulnerabilityStatus = VulnStatus;

export type ScanStatus = 'QUEUED' | 'ANALYZING' | 'SCANNING' | 'EXTRACTING' | 'COMPLETED' | 'FAILED';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'ANALYST' | 'LEAD_OFFICER' | 'DEVSECOPS' | 'ADMIN';
  clearanceLevel: string;
  avatarUrl?: string;
  lastLogin: string;
}

export interface VerificationStep {
  id: string;
  name: string;
  description?: string;
  status: 'PENDING' | 'RUNNING' | 'PASSED' | 'FAILED';
  durationMs?: number;
  details?: string;
}

export interface VerificationReport {
  id?: string;
  vulnerabilityId: string;
  status: 'VERIFIED' | 'FAILED';
  durationMs: number;
  checks: {
    id: string;
    name: string;
    passed: boolean;
    details: string;
  }[];
  metrics: {
    regressionTestsPassed: number;
    regressionTestsTotal: number;
    performanceDeltaPct: number;
    memoryDeltaPct: number;
    breakMyPatchSurvived: boolean;
  };
}

export interface PatchDetail {
  vulnerabilityId: string;
  originalCode: string;
  patchedCode: string;
  diff: string;
  language: string;
  filename: string;
  synthesizer: string;
  explanation: string;
  styleMatchingScore?: number;
}

export interface Vulnerability {
  id: string; // e.g. VULN-2026-0847
  title: string;
  cwe: string; // e.g. CWE-89
  cve?: string;
  severity: Severity;
  status: VulnStatus;
  genomeId: string; // e.g. SQLi-v1
  confidence: number; // 0 - 100
  file: string;
  line: number;
  endLine?: number;
  language: 'java' | 'python' | 'cpp' | 'javascript' | 'go' | 'rust';
  codeSnippet?: string;
  vulnerableCode?: string;
  patchedCode?: string;
  diff?: string;
  description: string;
  rootCause?: string;
  attackPath?: string | string[];
  impact?: string;
  exploitability?: string;
  detectionEvidence?: string;
  pocPayload?: string;
  analysis?: {
    rootCause: string;
    attackPath: string[];
    impact: string;
    exploitability: string;
    detectionEvidence?: string;
    pocPayload?: string;
  };
  dataFlow?: {
    source: string;
    transformation: string;
    sink: string;
    missingGuard: string;
  };
  detectedAt?: string;
  discoveredAt?: string;
  fixedAt?: string;
  certificateId?: string;
  patchExplanation?: string;
  patch?: PatchDetail;
  verification?: VerificationReport;
  verificationSteps?: VerificationStep[];
}

export interface VulnerabilityGenome {
  id: string; // e.g. SQLi-v1
  cwe: string; // CWE-89
  title: string;
  description: string;
  severity: Severity;
  languages: ('java' | 'python' | 'cpp' | 'javascript' | 'go' | 'rust')[];
  occurrences: number;
  sourcePattern?: string;
  transformationPattern?: string;
  sinkPattern?: string;
  missingGuardPattern?: string;
  invariantRule?: string;
  detectionRule?: string;
  firstSeen: string;
  lastUpdated: string;
  author?: string;
  relatedCves?: string[];
  relatedCVEs?: string[];
  dataFlow?: {
    source: string;
    transformation: string;
    sink: string;
    missingGuard: string;
  };
}

export type Genome = VulnerabilityGenome;

export interface ScanJob {
  id: string; // e.g. SCN-2026-9041
  target?: string;
  repository?: string;
  branch: string;
  filesCount: number;
  linesAnalyzed: number;
  status: ScanStatus;
  currentStage: 'LEARN' | 'EXTRACT' | 'SCAN' | 'CONFIRM' | 'PATCH' | 'PROVE' | 'REMEMBER' | 'COMPLETE';
  progress: number;
  vulnerabilitiesFound: number;
  breakdown?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    fixed: number;
  };
  criticalCount?: number;
  highCount?: number;
  mediumCount?: number;
  lowCount?: number;
  fixedCount?: number;
  securityScore: number;
  durationSeconds: number;
  startedAt: string;
  completedAt?: string;
  options: {
    staticAnalysis: boolean;
    fuzzing: boolean;
    dynamicAnalysis: boolean;
    regressionTesting: boolean;
    generateProofCertificate: boolean;
    airGappedMode: boolean;
  };
  fileNames?: string[];
  vulnerabilities: Vulnerability[];
  terminalLogs: TerminalLog[];
}

export interface TerminalLog {
  timestamp: string;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR' | 'GENOME';
  message: string;
}

export interface ProofCertificate {
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
    performanceDeltaPct: number; // e.g. +0.2%
    memoryDeltaPct: number; // e.g. -1.1%
    breakMyPatchSurvived: boolean;
  };
  signature: string;
  issuer: string;
}

export interface TimeMachineEvent {
  id: string;
  date: string;
  vulnId?: string;
  vulnTitle: string;
  repository?: string;
  branch?: string;
  language?: string;
  genomeId: string;
  eventType?: string;
  severity?: Severity;
  description: string;
  timeSavedHours: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role?: string;
  action: string;
  resource: string;
  ip: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details?: string;
}

export type AuditLog = AuditLogEntry;

export interface SecurityStats {
  totalScans: number;
  totalVulnerabilities: number;
  fixedVulnerabilities: number;
  totalGenomes: number;
  criticalVulnerabilities: number;
  securityScore: number;
  detectionRate: number;
  patchSuccessRate: number;
  verificationAccuracy: number;
  falsePositiveRate: number;
}

// AI Agent Control System Types
export type AgentId = 
  | 'agent-sentinel' 
  | 'agent-synthesizer' 
  | 'agent-veritas' 
  | 'agent-chrono' 
  | 'agent-redstorm' 
  | 'agent-curator';

export type AgentStatus = 'IDLE' | 'ANALYZING' | 'EXECUTING' | 'VERIFYING' | 'ALERT' | 'PAUSED';

export type SwarmMode = 'AUTONOMOUS' | 'HUMAN_SUPERVISED' | 'WAR_GAME_SIMULATION' | 'AIR_GAPPED_FORTRESS';

export interface AgentThoughtLog {
  id: string;
  agentId: AgentId;
  agentName: string;
  timestamp: string;
  type: 'THOUGHT' | 'TOOL_CALL' | 'ACTION' | 'VERDICT' | 'INTERCEPT';
  summary: string;
  detail: string;
  dataPayload?: Record<string, any>;
}

export interface AIAgent {
  id: AgentId;
  name: string;
  codename: string;
  role: string;
  specialty: string;
  status: AgentStatus;
  autonomyLevel: 'SUPERVISED' | 'SEMI_AUTONOMOUS' | 'FULL_AUTONOMOUS';
  currentTask: string | null;
  progress: number;
  confidence: number;
  metrics: {
    cpuUsagePct: number;
    memoryMb: number;
    actionsExecuted: number;
    accuracyRate: number;
    throughputPerSec: string;
    uptimeSec: number;
  };
  reasoningLogs: AgentThoughtLog[];
  capabilities: string[];
  assignedTarget: string;
  temperature: number;
  safetyThreshold: number;
  badgeColor: string;
}

export interface AgentMissionStep {
  id: string;
  agentId: AgentId;
  agentName: string;
  stepName: string;
  action: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  output: string;
}

export interface AgentMission {
  id: string;
  title: string;
  objective: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'HALTED';
  commanderDirective: string;
  assignedAgents: AgentId[];
  progress: number;
  startedAt: string;
  completedAt?: string;
  results: {
    vulnerabilitiesTriaged: number;
    patchesSynthesized: number;
    proofsVerified: number;
    threatsBlocked: number;
    invariantsExtracted: number;
  };
  executionSteps: AgentMissionStep[];
}

export interface SwarmControlState {
  mode: SwarmMode;
  globalKillSwitch: boolean;
  activeMissions: number;
  swarmHealth: number;
  autoPatchApproval: boolean;
  maxConcurrency: number;
  aiModel: string;
  targetRepository: string;
  totalAstNodesProcessed: number;
  threatsNeutralized: number;
  lastDirective: string;
}

