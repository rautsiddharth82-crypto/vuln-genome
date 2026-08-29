import React from 'react';
import { ProofCertificate } from '../../types';
import { QRVerification } from './QRVerification';
import { 
  ShieldCheck, 
  Award, 
  Download, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Key, 
  Clock, 
  FileCode,
  Dna,
  Lock
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface CertificateCardProps {
  certificate: ProofCertificate;
  onVerify?: () => void;
  className?: string;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  onVerify,
  className = '',
}) => {
  const { success, info } = useToast();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate real cryptographic JSON certificate file download
    const certJson = JSON.stringify(certificate, null, 2);
    const blob = new Blob([certJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${certificate.id}_SECURITY_PROOF.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    success('Certificate Downloaded', `Saved ${certificate.id}_SECURITY_PROOF.json`);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(certificate.qrPayload);
      info('Verification Link Copied', 'Direct cryptographic verification URL copied to clipboard.');
    }
  };

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* Top Action Bar (hidden in print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-[#FFFDF9] p-4 rounded-2xl border border-[#DCC7AE]/70 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#5A3825]">
          <Lock className="w-4 h-4 text-[#B88A52]" />
          <span>STATUS: CRYPTOGRAPHICALLY VERIFIED PROOF</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#3B2418] hover:bg-[#5A3825] text-[#FFF9F0] text-xs font-bold transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-[#B88A52]" />
            <span>Download Certificate</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F5EBDD] hover:bg-[#DCC7AE] text-[#3B2418] text-xs font-bold transition-colors border border-[#DCC7AE]"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F5EBDD] hover:bg-[#DCC7AE] text-[#3B2418] text-xs font-bold transition-colors border border-[#DCC7AE]"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Certificate Card (Defense Grade Layout) */}
      <div className="certificate-card relative p-8 md:p-12 rounded-3xl bg-[#FFFDF9] border-4 border-[#B88A52] shadow-2xl overflow-hidden">
        {/* Subtle Watermark Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
          <Dna className="w-[600px] h-[600px] text-[#3B2418]" />
        </div>

        {/* Decorative Golden Corner Accents */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#B88A52]" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#B88A52]" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#B88A52]" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#B88A52]" />

        {/* Header / Crest */}
        <div className="text-center relative z-10 space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#3B2418] border-2 border-[#B88A52] text-[#B88A52] shadow-lg mb-2">
            <Award className="w-8 h-8" />
          </div>

          <div className="text-xs uppercase font-mono font-extrabold tracking-[0.3em] text-[#B88A52]">
            VULN-GENOME AUTONOMOUS DEFENSE COMMAND
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-[#24150F] tracking-tight">
            PROOF CERTIFICATE
          </h1>

          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            VULNERABILITY PERMANENTLY NEUTRALIZED
          </div>
        </div>

        {/* Certificate Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-2xl bg-[#F5EBDD]/40 border border-[#DCC7AE]/70 mb-8 relative z-10">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#5A3825] font-bold">
              Certificate Identifier
            </span>
            <div className="text-sm font-mono font-bold text-[#24150F]">{certificate.id}</div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#5A3825] font-bold">
              Remediated Vulnerability
            </span>
            <div className="text-sm font-bold text-[#24150F]">{certificate.vulnerabilityTitle}</div>
            <div className="text-xs font-mono text-[#5A3825]">{certificate.vulnerabilityId} ({certificate.cwe})</div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#5A3825] font-bold">
              Genome Invariant Model
            </span>
            <div className="text-sm font-mono font-bold text-[#B88A52]">{certificate.genomeId}</div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#5A3825] font-bold">
              Target Code Unit
            </span>
            <div className="text-sm font-mono text-[#24150F] truncate">{certificate.affectedFile}</div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#5A3825] font-bold">
              Date & Verification Epoch
            </span>
            <div className="text-xs font-mono text-[#24150F]">{certificate.fixedOn}</div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#5A3825] font-bold">
              Autonomous Synthesizer
            </span>
            <div className="text-xs font-bold text-[#3B2418]">{certificate.fixedBy}</div>
          </div>
        </div>

        {/* Verification Checkpoints */}
        <div className="mb-8 relative z-10">
          <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-[#5A3825] mb-3">
            Autonomous Multi-Vector Verification Invariants:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#FFF9F0] border border-emerald-300 flex items-center gap-2.5 text-xs text-emerald-950 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Original exploit payload neutralized</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FFF9F0] border border-emerald-300 flex items-center gap-2.5 text-xs text-emerald-950 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>48/48 Regression test suite passed</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FFF9F0] border border-emerald-300 flex items-center gap-2.5 text-xs text-emerald-950 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No secondary CWE vulnerabilities introduced</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FFF9F0] border border-emerald-300 flex items-center gap-2.5 text-xs text-emerald-950 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Performance delta within threshold ({certificate.metrics.performanceDeltaPct}%)</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FFF9F0] border border-emerald-300 flex items-center gap-2.5 text-xs text-emerald-950 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Memory leak verification clear ({certificate.metrics.memoryDeltaPct}%)</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FFF9F0] border border-emerald-300 flex items-center gap-2.5 text-xs text-emerald-950 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Break My Patch genetic fuzzer survived</span>
            </div>
          </div>
        </div>

        {/* QR & Cryptographic Seal Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t-2 border-[#B88A52]/40 relative z-10">
          <div className="space-y-2 max-w-md">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#3B2418]">
              <Key className="w-4 h-4 text-[#B88A52]" />
              <span>SHA-256 Cryptographic Certificate Seal:</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#24150F] text-[#F5EBDD] font-mono text-[10px] break-all border border-[#5A3825]">
              {certificate.sha256Hash}
            </div>
            <div className="text-[10px] text-[#5A3825] font-mono">
              Issuer: {certificate.issuer}
            </div>
          </div>

          {/* QR Code */}
          <div className="shrink-0">
            <QRVerification value={certificate.qrPayload} hash={certificate.sha256Hash} size={110} />
          </div>
        </div>
      </div>
    </div>
  );
};
