import { Vulnerability, Genome, ScanJob, ProofCertificate, TimeMachineEvent, AuditLog, SecurityStats, User } from '../types';

export const INITIAL_USER: User = {
  id: 'USR-8821-SEC',
  username: 'analyst.vanguard',
  name: 'Maj. Sarah Vance',
  email: 's.vance@cyber.defense.mil',
  role: 'ANALYST',
  clearanceLevel: 'TOP SECRET // TALENT-KEYHOLE',
  lastLogin: '2026-08-24 10:42 UTC',
};

export const INITIAL_STATS: SecurityStats = {
  totalScans: 1247,
  totalVulnerabilities: 89,
  fixedVulnerabilities: 84,
  totalGenomes: 127,
  criticalVulnerabilities: 3,
  securityScore: 94,
  detectionRate: 99.4,
  patchSuccessRate: 96.8,
  verificationAccuracy: 99.9,
  falsePositiveRate: 0.8,
};

export const INITIAL_GENOMES: Genome[] = [
  {
    id: 'SQLi-v1',
    cwe: 'CWE-89',
    title: 'Dynamic Query Concatenation without Parameterization',
    description: 'Direct string interpolation of untrusted input into database query execution sinks without prepared statement binding.',
    severity: 'CRITICAL',
    languages: ['java', 'python', 'javascript', 'cpp', 'go'],
    occurrences: 47,
    sourcePattern: 'HTTP Request Parameter / RPC Unmarshaled Payload',
    transformationPattern: 'String.format() / f-string / string + concatenation',
    sinkPattern: 'Statement.executeQuery() / db.execute() / cursor.execute()',
    missingGuardPattern: 'PreparedStatement placeholder (?) / Parameterized query bindings',
    detectionRule: 'rule AST_SQL_INJECTION_CONCAT { meta: genome="SQLi-v1" condition: source($input) -> flow($query) -> sink($db_exec) and not sanitization($bind) }',
    firstSeen: '2025-01-14',
    lastUpdated: '2026-08-20',
    author: 'Autonomous Genome Engine (v4.2)',
    relatedCVEs: ['CVE-2024-41110', 'CVE-2023-38606', 'CVE-2022-22965']
  },
  {
    id: 'XSS-v3',
    cwe: 'CWE-79',
    title: 'Unescaped Context-Aware DOM Injection',
    description: 'Passing raw user input into innerHTML, document.write, or unescaped template literals leading to DOM XSS.',
    severity: 'HIGH',
    languages: ['javascript', 'python', 'java'],
    occurrences: 32,
    sourcePattern: 'location.search / window.postMessage / fetch JSON property',
    transformationPattern: 'Direct property assignment / Template string concatenation',
    sinkPattern: 'element.innerHTML / $(el).html() / dangerouslySetInnerHTML',
    missingGuardPattern: 'DOMPurify.sanitize() / textContent / Contextual HTML entity encoder',
    detectionRule: 'rule AST_DOM_XSS { meta: genome="XSS-v3" condition: untrusted_source -> raw_html_sink without context_encoding }',
    firstSeen: '2025-03-02',
    lastUpdated: '2026-08-18',
    author: 'Autonomous Genome Engine (v4.2)',
    relatedCVEs: ['CVE-2024-21413', 'CVE-2023-28252']
  },
  {
    id: 'BOF-v3',
    cwe: 'CWE-120',
    title: 'Unbounded Memory Copy in Stack Buffer',
    description: 'Copying arbitrary length memory payload to fixed-size stack buffer without bounds checking.',
    severity: 'CRITICAL',
    languages: ['cpp'],
    occurrences: 19,
    sourcePattern: 'Network Socket recv() / user CLI argv / raw byte stream',
    transformationPattern: 'Direct pointer pass into strcpy/sprintf/memcpy',
    sinkPattern: 'strcpy(dst, src) / sprintf(buf, fmt, ...) / memcpy(dest, src, n)',
    missingGuardPattern: 'strncpy_s / snprintf with sizeof() / std::string bounded buffers',
    detectionRule: 'rule AST_STACK_BUFFER_OVERFLOW { meta: genome="BOF-v3" condition: call("strcpy") or call("sprintf") without bounded size check }',
    firstSeen: '2025-02-10',
    lastUpdated: '2026-08-12',
    author: 'Autonomous Genome Engine (v4.2)',
    relatedCVEs: ['CVE-2024-38077', 'CVE-2023-21716']
  },
  {
    id: 'Secret-v1',
    cwe: 'CWE-798',
    title: 'Hardcoded High-Entropy Cryptographic Credential',
    description: 'Embedded private keys, API secrets, or military communications tokens within source binaries or scripts.',
    severity: 'HIGH',
    languages: ['python', 'java', 'javascript', 'cpp', 'go', 'rust'],
    occurrences: 24,
    sourcePattern: 'Static string constant assignment in source tree',
    transformationPattern: 'Direct authorization header assignment or encryption key initialization',
    sinkPattern: 'authHeader = "Bearer " + SECRET / init_crypto(HARDCODED_KEY)',
    missingGuardPattern: 'Vault secret resolver / Secure Enclave HSM / Environment variable loading',
    detectionRule: 'rule REGEX_ENTROPY_CREDENTIAL { meta: genome="Secret-v1" condition: shannon_entropy > 4.5 and pattern matches (AWS|RSA|MIL_TOKEN) }',
    firstSeen: '2025-04-19',
    lastUpdated: '2026-08-22',
    author: 'Autonomous Genome Engine (v4.2)',
    relatedCVEs: ['CVE-2024-29973']
  },
  {
    id: 'PathTraversal-v2',
    cwe: 'CWE-22',
    title: 'Unrestricted Path Traversal via Relative Directory Sequences',
    description: 'Resolving user-supplied filenames without canonical path restriction and directory escape checks.',
    severity: 'HIGH',
    languages: ['python', 'java', 'go', 'javascript'],
    occurrences: 18,
    sourcePattern: 'HTTP URL path / Query parameter fileName',
    transformationPattern: 'os.path.join(BASE_DIR, user_filename)',
    sinkPattern: 'open(target_path, "r") / new File(base, user_input)',
    missingGuardPattern: 'canonicalPath.startsWith(allowedBasePath) check / Path normalization',
    detectionRule: 'rule AST_PATH_TRAVERSAL { meta: genome="PathTraversal-v2" condition: file_sink with concatenated path lacking canonicalization }',
    firstSeen: '2025-06-08',
    lastUpdated: '2026-08-15',
    author: 'Autonomous Genome Engine (v4.2)',
    relatedCVEs: ['CVE-2024-27198', 'CVE-2023-46604']
  },
  {
    id: 'CommandInjection-v2',
    cwe: 'CWE-78',
    title: 'Shell Command Argument Injection via Unquoted Execution',
    description: 'Spawning child processes via system shell with untrusted arguments containing delimiter characters (; | & $).',
    severity: 'CRITICAL',
    languages: ['python', 'javascript', 'cpp'],
    occurrences: 15,
    sourcePattern: 'User CLI parameter / Webhook JSON payload',
    transformationPattern: 'String concatenation into shell execution string',
    sinkPattern: 'os.system(cmd) / subprocess.Popen(cmd, shell=True) / exec(cmd)',
    missingGuardPattern: 'subprocess.run([arg1, arg2], shell=False) / shlex.quote()',
    detectionRule: 'rule AST_COMMAND_INJECTION { meta: genome="CommandInjection-v2" condition: shell_exec with unescaped string formatting }',
    firstSeen: '2025-05-11',
    lastUpdated: '2026-08-21',
    author: 'Autonomous Genome Engine (v4.2)',
    relatedCVEs: ['CVE-2024-3400', 'CVE-2024-21887']
  }
];

