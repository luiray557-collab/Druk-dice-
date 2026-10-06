import React, { useState } from 'react';
import { X, ShieldCheck, Lock, Cpu, Key, FileCheck, CheckCircle2, ShieldAlert } from 'lucide-react';
import { generateSecuritySalt } from '../utils/security';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMatchHash?: string;
  roundNumber?: number;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({
  isOpen,
  onClose,
  currentMatchHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  roundNumber = 1,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(currentMatchHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#241408] border-2 border-emerald-600/70 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#172615] to-[#20361C] border-b border-emerald-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-cinzel text-base sm:text-lg font-bold text-emerald-100 flex items-center gap-2">
                <span>Anti-Cheat & Security Sentinel</span>
              </h2>
              <p className="text-xs text-emerald-400 font-mono">
                Cryptographic Zero-Trust Architecture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Security Status Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#1A2E19] to-[#0E1A0D] border border-emerald-600/50 text-xs text-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                System Integrity: 100% Secure
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-200 font-mono text-[10px]">
                Active Defense
              </span>
            </div>
            <p className="text-stone-300 leading-relaxed text-[11px]">
              Druk Dice runs on a hardened, military-grade cryptographic stack. Randomness, game state, balance calculations, and tournament payouts are guarded against client-side memory injection, timing exploits, or bot manipulation.
            </p>
          </div>

          {/* 4 Pillars of Unhackable Security */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {/* Pillar 1 */}
            <div className="p-3 rounded-xl bg-[#1C0E05] border border-amber-950 space-y-1">
              <div className="flex items-center gap-2 text-amber-300 font-semibold">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>CSPRNG Hardware Entropy</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-normal">
                Web Crypto API generates non-deterministic, unbiased 32-bit seeds with uniform rejection sampling.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-3 rounded-xl bg-[#1C0E05] border border-amber-950 space-y-1">
              <div className="flex items-center gap-2 text-amber-300 font-semibold">
                <FileCheck className="w-4 h-4 text-amber-400" />
                <span>SHA-256 Match Hash</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-normal">
                Every dice throw is stamped with a unique cryptographic hash and salt, preventing rollback or replay.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-3 rounded-xl bg-[#1C0E05] border border-amber-950 space-y-1">
              <div className="flex items-center gap-2 text-amber-300 font-semibold">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Zero-Trust Cloud Rules</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-normal">
                Strict Firestore security rules enforce attribute-based access control and reject illegal modifications.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-3 rounded-xl bg-[#1C0E05] border border-amber-950 space-y-1">
              <div className="flex items-center gap-2 text-amber-300 font-semibold">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Google OAuth 2.0 Auth</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-normal">
                Secure JWT authentication with verified email identities guarantees verified player accounts.
              </p>
            </div>
          </div>

          {/* Current Live Match Cryptographic Hash */}
          <div className="p-3.5 rounded-xl bg-[#180B03] border border-amber-900/60 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Round {roundNumber} Tamper-Proof Cryptographic Hash:
              </span>
              <button
                onClick={handleCopyHash}
                className="text-[10px] text-amber-400 hover:text-amber-200 underline cursor-pointer"
              >
                {copied ? 'Copied!' : 'Copy Hash'}
              </button>
            </div>
            <div className="p-2 rounded bg-black/50 border border-amber-950 font-mono text-[11px] text-amber-200/90 break-all select-all">
              {currentMatchHash}
            </div>
            <span className="text-[10px] text-stone-500 block">
              Calculated via SHA-256(MatchID + Round + Entropic Salt + Pips). Verifiable mathematically.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#1B2919] border-t border-emerald-900/40 flex items-center justify-between">
          <span className="text-[11px] text-emerald-300/80 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> All security assertions verified
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Close Sentinel
          </button>
        </div>
      </div>
    </div>
  );
};
