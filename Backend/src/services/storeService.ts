import mongoose from 'mongoose';
import { IVulnerability, VulnerabilityModel } from '../models/Vulnerability.js';
import { IScanJob, ScanJobModel } from '../models/Scan.js';
import { IPatch, PatchModel } from '../models/Patch.js';
import { IVerificationReport, VerificationReportModel } from '../models/Verification.js';
import { IProofCertificate, ProofCertificateModel } from '../models/Certificate.js';
import { IVulnerabilityGenome, VulnerabilityGenomeModel } from '../models/Genome.js';
import { IAuditLog, AuditLogModel } from '../models/AuditLog.js';

class StoreService {
  public scans: Map<string, any> = new Map();
  public vulnerabilities: Map<string, any> = new Map();
  public patches: Map<string, any> = new Map();
  public verifications: Map<string, any> = new Map();
  public certificates: Map<string, any> = new Map();
  public genomes: Map<string, any> = new Map();
  public auditLogs: any[] = [];

  constructor() {
    this.initDefaultSeed();
  }

  private initDefaultSeed() {
    const defaultGenomes = [
      {
        id: 'SQLi-v1',
        cwe: 'CWE-89',
        title: 'SQL Injection via Tainted Dynamic Concat',
        description: 'Direct concatenation of untrusted input string into database query statements.',
        severity: 'CRITICAL',
        languages: ['java', 'python', 'cpp', 'javascript'],
        occurrences: 48,
        sourcePattern: 'HttpServletRequest.getParameter | req.query | input()',
        transformationPattern: 'String concatenation (+) / string.format / f-strings',
        sinkPattern: 'Statement.executeQuery | cursor.execute | db.query',
        missingGuardPattern: 'PreparedStatement.set*(index, val) / parameterized or ORM binding',
        invariantRule: 'FORALL input IN UntrustedSources: Type(input) MUST BE ParameterBound OR SanitizedAlphanumeric',
        detectionRule: 'AST: CallExpression[callee.property.name="executeQuery"] && hasTaintedArg()',
        relatedCves: ['CVE-2023-34362', 'CVE-2021-44228', 'CVE-2022-22965'],
      },
      {
        id: 'CMDi-v2',
        cwe: 'CWE-78',
        title: 'Command Injection via Subprocess Execution',
        description: 'Passing unsanitized shell meta-characters directly into command interpreter.',
        severity: 'CRITICAL',
        languages: ['python', 'cpp', 'javascript', 'go'],
        occurrences: 32,
        sourcePattern: 'sys.argv | request.body | readline()',
        transformationPattern: 'Unquoted template interpolation',
        sinkPattern: 'os.system | subprocess.Popen(shell=True) | exec()',
        missingGuardPattern: 'subprocess.run(..., shell=False) / shlex.quote() / strict array arguments',
        invariantRule: 'FORALL cmd IN ShellExecutors: ExecMethod MUST BE ArrayArgs AND shell=False',
        detectionRule: 'AST: CallExpression[callee.name="system" || (callee.name="Popen" && arguments.shell=True)]',
        relatedCves: ['CVE-2024-21626', 'CVE-2023-4911'],
      },
      {
        id: 'BOF-v1',
        cwe: 'CWE-120',
        title: 'Unbounded Buffer Copy (Stack Overflow)',
        description: 'Copying memory or string buffer without verifying source size against fixed destination bounds.',
        severity: 'HIGH',
        languages: ['cpp', 'c'],
        occurrences: 29,
        sourcePattern: 'recv() / read() / network packet buffer',
        transformationPattern: 'Pointer arithmetic without upper bound assertion',
        sinkPattern: 'strcpy() / sprintf() / strcat() / memcpy()',
        missingGuardPattern: 'strncpy(dest, src, sizeof(dest)-1) / std::string / bounded span',
        invariantRule: 'FORALL buffer_copy(dest, src): Length(src) < SizeOf(dest)',
        detectionRule: 'AST: CallExpression[callee.name="strcpy"]',
        relatedCves: ['CVE-2022-0847', 'CVE-2021-3156'],
      },
      {
        id: 'SSRF-v1',
        cwe: 'CWE-918',
        title: 'Server-Side Request Forgery',
        description: 'Initiating backend network requests to user-supplied URLs without internal IP range validation.',
        severity: 'HIGH',
        languages: ['javascript', 'python', 'java'],
        occurrences: 19,
        sourcePattern: 'req.body.webhookUrl / request.args.get("url")',
        transformationPattern: 'Direct pass-through to HTTP client',
        sinkPattern: 'fetch() / axios.get() / requests.get()',
        missingGuardPattern: 'IP/DNS resolution check against private RFC-1918 & Cloud Metadata 169.254.169.254 ranges',
        invariantRule: 'FORALL url IN OutboundRequests: IsPublicIP(ResolveDNS(url.host)) == TRUE',
        detectionRule: 'AST: CallExpression[callee.name="fetch"] && isUntrusted(url)',
        relatedCves: ['CVE-2021-26855', 'CVE-2022-26134'],
      },
    ];

    for (const g of defaultGenomes) {
      this.genomes.set(g.id, g);
    }

    const defaultVuln = {
      id: 'VULN-2026-0847',
      title: 'Dynamic SQL Concatenation in UserSearchService',
      cwe: 'CWE-89',
      cve: 'CVE-2026-11849',
      severity: 'CRITICAL',
      status: 'CONFIRMED',
      genomeId: 'SQLi-v1',
      confidence: 99.4,
      file: 'UserSearchService.java',
      line: 42,
      endLine: 47,
      language: 'java',
      codeSnippet: `String query = "SELECT * FROM users WHERE user_id = '" + userId + "' AND role = 'USER'";\nStatement stmt = connection.createStatement();\nResultSet rs = stmt.executeQuery(query);`,
      vulnerableCode: `String query = "SELECT * FROM users WHERE user_id = '" + userId + "' AND role = 'USER'";\nStatement stmt = connection.createStatement();\nResultSet rs = stmt.executeQuery(query);`,
      patchedCode: `PreparedStatement ps = connection.prepareStatement("SELECT * FROM users WHERE user_id = ? AND role = ?");\nps.setString(1, sanitizeInput(userId));\nps.setString(2, "USER");\nResultSet rs = ps.executeQuery();`,
      diff: `--- a/UserSearchService.java\n+++ b/UserSearchService.java\n@@ -42,3 +42,4 @@\n- String query = "SELECT * FROM users WHERE user_id = '" + userId + "' AND role = 'USER'";\n- Statement stmt = connection.createStatement();\n- ResultSet rs = stmt.executeQuery(query);\n+ PreparedStatement ps = connection.prepareStatement("SELECT * FROM users WHERE user_id = ? AND role = ?");\n+ ps.setString(1, sanitizeInput(userId));\n+ ps.setString(2, "USER");\n+ ResultSet rs = ps.executeQuery();`,
      description: 'Direct concatenation of untrusted client input variable userId into dynamic SQL query statement.',
      rootCause: 'Untrusted user input flows directly to JDBC statement sink without AST parameter binding.',
      attackPath: [
        'HTTP Request Parameter [userId] received from untrusted boundary',
        'Tainted string passed into controller without invariant assertion',
        'Direct string interpolation in SQL query execution sink',
        'Arbitrary SQL authentication bypass and data exfiltration achieved',
      ],
      impact: 'Full database exfiltration, unauthorized privilege escalation, table dropping.',
      exploitability: 'Trivial (Exploit payload requires zero authentication)',
      detectionEvidence: 'Taint path: Source param [userId] -> String.concat -> executeQuery sink at UserSearchService.java:42',
      pocPayload: `' UNION SELECT 1, username, password_hash, token FROM auth_users -- -`,
      patchExplanation: 'Refactored raw SQL concatenation to use PreparedStatement with strong type parameter bindings and input sanitization.',
      dataFlow: {
        source: 'HttpServletRequest.getParameter("userId")',
        transformation: 'String.format / "+" operator concatenation',
        sink: 'java.sql.Statement.executeQuery(query)',
        missingGuard: 'PreparedStatement parameter binding & strict regex alphanumeric validation',
      },
    };

    this.vulnerabilities.set(defaultVuln.id, defaultVuln);

    const defaultScan = {
      id: 'SCN-2026-9041',
      target: 'enterprise-core-gateway',
      repository: 'https://github.com/defense-sec/enterprise-core-gateway',
      branch: 'main',
      filesCount: 142,
      linesAnalyzed: 18450,
      status: 'COMPLETED',
      currentStage: 'COMPLETE',
      progress: 100,
      vulnerabilitiesFound: 1,
      breakdown: { critical: 1, high: 0, medium: 0, low: 0, fixed: 0 },
      securityScore: 85,
      durationSeconds: 3.8,
      startedAt: new Date(),
      completedAt: new Date(),
      options: {
        staticAnalysis: true,
        fuzzing: true,
        dynamicAnalysis: true,
        regressionTesting: true,
        generateProofCertificate: true,
        airGappedMode: false,
      },
      fileNames: ['UserSearchService.java'],
      vulnerabilities: [defaultVuln],
      terminalLogs: [
        { timestamp: '12:00:01', level: 'INFO', message: 'Ingesting AST and control flow graph...' },
        { timestamp: '12:00:02', level: 'GENOME', message: 'Taint matching against Genome Knowledge Base...' },
        { timestamp: '12:00:03', level: 'WARN', message: 'Flagged 1 Critical Taint Sink (CWE-89).' },
      ],
    };

    this.scans.set(defaultScan.id, defaultScan);
  }

