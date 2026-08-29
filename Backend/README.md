# VULN-GENOME MERN Backend

An autonomous cyber defense and vulnerability analysis backend built using the **MERN** stack (Node.js, Express.js, MongoDB with Mongoose, and TypeScript).

---

## Features

- **File & Code Uploading**: Multipart/form-data upload using `multer`, multi-file source code package ingestion, repository URL and branch submission, and automatic language detection.
- **AST & Taint Analysis**: Static invariant pattern extraction for SQL Injection (CWE-89), OS Command Injection (CWE-78), Buffer Overflow (CWE-120), Server-Side Request Forgery (CWE-918), Hardcoded Secrets (CWE-798), and AI-augmented reasoning.
- **Autonomous Patch Synthesis**: Zero-regression contextual diff generation with parameterization, boundary guards, and style-matching metrics.
- **7-Stage Formal Verification Pipeline**: Exploit replay simulation, regression test assertion suite (48/48 checks), adversarial genetic mutation fuzzer (1,000 edge mutations), memory leak checks (Valgrind profiler), and performance latency delta measurement.
- **Cryptographic Proof of Fix**: Generates tamper-proof SHA-256 and Ed25519 digitally signed verification certificates with verifiable QR payloads.
- **AI Swarm Orchestration**: Integration with LLM APIs (Groq / Grok / Gemini / OpenAI) with deterministic fallback for multi-agent autonomous commands and sub-agent technical reasoning.

---

## Project Structure

```
Backend/
├── package.json
├── tsconfig.json
├── .env.example
├── .env
├── README.md
└── src/
    ├── server.ts
    ├── config/
    │   └── db.ts
    ├── models/
    │   ├── Scan.ts
    │   ├── Vulnerability.ts
    │   ├── Patch.ts
    │   ├── Verification.ts
    │   ├── Certificate.ts
    │   ├── Genome.ts
    │   └── AuditLog.ts
    ├── controllers/
    │   ├── uploadController.ts
    │   ├── scanController.ts
    │   ├── patchController.ts
    │   ├── verifyController.ts
    │   ├── vulnerabilityController.ts
    │   ├── certificateController.ts
    │   ├── genomeController.ts
    │   ├── aiController.ts
    │   └── statsController.ts
    ├── routes/
    │   ├── uploadRoutes.ts
    │   ├── scanRoutes.ts
    │   ├── patchRoutes.ts
    │   ├── vulnerabilityRoutes.ts
    │   ├── certificateRoutes.ts
    │   ├── genomeRoutes.ts
    │   ├── aiRoutes.ts
    │   └── statsRoutes.ts
    ├── services/
    │   ├── astAnalyzerService.ts
    │   ├── patchSynthesizerService.ts
    │   ├── verificationEngineService.ts
    │   ├── certificateService.ts
    │   └── aiService.ts
    ├── middlewares/
    │   ├── uploadMiddleware.ts
    │   └── errorHandler.ts
    └── seeds/
        └── seedDb.ts
```

---

## Quick Start

### 1. Install Dependencies
```bash
cd Backend
npm install
```

### 2. Configure Environment (.env)
```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/vuln_genome
CORS_ORIGIN=*

# Optional: Add LLM API Keys
GROQ_API_KEY=
GROK_API_KEY=
```

### 3. (Optional) Seed Sample Database
```bash
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```

---

## API Endpoints Reference

### 1. Uploading
- `POST /api/v1/upload` - Upload multiple source code files (multipart `files`)
- `POST /api/v1/upload/single` - Upload a single source file (multipart `file`)

### 2. Scanning & Analyzing
- `POST /api/v1/scan` - Start AST vulnerability scan on files or repository
- `GET /api/v1/scans` - List all scan jobs
- `GET /api/v1/scans/:id` or `GET /api/v1/results/:id` - Fetch scan results with AST findings & terminal logs

### 3. Patch Synthesis & Application
- `POST /api/v1/patch/:vulnId` - Synthesize zero-regression patch and unified diff
- `GET /api/v1/patch/:vulnId` - Retrieve synthesized patch details
- `POST /api/v1/patch/:vulnId/apply` - Mark patch as applied and update vulnerability status to `FIXED`

### 4. Verification & Proof of Fix
- `POST /api/v1/patch/:vulnId/verify` or `POST /api/v1/verify/:vulnId` - Run 7-phase formal & fuzzing verification suite
- `GET /api/v1/verify/:vulnId` - Fetch verification report

### 5. Vulnerabilities & Knowledge Base
- `GET /api/v1/vulnerabilities` - Query detected vulnerabilities (filter by severity, status, search)
- `GET /api/v1/vulnerabilities/:id` - Vulnerability detail
- `GET /api/v1/certificates` - List cryptographic proof certificates
- `GET /api/v1/certificates/:id` - Proof certificate detail
- `GET /api/v1/genomes` - Vulnerability Genome knowledge base
- `GET /api/v1/stats` - Overall security statistics & metrics

### 6. AI Agent Swarm
- `POST /api/v1/ai/agent-command` - Natural language command execution across 6 specialized cyber agents
- `POST /api/v1/ai/agent-reasoning` - Deep technical reasoning query
