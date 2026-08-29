import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Dna, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Radio,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('analyst.vanguard');
  const [password, setPassword] = useState('defense-clearance-2026');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await login({ username, password });
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials or security token.');
    }
  };

  const handleSSOLogin = async () => {
    setErrorMsg(null);
    try {
      await login({ username: 'maj.vance.sso', ssoProvider: 'ARMY_SSO' });
    } catch (err: any) {
      setErrorMsg(err.message || 'SSO Authentication failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EBDD] flex flex-col md:flex-row text-[#3B2418]">
      {/* Left Branding Side */}
      <div className="md:w-1/2 bg-[#3B2418] text-[#FFF9F0] p-8 md:p-16 flex flex-col justify-between relative overflow-hidden border-r border-[#5A3825]">
        {/* Background Subtle Watermark */}
        <div className="absolute -right-20 -bottom-20 opacity-5 pointer-events-none">
          <Dna className="w-[500px] h-[500px]" />
        </div>

        {/* Brand Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#B88A52] text-[#24150F] flex items-center justify-center shadow-lg font-black font-display text-xl">
              <Dna className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl font-black font-display tracking-wider text-[#FFF9F0]">
                VULN-GENOME
              </div>
              <div className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#B88A52] font-semibold">
                Autonomous Vulnerability Intelligence
              </div>
            </div>
          </div>

          <div className="space-y-4 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B88A52]/20 border border-[#B88A52]/40 text-[#B88A52] text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-[#B88A52] animate-pulse" />
              DoD / NATO Cyber Defense Framework
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold font-display text-[#FFFDF9] tracking-tight leading-tight">
              One Vulnerability. <br />
              One Genome. <br />
              <span className="text-[#B88A52]">No Repeat Exploits.</span>
            </h1>

            <p className="text-sm text-[#DCC7AE] leading-relaxed pt-2">
              Autonomous AI vulnerability detection, zero-shot AST patch generation, multi-vector formal verification, and cross-language invariant genome memory.
            </p>
          </div>
        </div>

        {/* Pipeline Steps Indicator */}
        <div className="relative z-10 my-8 py-6 border-y border-[#5A3825]">
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#B88A52] font-bold mb-3">
            Autonomous Pipeline Paradigm:
          </div>
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] font-bold">
            {['LEARN', 'EXTRACT', 'SCAN', 'CONFIRM', 'PATCH', 'PROVE', 'REMEMBER'].map((stg, i) => (
              <div key={stg} className="p-2 rounded-lg bg-[#24150F] border border-[#5A3825]/60 text-[#DCC7AE]">
                <div className="text-[#B88A52] text-[9px] mb-0.5">0{i+1}</div>
                <div>{stg}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Assurance Badges */}
        <div className="relative z-10 space-y-2 text-xs font-mono text-[#DCC7AE]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Protected by JWT & Cryptographic ECDSA P-384 Signatures</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Air-Gapped Classified Deployment Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Multi-Role Access Control (Analyst / Lead / DevSecOps)</span>
          </div>
        </div>
      </div>

      {/* Right Login Card Side */}
      <div className="md:w-1/2 p-8 md:p-16 flex items-center justify-center relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-[#B88A52]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-[#DCC7AE]/25 rounded-full blur-3xl" />
          <div className="absolute inset-0 glass-ambient-grid opacity-60" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass-frame rounded-3xl p-8 shadow-2xl relative z-10"
        >
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-[#B88A52] text-[10px] font-mono font-bold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B88A52] animate-pulse" />
              AUTHENTICATION PORTAL
            </div>
            <h2 className="text-2xl font-bold font-display text-[#24150F]">
              Operator Authentication
            </h2>
            <p className="text-xs text-[#5A3825] mt-1">
              Authenticate with your secure credentials to enter the command console.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-red-50/90 border border-red-300 text-xs text-red-800 font-semibold shadow-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold font-mono text-[#3B2418] uppercase tracking-wider mb-1.5">
                Username / Security Handle
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="analyst.vanguard"
                  className="w-full px-4 py-2.5 glass-input rounded-xl text-xs font-mono text-[#24150F] outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold font-mono text-[#3B2418] uppercase tracking-wider mb-1.5">
                Passphrase / Token
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full px-4 py-2.5 glass-input rounded-xl text-xs font-mono text-[#24150F] outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#3B2418] hover:bg-[#5A3825] text-[#FFF9F0] text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Validating Clearance...</span>
              ) : (
                <>
                  <span>Sign In to Terminal</span>
                  <ArrowRight className="w-4 h-4 text-[#B88A52]" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#DCC7AE]/70" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[#FFFDF9]/90 rounded-md text-[#5A3825] font-mono text-[10px] font-bold">
                OR ENTERPRISE FEDERATION
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSSOLogin}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl glass-pill hover:bg-white text-[#3B2418] text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <UserCheck className="w-4 h-4 text-[#B88A52]" />
            <span>Sign in with Army SSO / CAC Card</span>
          </button>

          <div className="mt-6 pt-4 border-t border-[#DCC7AE]/50 text-center">
            <div className="text-[10px] text-[#5A3825] font-mono">
              Demo Clearance Available: <span className="font-bold text-[#3B2418]">analyst.vanguard</span> / <span className="font-bold text-[#3B2418]">defense-clearance-2026</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
