import React from 'react';
import { X, Building2, Coins, ArrowDownRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { HOUSE_COMMISSION_ACCOUNT } from '../data/bhutanBanks';

export interface CommissionEntry {
  id: string;
  matchId: string;
  totalPot: number;
  commissionAmount: number;
  winnerName: string;
  timestamp: string;
}

interface HouseCommissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  commissionTotal: number;
  commissionLog: CommissionEntry[];
}

export const HouseCommissionModal: React.FC<HouseCommissionModalProps> = ({
  isOpen,
  onClose,
  commissionTotal,
  commissionLog,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#241408] border border-amber-600/70 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#2C180B] to-[#3B1E0C] border-b border-amber-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-base sm:text-lg font-bold text-amber-100 flex items-center gap-2">
                <span>Organizer House Commission</span>
              </h2>
              <p className="text-xs text-amber-400 font-mono">
                BOB Acc No. {HOUSE_COMMISSION_ACCOUNT.accountNumber}
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
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Main Account Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#3D210D] to-[#251307] border-2 border-amber-600/60 shadow-xl relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold block mb-1">
                  Beneficiary Account (5% Match Commission)
                </span>
                <span className="text-sm font-bold text-white block">
                  {HOUSE_COMMISSION_ACCOUNT.bankName}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-mono font-black text-amber-200 tracking-wider">
                    {HOUSE_COMMISSION_ACCOUNT.accountNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                    mBOB
                  </span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-amber-800/50 flex items-end justify-between">
              <div>
                <span className="text-[11px] text-amber-400/80 block">
                  Cumulative Commission Revenue
                </span>
                <span className="text-3xl font-extrabold text-amber-300 font-cinzel tabular-nums">
                  Nu. {commissionTotal.toLocaleString()}
                </span>
              </div>
              <div className="text-right text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Auto-Credited
              </div>
            </div>
          </div>

          {/* Explanation Info */}
          <div className="p-3.5 rounded-xl bg-[#1C0E05] border border-amber-950 text-xs text-stone-300 space-y-1.5 leading-relaxed">
            <p className="font-semibold text-amber-200">
              📌 Automated Commission Rule:
            </p>
            <p className="text-stone-300/90">
              In accordance with tournament regulations, every completed 5-round match allocates <strong>5% of the total pot</strong> directly into this Bank of Bhutan account (<strong>BOB Acc No. {HOUSE_COMMISSION_ACCOUNT.accountNumber}</strong>).
            </p>
            <p className="text-stone-400 text-[11px]">
              The winning player receives the remaining 95% of the pot credited to their registered Bhutanese bank account.
            </p>
          </div>

          {/* Commission Credit Ledger */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-amber-400/80 font-semibold mb-2.5 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              Recent 5% Commission Deposits
            </h3>

            {commissionLog.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-[#1C0E05] border border-amber-950 text-stone-500 text-xs">
                No match commission collected yet. Complete a match to route commission to BOB Acc No. {HOUSE_COMMISSION_ACCOUNT.accountNumber}!
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {commissionLog.slice(0, 15).map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg bg-[#1C0E05] border border-amber-950/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 flex items-center justify-center">
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-medium text-amber-100 block">
                          5% Rake from Pot Nu. {log.totalPot}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {log.winnerName} · {log.timestamp}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-amber-300 font-mono tabular-nums block">
                        +Nu. {log.commissionAmount}
                      </span>
                      <span className="text-[9px] text-stone-500 font-mono">
                        BOB #130174063
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#2C180B] border-t border-amber-900/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Close Treasury
          </button>
        </div>
      </div>
    </div>
  );
};