export const INITIAL_VULNERABILITIES: Vulnerability[] = [
  {
    id: 'VULN-2026-0847',
    title: 'SQL Injection via Unsanitized User Search Query',
    cwe: 'CWE-89',
    cve: 'CVE-2026-0847',
    severity: 'CRITICAL',
    status: 'CONFIRMED',
    genomeId: 'SQLi-v1',
    confidence: 98,
    file: 'services/auth/UserSearchService.java',
    line: 45,
    endLine: 49,
    language: 'java',
    vulnerableCode: `package mil.defense.auth.service;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

public class UserSearchService {
    private final Connection connection;

    public UserSearchService(Connection connection) {
        this.connection = connection;
    }

    public ResultSet searchUser(String userId, String tenantId) throws Exception {
        Statement statement = connection.createStatement();
        // VULNERABLE: Direct string concatenation of untrusted userId
        String query = "SELECT id, clearance, role, token FROM users WHERE user_id = '" 
                        + userId + "' AND tenant_id = '" + tenantId + "'";
        return statement.executeQuery(query);
    }
}`,
    patchedCode: `package mil.defense.auth.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class UserSearchService {
    private final Connection connection;

    public UserSearchService(Connection connection) {
        this.connection = connection;
    }

    public ResultSet searchUser(String userId, String tenantId) throws Exception {
        // SECURE: Parameterized query with PreparedStatement binding
        String query = "SELECT id, clearance, role, token FROM users WHERE user_id = ? AND tenant_id = ?";
        PreparedStatement preparedStatement = connection.prepareStatement(query);
        preparedStatement.setString(1, userId);
        preparedStatement.setString(2, tenantId);
        return preparedStatement.executeQuery();
    }
}`,
    diff: `@@ -18,4 +18,6 @@
-        Statement statement = connection.createStatement();
-        String query = "SELECT id, clearance, role, token FROM users WHERE user_id = '" 
-                        + userId + "' AND tenant_id = '" + tenantId + "'";
-        return statement.executeQuery(query);
+        String query = "SELECT id, clearance, role, token FROM users WHERE user_id = ? AND tenant_id = ?";
+        PreparedStatement preparedStatement = connection.prepareStatement(query);
+        preparedStatement.setString(1, userId);
+        preparedStatement.setString(2, tenantId);
+        return preparedStatement.executeQuery();`,
    description: 'The searchUser method constructs an SQL query by directly concatenating the user-supplied userId and tenantId parameters. An attacker can break out of the string literal using single quotes and inject arbitrary SQL commands, potentially extracting password hashes, clearance tokens, or altering records.',
    rootCause: 'Lack of query parameterization and prepared statement abstraction during database query compilation.',
    attackPath: 'HTTP GET /api/v1/users?id=\' OR 1=1;-- -> UserSearchService.searchUser() -> Statement.executeQuery() -> Full database table dump.',
    impact: 'Complete compromise of authentication database integrity and confidential clearance records.',
    exploitability: 'IMMEDIATE',
    detectionEvidence: 'AST data-flow tracer identified user input string flow into Statement.executeQuery sink without sanitizing filter or parameter placeholder.',
    dataFlow: {
      source: 'String userId (HTTP request parameter)',
      transformation: 'String query = "... " + userId + " ..."',
      sink: 'statement.executeQuery(query)',
      missingGuard: 'PreparedStatement with preparedStatement.setString(1, userId)'
    },
    discoveredAt: '2026-08-24 09:14:22 UTC',
    patchExplanation: 'Replaced dynamic Statement concatenation with PreparedStatement utilizing positional binding parameters. Positional parameters ensure the SQL engine treats input strictly as literal values rather than executable syntax.'
  },
  {
    id: 'VULN-2026-0848',
    title: 'Arbitrary Command Injection in Diagnostics Runner',
    cwe: 'CWE-78',
    severity: 'CRITICAL',
    status: 'PATCH_GENERATED',
    genomeId: 'CommandInjection-v2',
    confidence: 96,
    file: 'backend/diagnostics/network_probe.py',
    line: 28,
    endLine: 34,
    language: 'python',
    vulnerableCode: `import os
import subprocess

def run_network_diagnostic(target_host: str, packet_count: int = 4):
    """Executes network ping test against targeted node."""
    # VULNERABLE: Direct f-string interpolation into shell command
    command = f"ping -c {packet_count} {target_host}"
    print(f"[PROBE] Executing command: {command}")
    return os.system(command)`,
    patchedCode: `import shlex
import subprocess

def run_network_diagnostic(target_host: str, packet_count: int = 4):
    """Executes network ping test against targeted node safely."""
    # SECURE: Argument list without shell=True prevents command chaining
    safe_host = shlex.quote(target_host)
    cmd_args = ["ping", "-c", str(int(packet_count)), target_host]
    return subprocess.run(cmd_args, capture_output=True, text=True, check=True)`,
    diff: `@@ -7,3 +7,4 @@
-    command = f"ping -c {packet_count} {target_host}"
-    return os.system(command)
+    cmd_args = ["ping", "-c", str(int(packet_count)), target_host]
+    return subprocess.run(cmd_args, capture_output=True, text=True, check=True)`,
    description: 'target_host parameter is directly formatted into a shell execution string. Injecting payloads like `8.8.8.8; cat /etc/shadow` executes secondary bash payloads with the privileges of the diagnostics worker.',
    rootCause: 'Shell evaluation enabled via os.system() receiving unvalidated user string arguments.',
    attackPath: 'POST /api/diagnostics { "host": "127.0.0.1; whoami" } -> os.system() -> Subshell execution.',
    impact: 'Remote Code Execution (RCE) on the command cluster orchestrator node.',
    exploitability: 'IMMEDIATE',
    detectionEvidence: 'Taint engine tracked target_host variable into os.system() with no delimiter stripping.',
    dataFlow: {
      source: 'target_host (API body string)',
      transformation: 'f"ping -c {packet_count} {target_host}"',
      sink: 'os.system(command)',
      missingGuard: 'subprocess.run(args, shell=False)'
    },
    discoveredAt: '2026-08-24 09:18:04 UTC',
    patchExplanation: 'Migrated to subprocess.run with argument vector array format, enforcing shell=False to prevent argument chaining and delimiter injection.'
  },
  {
    id: 'VULN-2026-0849',
    title: 'Stack Buffer Overflow in Packet Demuxer',
    cwe: 'CWE-120',
    severity: 'CRITICAL',
    status: 'FIXED',
    genomeId: 'BOF-v3',
    confidence: 99,
    file: 'core/telemetry/packet_parser.cpp',
    line: 62,
    endLine: 68,
    language: 'cpp',
    vulnerableCode: `#include <cstring>
#include <iostream>

void parse_packet_header(const char* raw_payload, size_t payload_len) {
    char header_buffer[64];
    // VULNERABLE: strcpy doesn't check payload_len against header_buffer size
    strcpy(header_buffer, raw_payload);
    std::cout << "Parsed header: " << header_buffer << std::endl;
}`,
    patchedCode: `#include <cstring>
#include <iostream>
#include <algorithm>

void parse_packet_header(const char* raw_payload, size_t payload_len) {
    char header_buffer[64];
    // SECURE: Bounded copy with explicit null-termination
    size_t safe_len = std::min(payload_len, sizeof(header_buffer) - 1);
    std::memcpy(header_buffer, raw_payload, safe_len);
    header_buffer[safe_len] = '\\0';
    std::cout << "Parsed header: " << header_buffer << std::endl;
}`,
    diff: `@@ -6,2 +6,4 @@
-    strcpy(header_buffer, raw_payload);
+    size_t safe_len = std::min(payload_len, sizeof(header_buffer) - 1);
+    std::memcpy(header_buffer, raw_payload, safe_len);
+    header_buffer[safe_len] = '\\0';`,
    description: 'Function parse_packet_header copies an unverified raw payload byte stream into a 64-byte stack allocation using unsafe strcpy. Payloads exceeding 64 bytes overwrite the stack return address.',
    rootCause: 'Unbounded C-style string manipulation in native C++ stack memory.',
    attackPath: 'Over-sized telemetry frame (128 bytes) -> packet_parser -> Stack overwrite -> Control flow hijack.',
    impact: 'Denial of Service or arbitrary memory execution in kernel telemetry bridge.',
    exploitability: 'HIGH',
    detectionEvidence: 'Dynamic fuzzer triggered segmentation fault on 92-byte cyclic ASCII input sequence.',
    dataFlow: {
      source: 'raw_payload (UDP socket frame)',
      transformation: 'Direct argument pass',
      sink: 'strcpy(header_buffer, raw_payload)',
      missingGuard: 'Bounds check with sizeof(header_buffer) and memcpy'
    },
    discoveredAt: '2026-08-23 14:10:00 UTC',
    fixedAt: '2026-08-23 15:20:00 UTC',
    certificateId: 'CERT-2026-0849-B3C',
    patchExplanation: 'Enforced strict bounds check using std::min against buffer capacity minus null byte, followed by explicit byte-level termination.'
  },
  {
    id: 'VULN-2026-0850',
    title: 'Hardcoded Cryptographic Master Token in Config',
    cwe: 'CWE-798',
    severity: 'HIGH',
    status: 'FIXED',
    genomeId: 'Secret-v1',
    confidence: 100,
    file: 'gateway/security/keys.js',
    line: 12,
    language: 'javascript',
    vulnerableCode: `// Military Drone Relay Gateway Key
export const RELAY_MASTER_KEY = "MIL-ENC-9948-AF81-BBA2-89912093848123984";
export const VAULT_FALLBACK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.s6K";`,
    patchedCode: `// Secure Vault Token Resolver
export const RELAY_MASTER_KEY = process.env.RELAY_MASTER_KEY || (() => {
  throw new Error("FATAL: RELAY_MASTER_KEY must be loaded via Secure Enclave / Environment");
})();`,
    description: 'High-entropy master cryptographic keys embedded directly inside static JavaScript module.',
    rootCause: 'Developer fallback tokens committed directly to Git repository.',
    attackPath: 'Static source analysis / binary decompile -> Extract master key -> Forge relay commands.',
    impact: 'Complete authentication bypass on remote drone relay clusters.',
    exploitability: 'IMMEDIATE',
    detectionEvidence: 'Shannon entropy detector flagged string with 5.12 entropy score matching MIL-ENC schema.',
    dataFlow: {
      source: 'Static source file token literal',
      transformation: 'Exported constant',
      sink: 'crypto.createCipheriv()',
      missingGuard: 'process.env and KMS Hardware Enclave runtime resolution'
    },
    discoveredAt: '2026-08-22 18:30:00 UTC',
    fixedAt: '2026-08-22 19:05:00 UTC',
    certificateId: 'CERT-2026-0850-S1V'
  },
  {
    id: 'VULN-2026-0851',
    title: 'Path Traversal in Mission Log Exporter',
    cwe: 'CWE-22',
    severity: 'HIGH',
    status: 'VERIFIED',
    genomeId: 'PathTraversal-v2',
    confidence: 94,
    file: 'api/exporters/log_retriever.py',
    line: 52,
    language: 'python',
    vulnerableCode: `import os

LOG_BASE_DIR = "/var/log/vuln-genome/missions"

def fetch_mission_log(log_filename: str):
    # VULNERABLE: Direct path join without canonicalization
    full_path = os.path.join(LOG_BASE_DIR, log_filename)
    with open(full_path, 'r') as f:
        return f.read()`,
    patchedCode: `import os

LOG_BASE_DIR = os.path.abspath("/var/log/vuln-genome/missions")

def fetch_mission_log(log_filename: str):
    # SECURE: Path resolution with strict directory boundary enforcement
    normalized_path = os.path.abspath(os.path.join(LOG_BASE_DIR, log_filename))
    if not normalized_path.startswith(LOG_BASE_DIR + os.sep):
        raise PermissionError("Access denied: Directory traversal detected.")
    with open(normalized_path, 'r') as f:
        return f.read()`,
    description: 'Supplying ../../ relative directory sequences allows an adversary to read arbitrary system files (e.g. /etc/passwd or private cryptographic certificates).',
    rootCause: 'Unchecked file path combination using os.path.join which allows traversal prefixes.',
    attackPath: 'GET /api/logs?file=../../../../etc/shadow -> Exfiltrate server shadow passwords.',
    impact: 'Unauthorized arbitrary file read and credential compromise.',
    exploitability: 'HIGH',
    detectionEvidence: 'Symbolic executor generated traversal path traversing outside LOG_BASE_DIR.',
    dataFlow: {
      source: 'log_filename (HTTP query param)',
      transformation: 'os.path.join(LOG_BASE_DIR, log_filename)',
      sink: 'open(full_path, "r")',
      missingGuard: 'os.path.abspath boundary check with startswith()'
    },
    discoveredAt: '2026-08-24 08:30:00 UTC',
    fixedAt: '2026-08-24 09:40:00 UTC',
    certificateId: 'CERT-2026-0851-PT2'
  }
];

