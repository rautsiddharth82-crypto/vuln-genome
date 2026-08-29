import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  GitBranch, 
  FileCode, 
  Trash2, 
  Play, 
  Lock, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Terminal, 
  Layers,
  ArrowRight,
  FolderOpen
} from 'lucide-react';
import { ScanPipelineProgress, PipelineStage } from '../components/scan/ScanPipelineProgress';
import { TerminalConsole } from '../components/scan/TerminalConsole';
import { scanService } from '../services/scanService';
import { ScanJob } from '../types';
import { SAMPLE_CODE_SNIPPETS } from '../data/mockData';
import { useToast } from '../context/ToastContext';
import { useSystem } from '../context/SystemContext';

interface UploadedFileItem {
  name: string;
  size: number;
  content: string;
  language: string;
}

interface ScanCodePageProps {
  onNavigate: (route: string) => void;
}

export const ScanCodePage: React.FC<ScanCodePageProps> = ({ onNavigate }) => {
  const { success, error, info } = useToast();
  const { airGappedMode } = useSystem();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab: 'upload' | 'git'
  const [scanMethod, setScanMethod] = useState<'upload' | 'git'>('upload');
  const [files, setFiles] = useState<UploadedFileItem[]>([
    {
      name: 'UserSearchService.java',
      size: 784,
      content: SAMPLE_CODE_SNIPPETS.java.code,
      language: 'java',
    },
    {
      name: 'network_probe.py',
      size: 342,
      content: SAMPLE_CODE_SNIPPETS.python.code,
      language: 'python',
    }
  ]);

  // Git Form
  const [repoUrl, setRepoUrl] = useState('https://github.com/us-cyber-command/tactical-comms-gateway');
  const [branch, setBranch] = useState('main');

  // Scan Options
  const [options, setOptions] = useState({
    staticAnalysis: true,
    fuzzing: true,
    dynamicAnalysis: true,
    regressionTesting: true,
    generateProofCertificate: true,
    airGappedMode: airGappedMode,
  });

  // Active Scanning State
  const [isScanning, setIsScanning] = useState(false);
  const [activeScan, setActiveScan] = useState<ScanJob | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const uploaded: File[] = Array.from(e.target.files);
    
    uploaded.forEach((file: File) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'txt';
      const langMap: Record<string, string> = {
        py: 'python',
        java: 'java',
        cpp: 'cpp',
        cc: 'cpp',
        js: 'javascript',
        ts: 'javascript',
        go: 'go',
        rs: 'rust',
      };

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setFiles((prev) => [
          ...prev.filter((f) => f.name !== file.name),
          {
            name: file.name,
            size: file.size,
            content: content || '// Source Unit Content',
            language: langMap[ext] || 'text',
          },
        ]);
      };
      reader.readAsText(file);
    });

    success('Files Loaded', `Added ${uploaded.length} source file(s) to scan manifest.`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.dataTransfer.files) return;
    const dropped: File[] = Array.from(e.dataTransfer.files);
    
    dropped.forEach((file: File) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'txt';
      const langMap: Record<string, string> = {
        py: 'python',
        java: 'java',
        cpp: 'cpp',
        js: 'javascript',
      };
      const reader = new FileReader();
      reader.onload = (event) => {
        setFiles((prev) => [
          ...prev.filter((f) => f.name !== file.name),
          {
            name: file.name,
            size: file.size,
            content: (event.target?.result as string) || '// Content',
            language: langMap[ext] || 'text',
          },
        ]);
      };
      reader.readAsText(file);
    });
  };

  const loadPreset = (key: 'java' | 'python' | 'cpp' | 'javascript') => {
    const sample = SAMPLE_CODE_SNIPPETS[key];
    setFiles((prev) => [
      ...prev.filter((f) => f.name !== sample.filename),
      {
        name: sample.filename,
        size: sample.code.length,
        content: sample.code,
        language: key,
      },
    ]);
    info('Sample Ingested', `Loaded ${sample.filename}`);
  };

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const handleStartScan = async () => {
    if (scanMethod === 'upload' && files.length === 0) {
      error('No Code Selected', 'Please upload or select at least one source file.');
      return;
    }
    if (scanMethod === 'git' && (!repoUrl || typeof repoUrl !== 'string' || !repoUrl.trim())) {
      error('Invalid Repository', 'Please provide a valid Git repository URL.');
      return;
    }

    setIsScanning(true);
    try {
      // 1. Send start scan request to API
      const scanJob = await scanService.startScan({
        files: scanMethod === 'upload' ? files : undefined,
        repositoryUrl: scanMethod === 'git' ? repoUrl : undefined,
        branch: scanMethod === 'git' ? branch : undefined,
        options,
      });

      setActiveScan(scanJob);

      // 2. Step progress through real pipeline stages
      const finishedScan = await scanService.stepScanProgress(scanJob.id, (progressUpdate) => {
        setActiveScan({ ...progressUpdate });
      });

      success('Scan Completed', `Discovered ${finishedScan.vulnerabilitiesFound} vulnerabilities.`);
      setTimeout(() => {
        onNavigate(`scans/${finishedScan.id}`);
      }, 1500);
    } catch (err: any) {
      error('Scan Failed', err.message || 'Error occurred during AST pipeline execution.');
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#B88A52]">
          <Cpu className="w-3.5 h-3.5 text-[#B88A52]" />
          Autonomous Security Scanner
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold font-display text-[#24150F] tracking-tight mt-0.5">
          Scan Your Code
        </h1>
        <p className="text-xs text-[#5A3825] mt-1">
          Detect, confirm, and synthesize proof-backed patches for vulnerabilities before attackers do.
        </p>
      </div>

      {/* Active Scanning Terminal View */}
      {isScanning && activeScan ? (
        <div className="space-y-6 animate-fade-in">
          <ScanPipelineProgress
            currentStage={activeScan.currentStage}
            progress={activeScan.progress}
            filesScanned={activeScan.filesCount}
            linesAnalyzed={activeScan.linesAnalyzed}
            genomesMatched={activeScan.vulnerabilitiesFound}
            testsExecuted={activeScan.progress > 60 ? 48 : 12}
          />

          <TerminalConsole
            logs={activeScan.terminalLogs}
            title={`Autonomous Telemetry Stream [${activeScan.id}]`}
          />
        </div>
      ) : (
        /* Configuration & Upload Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Code Ingestion Source */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl glass-frame space-y-5">
              {/* Method Switcher */}
              <div className="flex items-center justify-between border-b border-[#DCC7AE]/60 pb-4">
                <div className="flex items-center gap-2 p-1 rounded-xl glass-pill">
                  <button
                    onClick={() => setScanMethod('upload')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      scanMethod === 'upload'
                        ? 'bg-[#3B2418] text-[#FFF9F0] shadow-xs'
                        : 'text-[#5A3825] hover:text-[#24150F]'
                    }`}
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload Source Files</span>
                  </button>
                  <button
                    onClick={() => setScanMethod('git')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      scanMethod === 'git'
                        ? 'bg-[#3B2418] text-[#FFF9F0] shadow-xs'
                        : 'text-[#5A3825] hover:text-[#24150F]'
                    }`}
                  >
                    <GitBranch className="w-4 h-4" />
                    <span>Git Repository</span>
                  </button>
                </div>

                <div className="text-[11px] font-mono text-[#5A3825] hidden sm:block">
                  Supported: .py, .java, .cpp, .js, .go, .rs
                </div>
              </div>

              {/* Upload Drag & Drop Area */}
              {scanMethod === 'upload' ? (
                <div className="space-y-4">
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#B88A52]/50 hover:border-[#3B2418] rounded-2xl p-8 text-center bg-white/40 hover:bg-white/70 transition-all cursor-pointer flex flex-col items-center justify-center group shadow-inner"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".py,.java,.cpp,.cc,.js,.ts,.go,.rs,.json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="w-14 h-14 rounded-2xl bg-[#3B2418] text-[#B88A52] flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <div className="text-sm font-bold font-display text-[#24150F]">
                      Drag & Drop code files here or click to browse
                    </div>
                    <p className="text-xs text-[#5A3825] mt-1">
                      Direct AST parsing with isolated memory sandbox
                    </p>
                  </div>

                  {/* Preload Presets */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs font-bold text-[#5A3825] font-mono">Load Vulnerable Samples:</span>
                    <button
                      type="button"
                      onClick={() => loadPreset('java')}
                      className="px-2.5 py-1 rounded-lg glass-pill hover:bg-white text-[#3B2418] text-xs font-mono font-semibold transition-colors shadow-xs"
                    >
                      + Java SQLi
                    </button>
                    <button
                      type="button"
                      onClick={() => loadPreset('python')}
                      className="px-2.5 py-1 rounded-lg glass-pill hover:bg-white text-[#3B2418] text-xs font-mono font-semibold transition-colors shadow-xs"
                    >
                      + Python RCE
                    </button>
                    <button
                      type="button"
                      onClick={() => loadPreset('cpp')}
                      className="px-2.5 py-1 rounded-lg glass-pill hover:bg-white text-[#3B2418] text-xs font-mono font-semibold transition-colors shadow-xs"
                    >
                      + C++ Buffer Overflow
                    </button>
                    <button
                      type="button"
                      onClick={() => loadPreset('javascript')}
                      className="px-2.5 py-1 rounded-lg glass-pill hover:bg-white text-[#3B2418] text-xs font-mono font-semibold transition-colors shadow-xs"
                    >
                      + JS Secret Key
                    </button>
                  </div>

                  {/* Selected Files List */}
                  {files.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-bold font-mono text-[#5A3825] uppercase tracking-wider">
                        Manifest Units ({files.length}):
                      </div>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {files.map((file) => (
                          <div
                            key={file.name}
                            className="p-2.5 rounded-xl glass-pill flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <FileCode className="w-4 h-4 text-[#B88A52]" />
                              <span className="font-mono font-bold text-[#24150F]">{file.name}</span>
                              <span className="px-1.5 py-0.5 rounded-md bg-[#3B2418] text-[#FFF9F0] text-[9px] uppercase font-mono">
                                {file.language}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[11px] text-[#5A3825] font-mono">
                                {(file.size / 1024).toFixed(1)} KB
                              </span>
                              <button
                                onClick={() => removeFile(file.name)}
                                className="text-[#5A3825]/70 hover:text-red-700 p-1"
                                title="Remove file"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Git Method */
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold font-mono text-[#3B2418] uppercase tracking-wider mb-1.5">
                      Repository URL
                    </label>
                    <input
                      type="text"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/org/repo.git"
                      className="w-full px-4 py-2.5 glass-input rounded-xl text-xs font-mono text-[#24150F] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold font-mono text-[#3B2418] uppercase tracking-wider mb-1.5">
                      Target Branch / Tag
                    </label>
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      placeholder="main"
                      className="w-full px-4 py-2.5 glass-input rounded-xl text-xs font-mono text-[#24150F] outline-hidden"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 flex items-start gap-2 shadow-xs">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Air-gapped proxy will clone using ephemeral read-only deployment token.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Scan Options & Launch */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl glass-frame space-y-5">
              <div className="flex items-center justify-between border-b border-[#DCC7AE]/60 pb-3">
                <h3 className="text-sm font-bold font-display text-[#24150F]">
                  Security Analysis Invariants
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-bold">
                  Recommended Configuration
                </span>
              </div>

              <div className="space-y-3">
                {/* Option 1: Static Analysis */}
                <label className="flex items-start gap-3 p-3 rounded-xl glass-pill cursor-pointer hover:bg-white/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={options.staticAnalysis}
                    onChange={(e) => setOptions({ ...options, staticAnalysis: e.target.checked })}
                    className="mt-0.5 rounded border-[#DCC7AE] text-[#3B2418] focus:ring-[#B88A52]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#24150F]">Enable Static Analysis</div>
                    <p className="text-[11px] text-[#5A3825]">AST traversal & cross-procedural taint propagation</p>
                  </div>
                </label>

                {/* Option 2: Fuzzing */}
                <label className="flex items-start gap-3 p-3 rounded-xl glass-pill cursor-pointer hover:bg-white/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={options.fuzzing}
                    onChange={(e) => setOptions({ ...options, fuzzing: e.target.checked })}
                    className="mt-0.5 rounded border-[#DCC7AE] text-[#3B2418] focus:ring-[#B88A52]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#24150F]">Enable Dynamic Fuzzing</div>
                    <p className="text-[11px] text-[#5A3825]">Genetic mutation payloads to confirm unhandled edge sinks</p>
                  </div>
                </label>

                {/* Option 3: Dynamic Analysis */}
                <label className="flex items-start gap-3 p-3 rounded-xl glass-pill cursor-pointer hover:bg-white/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={options.dynamicAnalysis}
                    onChange={(e) => setOptions({ ...options, dynamicAnalysis: e.target.checked })}
                    className="mt-0.5 rounded border-[#DCC7AE] text-[#3B2418] focus:ring-[#B88A52]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#24150F]">Dynamic Analysis Sandbox</div>
                    <p className="text-[11px] text-[#5A3825]">Replay candidate exploits in isolated micro-container</p>
                  </div>
                </label>

                {/* Option 4: Regression Testing */}
                <label className="flex items-start gap-3 p-3 rounded-xl glass-pill cursor-pointer hover:bg-white/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={options.regressionTesting}
                    onChange={(e) => setOptions({ ...options, regressionTesting: e.target.checked })}
                    className="mt-0.5 rounded border-[#DCC7AE] text-[#3B2418] focus:ring-[#B88A52]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#24150F]">Regression Verification</div>
                    <p className="text-[11px] text-[#5A3825]">Guarantee patches maintain functional application invariants</p>
                  </div>
                </label>

                {/* Option 5: Proof Certificate */}
                <label className="flex items-start gap-3 p-3 rounded-xl glass-pill cursor-pointer hover:bg-white/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={options.generateProofCertificate}
                    onChange={(e) => setOptions({ ...options, generateProofCertificate: e.target.checked })}
                    className="mt-0.5 rounded border-[#DCC7AE] text-[#3B2418] focus:ring-[#B88A52]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#24150F]">Issue Proof Certificate</div>
                    <p className="text-[11px] text-[#5A3825]">Generate cryptographic SHA-256 ECDSA defense proof</p>
                  </div>
                </label>

                {/* Option 6: Air-Gapped Mode */}
                <label className="flex items-start gap-3 p-3 rounded-xl glass-pill cursor-pointer hover:bg-white/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={options.airGappedMode}
                    onChange={(e) => setOptions({ ...options, airGappedMode: e.target.checked })}
                    className="mt-0.5 rounded border-[#DCC7AE] text-[#3B2418] focus:ring-[#B88A52]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#24150F]">Air-Gapped Mode</div>
                    <p className="text-[11px] text-[#5A3825]">Strict offline execution without external telemetry egress</p>
                  </div>
                </label>
              </div>

              {/* Start Scan Button */}
              <button
                type="button"
                onClick={handleStartScan}
                className="w-full py-4 rounded-xl bg-[#3B2418] hover:bg-[#5A3825] text-[#FFF9F0] text-sm font-bold font-mono uppercase tracking-widest transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 cursor-pointer mt-4"
              >
                <Play className="w-5 h-5 text-[#B88A52] fill-[#B88A52]" />
                <span>START SECURITY SCAN</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