  public isMongoConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  // --- Scan operations ---
  public async saveScan(scan: any): Promise<any> {
    this.scans.set(scan.id, scan);
    if (this.isMongoConnected()) {
      try {
        await ScanJobModel.findOneAndUpdate({ id: scan.id }, scan, { upsert: true });
      } catch {}
    }
    return scan;
  }

  public async getScans(): Promise<any[]> {
    if (this.isMongoConnected()) {
      try {
        const list = await ScanJobModel.find().sort({ startedAt: -1 });
        if (list.length > 0) return list;
      } catch {}
    }
    return Array.from(this.scans.values()).reverse();
  }

  public async getScanById(id: string): Promise<any | null> {
    if (this.isMongoConnected()) {
      try {
        const found = await ScanJobModel.findOne({ id });
        if (found) return found;
      } catch {}
    }
    return this.scans.get(id) || null;
  }

  // --- Vulnerability operations ---
  public async saveVulnerability(vuln: any): Promise<any> {
    this.vulnerabilities.set(vuln.id, vuln);
    if (this.isMongoConnected()) {
      try {
        await VulnerabilityModel.findOneAndUpdate({ id: vuln.id }, vuln, { upsert: true });
      } catch {}
    }
    return vuln;
  }

  public async getVulnerabilities(filter?: any): Promise<any[]> {
    if (this.isMongoConnected()) {
      try {
        const list = await VulnerabilityModel.find(filter || {}).sort({ createdAt: -1 });
        if (list.length > 0) return list;
      } catch {}
    }
    let list = Array.from(this.vulnerabilities.values());
    if (filter?.severity && filter.severity !== 'ALL') {
      list = list.filter((v) => v.severity === filter.severity);
    }
    if (filter?.status && filter.status !== 'ALL') {
      list = list.filter((v) => v.status === filter.status);
    }
    return list;
  }