export const INITIAL_CERTIFICATES: ProofCertificate[] = [
  {
    id: 'CERT-2026-0849-B3C',
    vulnerabilityId: 'VULN-2026-0849',
    vulnerabilityTitle: 'Stack Buffer Overflow in Packet Demuxer',
    cwe: 'CWE-120',
    genomeId: 'BOF-v3',
    affectedFile: 'core/telemetry/packet_parser.cpp',
    fixedOn: '2026-08-23 15:20:00 UTC',
    fixedBy: 'Autonomous Patch Engine (CrewAI Orchestrator)',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    qrPayload: 'https://vuln-genome.defense.mil/verify/CERT-2026-0849-B3C?hash=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'VERIFIED',
    metrics: {
      exploitReplayPassed: true,
      regressionTestsPassed: true,
      noNewVulnerabilities: true,
      performanceDeltaPct: 0.15,
      memoryDeltaPct: -2.40,
      breakMyPatchSurvived: true
    },
    signature: 'ECDSA_P384_SHA384:3065023023910c28371a2938472918374928172938472918237491823749182739182739023100827364518293746192837461928374',
    issuer: 'VULN-GENOME Military Defense Verification Authority (Node #09)'
  },
  {
    id: 'CERT-2026-0850-S1V',
    vulnerabilityId: 'VULN-2026-0850',
    vulnerabilityTitle: 'Hardcoded Cryptographic Master Token in Config',
    cwe: 'CWE-798',
    genomeId: 'Secret-v1',
    affectedFile: 'gateway/security/keys.js',
    fixedOn: '2026-08-22 19:05:00 UTC',
    fixedBy: 'VULN-GENOME Autonomous Fix Agent',
    sha256Hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    qrPayload: 'https://vuln-genome.defense.mil/verify/CERT-2026-0850-S1V?hash=9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    status: 'VERIFIED',
    metrics: {
      exploitReplayPassed: true,
      regressionTestsPassed: true,
      noNewVulnerabilities: true,
      performanceDeltaPct: 0.00,
      memoryDeltaPct: 0.00,
      breakMyPatchSurvived: true
    },
    signature: 'ECDSA_P384_SHA384:3044022067a9182736451928374619283746192837461928374619283746192837461928022076192837461928374619283746192837',
    issuer: 'VULN-GENOME Military Defense Verification Authority (Node #03)'
  }
];

