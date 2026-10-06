import React, { useState } from 'react';
import {
  X,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  RefreshCw,
  CheckCircle2,
  Building2,
  CreditCard,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import { BhutaneseBankAccount, HOUSE_COMMISSION_ACCOUNT } from '../data/bhutanBanks';
import { sounds } from '../utils/audio';

export interface WalletTransaction {
  id: string;
  type: 'stake' | 'win' | 'topup';
  amount: number;
  description: string;
  timestamp: string;
}

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  transactions: WalletTransaction[];
  onAddFunds: (amount: number, description: string) => void;
  onResetBalance: () => void;
  bankAccounts: BhutaneseBankAccount[];
  activeAccount: BhutaneseBankAccount;
  onSelectAccount: (acc: BhutaneseBankAccount) => void;
  onOpenAddBank: () => void;
  onOpenCommissionVault?: () => void;
  houseCommissionTotal?: number;
  weeklyLimit?: number;
  weeklyStaked?: number;
  weeklyRemaining?: number;
  onOpenWeeklyLimit?: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  balance,
  transactions,
  onAddFunds,
  onResetBalance,
  bankAccounts,
  activeAccount,
  onSelectAccount,
  onOpenAddBank,
  onOpenCommissionVault,
  houseCommissionTotal,
  weeklyLimit = 7000,
  weeklyStaked = 0,
  weeklyRemaining = 7000,
  onOpenWeeklyLimit,
}) => {
  const [tab, setTab] = useState<'balance' | 'banks' | 'history'>('balance');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#241408] border border-amber-800/60 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#2C180B] border-b border-amber-900/40 flex items-center justify-between">
          <div>
            <h2 className="font-cinzel text-lg font-bold text-amber-100 flex items-center gap-2">
              <span>Bhutan Digital Banking & Wallet</span>
            </h2>
            <p className="text-xs text-amber-400/80">
              mBOB · B-Ngul · Druk PNB · TPay · eTeeru
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Tabs */}
        <div className="flex border-b border-amber-900/40 bg-[#1D0E05] px-6 pt-2">
          <button
            onClick={() => setTab('balance')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              tab === 'balance'
                ? 'border-amber-400 text-amber-200'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Balance & Stakes
          </button>
          <button
            onClick={() => setTab('banks')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              tab === 'banks'
                ? 'border-amber-400 text-amber-200'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            My Bhutanese Banks ({bankAccounts.length})
          </button>
          <button
            onClick={() => setTab('history')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              tab === 'history'
                ? 'border-amber-400 text-amber-200'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Ledger History
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {tab === 'balance' && (
            <>
              {/* Balance Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#381F0E] to-[#251307] border border-amber-700/50 shadow-inner">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-amber-300/80 font-medium">
                    Available Match Balance
                  </span>
                  <span className="text-[11px] text-amber-400/90 font-mono">
                    Linked: {activeAccount.appCode}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-amber-200 font-cinzel tabular-nums">
                    Nu. {balance.toLocaleString()}
                  </span>
                  <span className="text-xs text-amber-400/70">Bhutanese Ngultrum</span>
                </div>

                <div className="mt-3 pt-3 border-t border-amber-800/40 flex items-center justify-between text-xs text-amber-200/70">
                  <span className="truncate max-w-[240px]">
                    {activeAccount.bankName} #{activeAccount.accountNumber}
                  </span>
                  <span className="text-emerald-400 flex items-center gap-1 font-medium shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active Payout Bank
                  </span>
                </div>
              </div>

              {/* 5% of Match Pot into BOB Account 130174063 */}
              {onOpenCommissionVault && (
                <div
                  onClick={onOpenCommissionVault}
                  className="p-3.5 rounded-xl bg-gradient-to-r from-[#2F1A0C] to-[#241306] border border-amber-700/60 hover:border-amber-500/80 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-amber-400/80 tracking-wider block">
                        5% Match Pot Deposit Account
                      </span>
                      <span className="font-bold text-amber-100 text-xs sm:text-sm">
                        BOB Account {HOUSE_COMMISSION_ACCOUNT.accountNumber}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Total 5% Deposited</span>
                      <span className="font-mono font-bold text-xs text-amber-300">
                        Nu. {houseCommissionTotal ?? 0}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              )}

              {/* Weekly Play Limitation Card (Nu. 7,000 Cap) */}
              {onOpenWeeklyLimit && (
                <div
                  onClick={onOpenWeeklyLimit}
                  className="p-3.5 rounded-xl bg-gradient-to-r from-[#2A1608] to-[#1E0F05] border border-amber-800/60 hover:border-amber-600/70 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-amber-400/80 tracking-wider block">
                        Weekly Play Limitation (Nu. 7,000 Cap)
                      </span>
                      <span className="font-bold text-amber-100 text-xs sm:text-sm">
                        Nu. {weeklyStaked.toLocaleString()} / Nu. {weeklyLimit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Remaining</span>
                      <span className={`font-mono font-bold text-xs ${
                        weeklyRemaining <= 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        Nu. {weeklyRemaining.toLocaleString()}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              )}

              {/* Quick Top-Up / Blessings */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-amber-400/80 font-semibold mb-3">
                  Replenish Stakes via {activeAccount.appCode}
                </h3>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    onClick={() => {
                      sounds.playCoinClink();
                      onAddFunds(100, `Dzong Blessing via ${activeAccount.appCode} (+Nu. 100)`);
                    }}
                    className="p-3 bg-[#2D1B0F] hover:bg-[#3D2515] border border-amber-900/60 hover:border-amber-600/60 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <span className="text-[11px] text-amber-400/70 block">Daily Grace</span>
                    <span className="text-sm font-bold text-amber-200 group-hover:text-amber-100 font-cinzel">
                      +Nu. 100
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playCoinClink();
                      onAddFunds(500, `${activeAccount.appCode} Recharge (+Nu. 500)`);
                    }}
                    className="p-3 bg-[#2D1B0F] hover:bg-[#3D2515] border border-amber-900/60 hover:border-amber-600/60 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <span className="text-[11px] text-amber-400/70 block">Standard</span>
                    <span className="text-sm font-bold text-amber-200 group-hover:text-amber-100 font-cinzel">
                      +Nu. 500
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playCoinClink();
                      onAddFunds(1000, `High Roller Deposit via ${activeAccount.shortName || activeAccount.bankName} (+Nu. 1,000)`);
                    }}
                    className="p-3 bg-[#2D1B0F] hover:bg-[#3D2515] border border-amber-900/60 hover:border-amber-600/60 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <span className="text-[11px] text-amber-400/70 block">High Roller</span>
                    <span className="text-sm font-bold text-amber-200 group-hover:text-amber-100 font-cinzel">
                      +Nu. 1,000
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}

          {tab === 'banks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-amber-400/80 font-semibold">
                    Linked Bhutanese Bank Accounts
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Use accounts from BOB, BNBL, Druk PNB, T-Bank, or BDBL
                  </p>
                </div>
                <button
                  onClick={onOpenAddBank}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Bank Account</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {bankAccounts.map((acc) => {
                  const isActive = activeAccount.id === acc.id;
                  return (
                    <div
                      key={acc.id}
                      onClick={() => onSelectAccount(acc)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isActive
                          ? 'bg-[#3A200E] border-amber-400 shadow-md ring-1 ring-amber-400/30'
                          : 'bg-[#1C0E05] border-amber-950 hover:border-amber-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-950 border border-amber-800/40 flex items-center justify-center text-amber-300">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-amber-100">
                              {acc.bankName}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-300 text-[10px] font-mono">
                              {acc.appCode}
                            </span>
                          </div>
                          <span className="font-mono text-xs text-amber-300/80 block mt-0.5">
                            Acc: {acc.accountNumber} · {acc.accountHolder}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        {isActive ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-600/40 text-emerald-300 text-[10px] font-bold">
                            Active Bank
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="text-xs text-amber-400 hover:text-amber-200 underline"
                          >
                            Set Active
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Instant Settlement Guarantee */}
              <div className="p-3 rounded-xl bg-[#1C0E05] border border-amber-950 text-xs text-stone-300 space-y-1">
                <span className="font-semibold text-amber-300 block">
                  🛡️ Instant Digital Settlement:
                </span>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Your tournament winnings are deposited directly into your selected primary Bhutanese bank account via Bhutan digital payment rails.
                </p>
              </div>
            </div>
          )}

          {tab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider text-amber-400/80 font-semibold">
                  Recent Banking Ledger
                </h3>
                <button
                  onClick={onResetBalance}
                  className="text-xs text-stone-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Reset balance to starting Nu. 500"
                >
                  <RefreshCw className="w-3 h-3" /> Reset to Nu. 500
                </button>
              </div>

              {transactions.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#1C0E05] border border-amber-950 text-center text-xs text-amber-300/50">
                  No recent transactions yet. Place a stake to begin!
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {transactions.slice(0, 15).map((tx) => (
                    <div
                      key={tx.id}
                      className="p-2.5 rounded-lg bg-[#1C0E05] border border-amber-950/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            tx.type === 'win'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                              : tx.type === 'topup'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800/40'
                              : 'bg-rose-950 text-rose-400 border border-rose-800/40'
                          }`}
                        >
                          {tx.type === 'win' ? (
                            <ArrowDownRight className="w-3.5 h-3.5" />
                          ) : tx.type === 'topup' ? (
                            <Plus className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-amber-100 block">
                            {tx.description}
                          </span>
                          <span className="text-[10px] text-stone-400">{tx.timestamp}</span>
                        </div>
                      </div>
                      <span
                        className={`font-semibold font-mono tabular-nums ${
                          tx.type === 'win'
                            ? 'text-emerald-400'
                            : tx.type === 'topup'
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {tx.type === 'stake' ? '-' : '+'}Nu. {tx.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#2C180B] border-t border-amber-900/40 flex justify-between items-center">
          <span className="text-[11px] text-stone-400 font-mono">
            Active: {activeAccount.shortName || activeAccount.bankName} ({activeAccount.accountNumber})
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Close Wallet
          </button>
        </div>
      </div>
    </div>
  );
};
