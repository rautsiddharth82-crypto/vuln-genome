import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Search, 
  Download, 
  Eye, 
  ShieldCheck, 
  Key, 
  FileCode, 
  CheckCircle2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { ProofCertificate } from '../types';
import { certificateService } from '../services/certificateService';
import { useToast } from '../context/ToastContext';

interface CertificatesPageProps {
  onNavigate: (route: string) => void;
}

export const CertificatesPage: React.FC<CertificatesPageProps> = ({ onNavigate }) => {
  const [certs, setCerts] = useState<ProofCertificate[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { success } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await certificateService.getCertificates();
        setCerts(data);
      } catch (err) {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = certs.filter((c) => {
    return (
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.vulnerabilityTitle.toLowerCase().includes(search.toLowerCase()) ||
      c.genomeId.toLowerCase().includes(search.toLowerCase()) ||
      c.affectedFile.toLowerCase().includes(search.toLowerCase()) ||
      c.sha256Hash.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleDownload = (cert: ProofCertificate, e: React.MouseEvent) => {
    e.stopPropagation();
    const certJson = JSON.stringify(cert, null, 2);
    const blob = new Blob([certJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cert.id}_SECURITY_PROOF.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    success('Certificate Saved', `Saved ${cert.id}_SECURITY_PROOF.json`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#B88A52]">
            <Award className="w-4 h-4 text-[#B88A52]" />
            Cryptographic Defense Registry
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-[#24150F] tracking-tight mt-0.5">
            Proof Certificates
          </h1>
          <p className="text-xs text-[#5A3825] mt-1">
            Formal mathematical and regression defense proofs signed with SHA-256 hashes and QR verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Defense Verification Invariant</span>
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#DCC7AE]/70 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A3825]/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search certificate ID, vulnerability, SHA hash..."
            className="w-full pl-9 pr-4 py-2 bg-[#F5EBDD]/50 border border-[#DCC7AE] rounded-xl text-xs font-mono text-[#24150F] outline-hidden focus:bg-white focus:border-[#B88A52]"
          />
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((cert) => (
          <div
            key={cert.id}
            onClick={() => onNavigate(`certificates/${cert.id}`)}
            className="p-6 rounded-3xl bg-[#FFFDF9] border-2 border-[#DCC7AE]/80 hover:border-[#B88A52] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#3B2418] text-[#B88A52] flex items-center justify-center font-bold shadow-md">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-sm font-bold text-[#24150F] group-hover:text-[#B88A52] transition-colors">
                      {cert.id}
                    </span>
                    <span className="text-[10px] text-emerald-700 block font-mono font-bold">
                      ✓ FIXED & CERTIFIED
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => handleDownload(cert, e)}
                  className="p-2 rounded-xl bg-[#F5EBDD] hover:bg-[#DCC7AE] text-[#3B2418] border border-[#DCC7AE] transition-colors"
                  title="Download JSON Proof"
                >
                  <Download className="w-4 h-4 text-[#B88A52]" />
                </button>
              </div>

              <h3 className="text-base font-bold font-display text-[#24150F]">
                {cert.vulnerabilityTitle}
              </h3>
              <div className="text-xs font-mono text-[#5A3825] mt-1 truncate">
                File: {cert.affectedFile}
              </div>

              <div className="mt-4 p-3 rounded-xl bg-[#24150F] text-[#F5EBDD] font-mono text-[10px] border border-[#5A3825]/50 break-all">
                <div className="text-[9px] text-[#B88A52] uppercase font-bold mb-0.5 flex items-center gap-1">
                  <Key className="w-3 h-3" />
                  SHA-256 Defense Proof Hash:
                </div>
                {cert.sha256Hash}
              </div>
            </div>

            <div className="pt-3 border-t border-[#DCC7AE]/50 flex items-center justify-between text-xs font-mono text-[#5A3825]">
              <div>Fixed: {cert.fixedOn}</div>
              <div className="flex items-center gap-1 text-[#3B2418] font-bold group-hover:text-[#B88A52]">
                <span>Inspect Proof</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