export const INITIAL_SCANS: ScanJob[] = [
  {
    id: 'SCN-2026-9041',
    target: 'github.com/us-cyber-command/tactical-comms-gateway',
    repository: 'github.com/us-cyber-command/tactical-comms-gateway',
    branch: 'main',
    filesCount: 142,
    linesAnalyzed: 28450,
    status: 'COMPLETED',
    currentStage: 'COMPLETE',
    progress: 100,
    vulnerabilitiesFound: 3,
    breakdown: {
      critical: 2,
      high: 1,
      medium: 0,
      low: 0,
      fixed: 2,
    },
    criticalCount: 2,
    highCount: 1,
    mediumCount: 0,
    lowCount: 0,
    fixedCount: 2,
    securityScore: 92,
    durationSeconds: 14.8,
    startedAt: '2026-08-24 09:12:00',
    completedAt: '2026-08-24 09:12:15',
    options: {
      staticAnalysis: true,
      fuzzing: true,
      dynamicAnalysis: true,
      regressionTesting: true,
      generateProofCertificate: true,
      airGappedMode: true
    },
    fileNames: ['UserSearchService.java', 'network_probe.py', 'packet_parser.cpp', 'keys.js'],
    vulnerabilities: INITIAL_VULNERABILITIES.slice(0, 3),
    terminalLogs: [
      { timestamp: '09:12:01', level: 'INFO', message: 'VULN-GENOME Engine initialized in Air-Gapped secure container.' },
      { timestamp: '09:12:03', level: 'INFO', message: 'AST Parser loaded 142 source units across Java, Python, C++.' },
      { timestamp: '09:12:05', level: 'GENOME', message: 'GENOME MATCH: Pattern SQLi-v1 detected in UserSearchService.java:45 (Confidence: 98%).' },
      { timestamp: '09:12:07', level: 'GENOME', message: 'GENOME MATCH: Pattern CommandInjection-v2 in network_probe.py:28 (Confidence: 96%).' },
      { timestamp: '09:12:09', level: 'WARN', message: 'Dynamic Fuzzer: Stack overflow reproduction confirmed in packet_parser.cpp.' },
      { timestamp: '09:12:12', level: 'SUCCESS', message: 'Autonomous Patch Generator generated 3 candidate fixes.' },
      { timestamp: '09:12:14', level: 'SUCCESS', message: 'Verification Engine completed 6-point regression tests.' },
      { timestamp: '09:12:15', level: 'INFO', message: 'Proof Certificates generated. Genome memory graph updated.' }
    ]
  },
  {
    id: 'SCN-2026-9038',
    target: 'internal-git.defense.mil/air-defense/missile-telemetry',
    repository: 'internal-git.defense.mil/air-defense/missile-telemetry',
    branch: 'release/v3.4',
    filesCount: 88,
    linesAnalyzed: 19320,
    status: 'COMPLETED',
    currentStage: 'COMPLETE',
    progress: 100,
    vulnerabilitiesFound: 1,
    breakdown: {
      critical: 1,
      high: 0,
      medium: 0,
      low: 0,
      fixed: 1,
    },
    criticalCount: 1,
    highCount: 0,
    mediumCount: 0,
    lowCount: 0,
    fixedCount: 1,
    securityScore: 98,
    durationSeconds: 11.2,
    startedAt: '2026-08-23 14:09:40',
    completedAt: '2026-08-23 14:09:51',
    options: {
      staticAnalysis: true,
      fuzzing: true,
      dynamicAnalysis: true,
      regressionTesting: true,
      generateProofCertificate: true,
      airGappedMode: true
    },
    fileNames: ['packet_parser.cpp', 'telemetry_sink.h'],
    vulnerabilities: [INITIAL_VULNERABILITIES[2]],
    terminalLogs: [
      { timestamp: '14:09:41', level: 'INFO', message: 'AST Parser loaded 88 C++ source modules.' },
      { timestamp: '14:09:45', level: 'GENOME', message: 'GENOME MATCH: Pattern BOF-v3 flagged in packet_parser.cpp:62.' },
      { timestamp: '14:09:48', level: 'SUCCESS', message: 'Patch Engine synthesized bounded std::memcpy fix.' },
      { timestamp: '14:09:51', level: 'SUCCESS', message: 'Proof Certificate CERT-2026-0849-B3C issued.' }
    ]
  },
  {
    id: 'SCN-2026-9022',
    target: 'github.com/defense-cloud/auth-broker',
    repository: 'github.com/defense-cloud/auth-broker',
    branch: 'staging',
    filesCount: 65,
    linesAnalyzed: 12100,
    status: 'COMPLETED',
    currentStage: 'COMPLETE',
    progress: 100,
    vulnerabilitiesFound: 1,
    breakdown: {
      critical: 0,
      high: 1,
      medium: 0,
      low: 0,
      fixed: 1,
    },
    criticalCount: 0,
    highCount: 1,
    mediumCount: 0,
    lowCount: 0,
    fixedCount: 1,
    securityScore: 96,
    durationSeconds: 9.4,
    startedAt: '2026-08-22 18:29:40',
    completedAt: '2026-08-22 18:29:49',
    options: {
      staticAnalysis: true,
      fuzzing: false,
      dynamicAnalysis: true,
      regressionTesting: true,
      generateProofCertificate: true,
      airGappedMode: false
    },
    fileNames: ['keys.js', 'auth.ts'],
    vulnerabilities: [INITIAL_VULNERABILITIES[3]],
    terminalLogs: [
      { timestamp: '18:29:41', level: 'INFO', message: 'Entropy Scanner started on 65 JS/TS modules.' },
      { timestamp: '18:29:44', level: 'WARN', message: 'GENOME MATCH: Secret-v1 identified in gateway/security/keys.js.' },
      { timestamp: '18:29:49', level: 'SUCCESS', message: 'Environment resolver patch verified and applied.' }
    ]
  }
];