  public async getVulnerabilityById(id: string): Promise<any | null> {
    if (this.isMongoConnected()) {
      try {
        const found = await VulnerabilityModel.findOne({ id });
        if (found) return found;
      } catch {}
    }
    return this.vulnerabilities.get(id) || null;
  }

  public async updateVulnerability(id: string, updates: any): Promise<any | null> {
    const existing = this.vulnerabilities.get(id) || {};
    const updated = { ...existing, ...updates };
    this.vulnerabilities.set(id, updated);
    if (this.isMongoConnected()) {
      try {
        await VulnerabilityModel.findOneAndUpdate({ id }, updates, { new: true });
      } catch {}
    }
    return updated;
  }

  // --- Patch operations ---
  public async savePatch(patch: any): Promise<any> {
    this.patches.set(patch.vulnerabilityId, patch);
    if (this.isMongoConnected()) {
      try {
        await PatchModel.findOneAndUpdate({ vulnerabilityId: patch.vulnerabilityId }, patch, { upsert: true });
      } catch {}
    }
    return patch;
  }

  public async getPatch(vulnId: string): Promise<any | null> {
    if (this.isMongoConnected()) {
      try {
        const found = await PatchModel.findOne({ vulnerabilityId: vulnId });
        if (found) return found;
      } catch {}
    }
    return this.patches.get(vulnId) || null;
  }

