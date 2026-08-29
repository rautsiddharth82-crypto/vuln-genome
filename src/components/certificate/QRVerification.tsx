import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';

interface QRVerificationProps {
  value: string;
  hash: string;
  size?: number;
  className?: string;
}

export const QRVerification: React.FC<QRVerificationProps> = ({
  value,
  hash,
  size = 140,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`p-5 rounded-2xl bg-[#FFFDF9] border border-[#DCC7AE] shadow-sm flex flex-col items-center text-center ${className}`}>
      <div className="p-3 bg-white rounded-xl border border-[#DCC7AE]/80 shadow-inner mb-3">
        <QRCodeSVG
          value={value}
          size={size}
          bgColor="#FFFFFF"
          fgColor="#24150F"
          level="H"
          includeMargin={false}
        />
      </div>

      <div className="flex items-center gap-1.5 text-xs font-bold text-[#24150F] font-mono">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        Cryptographic Proof Hash
      </div>

      <div className="mt-2 w-full">
        <div className="p-2 rounded-lg bg-[#F5EBDD]/60 border border-[#DCC7AE]/70 font-mono text-[10px] text-[#3B2418] break-all select-all">
          {hash}
        </div>
      </div>

      <button
        onClick={handleCopyHash}
        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3B2418] hover:bg-[#5A3825] text-[#FFF9F0] text-xs font-semibold transition-colors shadow-xs"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300">Hash Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-[#B88A52]" />
            <span>Copy SHA-256 Hash</span>
          </>
        )}
      </button>
    </div>
  );
};