export const INITIAL_TIME_MACHINE_EVENTS: TimeMachineEvent[] = [
  {
    id: 'TM-001',
    date: '2025-01-14',
    vulnId: 'VULN-2025-0012',
    vulnTitle: 'First SQL Injection Discovery in Java Auth Gateway',
    language: 'Java',
    genomeId: 'SQLi-v1',
    eventType: 'DISCOVERED',
    severity: 'CRITICAL',
    description: 'Discovered raw Statement.executeQuery concatenation in user login flow.',
    timeSavedHours: 0
  },
  {
    id: 'TM-002',
    date: '2025-01-14',
    vulnId: 'VULN-2025-0012',
    vulnTitle: 'Autonomous Extraction of SQLi-v1 Genome Architecture',
    language: 'Agnostic',
    genomeId: 'SQLi-v1',
    eventType: 'GENOME_EXTRACTED',
    severity: 'INFO',
    description: 'Genome Engine indexed Source -> Transformation -> Sink -> Missing Guard paradigm.',
    timeSavedHours: 12
  },
  {
    id: 'TM-003',
    date: '2025-03-20',
    vulnId: 'VULN-2025-0481',
    vulnTitle: 'Zero-Day Prevented in Python Billing Microservice',
    language: 'Python',
    genomeId: 'SQLi-v1',
    eventType: 'PREVENTED_IN_NEW_BUILD',
    severity: 'HIGH',
    description: 'Genome SQLi-v1 matched f-string query in pull request #119 before deployment.',
    timeSavedHours: 48
  },
  {
    id: 'TM-004',
    date: '2025-08-11',
    vulnId: 'VULN-2025-1102',
    vulnTitle: 'Stack Buffer Overflow Neutralized in C++ Bridge',
    language: 'C++',
    genomeId: 'BOF-v3',
    eventType: 'PATCH_VERIFIED',
    severity: 'CRITICAL',
    description: 'Dynamic fuzzer verified replacement of strcpy with bounded std::memcpy.',
    timeSavedHours: 36
  },
  {
    id: 'TM-005',
    date: '2026-02-18',
    vulnId: 'VULN-2026-0219',
    vulnTitle: 'Prototype Pollution Stopped in Node Frontend',
    language: 'JavaScript',
    genomeId: 'XSS-v3',
    eventType: 'PREVENTED_IN_NEW_BUILD',
    severity: 'HIGH',
    description: 'Automatic genome rule blocked deep merge injection in build pipeline.',
    timeSavedHours: 24
  },
  {
    id: 'TM-006',
    date: '2026-08-24',
    vulnId: 'VULN-2026-0847',
    vulnTitle: 'Autonomous Patch & Cryptographic Proof Issued for SQLi-v1',
    language: 'Java',
    genomeId: 'SQLi-v1',
    eventType: 'PREVENTED_IN_NEW_BUILD',
    severity: 'CRITICAL',
    description: 'PreparedStatement migration applied and cryptographically certified.',
    timeSavedHours: 18
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-9912',
    timestamp: '2026-08-24 11:42:10 UTC',
    user: 'Maj. Sarah Vance',
    role: 'ANALYST',
    action: 'START_SECURITY_SCAN',
    resource: 'github.com/us-cyber-command/tactical-comms-gateway',
    ip: '10.240.12.88',
    status: 'SUCCESS',
    details: 'Initiated static + fuzzing pipeline with 142 files in Air-Gapped mode.'
  },
  {
    id: 'AUD-9911',
    timestamp: '2026-08-24 10:15:02 UTC',
    user: 'Maj. Sarah Vance',
    role: 'ANALYST',
    action: 'GENERATE_PATCH',
    resource: 'VULN-2026-0847 (SQLi-v1)',
    ip: '10.240.12.88',
    status: 'SUCCESS',
    details: 'CrewAI Orchestrator synthesized PreparedStatement patch.'
  },
  {
    id: 'AUD-9910',
    timestamp: '2026-08-24 09:50:33 UTC',
    user: 'SYSTEM_AUTONOMOUS_BOT',
    role: 'DEVSECOPS',
    action: 'ISSUE_PROOF_CERTIFICATE',
    resource: 'CERT-2026-0849-B3C',
    ip: '127.0.0.1 (Local Orchestrator)',
    status: 'SUCCESS',
    details: 'Verification Engine signed SHA-256 certificate with ECDSA P-384.'
  },
  {
    id: 'AUD-9909',
    timestamp: '2026-08-24 08:30:19 UTC',
    user: 'Col. Raymond Chen',
    role: 'LEAD_OFFICER',
    action: 'GENOME_REGISTERED',
    resource: 'Genome SQLi-v1 (CWE-89)',
    ip: '10.240.1.14',
    status: 'SUCCESS',
    details: 'Updated cross-language AST pattern matching rules.'
  },
  {
    id: 'AUD-9908',
    timestamp: '2026-08-23 22:11:45 UTC',
    user: 'Maj. Sarah Vance',
    role: 'ANALYST',
    action: 'AIR_GAP_MODE_ENABLED',
    resource: 'System Core Configuration',
    ip: '10.240.12.88',
    status: 'SUCCESS',
    details: 'Isolated network ingress for classified DoD telemetry processing.'
  }
];