  // --- Verification operations ---
  public async saveVerification(report: any): Promise<any> {
    this.verifications.set(report.vulnerabilityId, report);
    if (this.isMongoConnected()) {
      try {
        await VerificationReportModel.findOneAndUpdate({ vulnerabilityId: report.vulnerabilityId }, report, { upsert: true });
      } catch {}
    }
    return report;
  }

  public async getVerification(vulnId: string): Promise<any | null> {
    if (this.isMongoConnected()) {
      try {
        const found = await VerificationReportModel.findOne({ vulnerabilityId: vulnId });
        if (found) return found;
      } catch {}
    }
    return this.verifications.get(vulnId) || null;
  }

  // --- Certificate operations ---
  public async saveCertificate(cert: any): Promise<any> {
    this.certificates.set(cert.id, cert);
    this.certificates.set(cert.vulnerabilityId, cert);
    if (this.isMongoConnected()) {
      try {
        await ProofCertificateModel.findOneAndUpdate({ id: cert.id }, cert, { upsert: true });
      } catch {}
    }
    return cert;
  }

  public async getCertificates(): Promise<any[]> {
    if (this.isMongoConnected()) {
      try {
        const list = await ProofCertificateModel.find().sort({ createdAt: -1 });
        if (list.length > 0) return list;
      } catch {}
    }
    // Deduplicate Map values by ID
    const unique = new Map();
    for (const cert of this.certificates.values()) {
      unique.set(cert.id, cert);
    }
    return Array.from(unique.values());
  }

  public async getCertificateById(id: string): Promise<any | null> {
    if (this.isMongoConnected()) {
      try {
        const found = await ProofCertificateModel.findOne({ $or: [{ id }, { vulnerabilityId: id }] });
        if (found) return found;
      } catch {}
    }
    return this.certificates.get(id) || null;
  }

  // --- Genome operations ---
  public async saveGenome(genome: any): Promise<any> {
    this.genomes.set(genome.id, genome);
    if (this.isMongoConnected()) {
      try {
        await VulnerabilityGenomeModel.findOneAndUpdate({ id: genome.id }, genome, { upsert: true });
      } catch {}
    }
    return genome;
  }

  public async getGenomes(): Promise<any[]> {
    if (this.isMongoConnected()) {
      try {
        const list = await VulnerabilityGenomeModel.find().sort({ occurrences: -1 });
        if (list.length > 0) return list;
      } catch {}
    }
    return Array.from(this.genomes.values());
  }

  public async getGenomeById(id: string): Promise<any | null> {
    if (this.isMongoConnected()) {
      try {
        const found = await VulnerabilityGenomeModel.findOne({ id });
        if (found) return found;
      } catch {}
    }
    return this.genomes.get(id) || null;
  }
}

export const storeService = new StoreService();
