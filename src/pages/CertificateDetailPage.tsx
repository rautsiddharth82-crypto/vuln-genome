import React, { useState, useEffect } from 'react';
import { ChevronLeft, Award, ShieldCheck, RefreshCw } from 'lucide-react';
import { CertificateCard } from '../components/certificate/CertificateCard';
import { ProofCertificate } from '../types';
import { certificateService } from '../services/certificateService';

interface CertificateDetailPageProps {
  certificateId: string;
  onNavigate: (route: string) => void;
}

export const CertificateDetailPage: React.FC<CertificateDetailPageProps> = ({
  certificateId,
  onNavigate,
}) => {
  const [cert, setCert] = useState<ProofCertificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await certificateService.getCertificateById(certificateId);
        setCert(data);
      } catch (err) {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [certificateId]);

  if (loading || !cert) {
    return (
      <div className="text-center py-20 font-mono text-xs text-[#5A3825]">
        Loading cryptographic proof certificate...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={() => onNavigate('certificates')}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#5A3825] hover:text-[#24150F] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Certificates Registry</span>
        </button>

        <div className="text-xs font-mono text-emerald-700 font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Non-Repudiation Proof</span>
        </div>
      </div>

      {/* Render Certificate Card Component */}
      <CertificateCard certificate={cert} />
    </div>
  );
};