export const SAMPLE_CODE_SNIPPETS = {
  java: {
    filename: 'UserSearchService.java',
    code: `package mil.defense.auth.service;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

public class UserSearchService {
    private final Connection connection;

    public UserSearchService(Connection connection) {
        this.connection = connection;
    }

    public ResultSet searchUser(String userId, String tenantId) throws Exception {
        Statement statement = connection.createStatement();
        // VULNERABLE: Direct string concatenation of untrusted userId
        String query = "SELECT id, clearance, role, token FROM users WHERE user_id = '" 
                        + userId + "' AND tenant_id = '" + tenantId + "'";
        return statement.executeQuery(query);
    }
}`
  },
  python: {
    filename: 'network_probe.py',
    code: `import os
import subprocess

def run_network_diagnostic(target_host: str, packet_count: int = 4):
    """Executes network ping test against targeted node."""
    # VULNERABLE: Direct f-string interpolation into shell command
    command = f"ping -c {packet_count} {target_host}"
    print(f"[PROBE] Executing command: {command}")
    return os.system(command)`
  },
  cpp: {
    filename: 'packet_parser.cpp',
    code: `#include <cstring>
#include <iostream>

void parse_packet_header(const char* raw_payload, size_t payload_len) {
    char header_buffer[64];
    // VULNERABLE: strcpy doesn't check payload_len against header_buffer size
    strcpy(header_buffer, raw_payload);
    std::cout << "Parsed header: " << header_buffer << std::endl;
}`
  },
  javascript: {
    filename: 'keys.js',
    code: `// Military Drone Relay Gateway Key
export const RELAY_MASTER_KEY = "MIL-ENC-9948-AF81-BBA2-89912093848123984";
export const VAULT_FALLBACK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.s6K";`
  }
};
