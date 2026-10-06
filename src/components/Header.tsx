import React from 'react';
import { Volume2, VolumeX, HelpCircle, Wallet, Building2, ShieldCheck, LogOut, CheckCircle2 } from 'lucide-react';
import { BhutaneseBankAccount, HOUSE_COMMISSION_ACCOUNT } from '../data/bhutanBanks';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  walletBalance: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenWallet: () => void;
  onOpenTradition: () => void;
  onOpenCommissionVault?: () => void;
  onOpenAddBank: () => void;
  onOpenSecurity?: () => void;
  activeTab: 'arena' | 'opponents' | 'rules' | 'history';
  onSelectTab: (tab: 'arena' | 'opponents' | 'rules' | 'history') => void;
  activeAccount: BhutaneseBankAccount;
  houseCommissionTotal?: number;
}

export const Header: React.FC<HeaderProps> = ({
  walletBalance,
  soundEnabled,
  onToggleSound,
  onOpenWallet,
  onOpenTradition,
  onOpenCommissionVault,
  onOpenAddBank,
  onOpenSecurity,
  activeTab,
  onSelectTab,
  activeAccount,
  houseCommissionTotal = 0,
}) => {
  const { user, loginWithGoogle, logout } = useAuth();
  return (
    <header className="border-b border-[#3E2723] bg-[#241305]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Brand logo 🎲 and title wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-md flex items-center justify-center border border-amber-400/50 text-2xl select-none group-hover:scale-105 transition-transform">
            <span>🎲</span>
          </div>
          <button
            onClick={() => onSelectTab('arena')}
            className="text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-lg sm:text-xl font-bold tracking-tight text-amber-100 group-hover:text-amber-300 transition-colors">
                Druk Dice
              </span>
              <span className="text-xs text-amber-500 font-tibetan hidden sm:inline">
                འབྲུག་ ཤོ་
              </span>
            </div>
            <span className="text-[10px] text-amber-400/80 font-mono tracking-wider block -mt-0.5">
              BHUTANESE SHO TOURNAMENT
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-amber-200/80">
          <button
            onClick={() => onSelectTab('arena')}
            className={`hover:text-amber-300 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'arena' ? 'text-amber-400 font-semibold underline underline-offset-8' : ''
            }`}
          >
            Sho Arena
          </button>
          <button
            onClick={() => onSelectTab('opponents')}
            className={`hover:text-amber-300 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'opponents' ? 'text-amber-400 font-semibold underline underline-offset-8' : ''
            }`}
          >
            Challengers
          </button>
          <button
            onClick={() => onSelectTab('history')}
            className={`hover:text-amber-300 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'history' ? 'text-amber-400 font-semibold underline underline-offset-8' : ''
            }`}
          >
            Round Log
          </button>
          <button
            onClick={onOpenTradition}
            className="hover:text-amber-300 transition-colors whitespace-nowrap cursor-pointer"
          >
            Bhutanese Lore
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Linked Bank, BOB 130174063 5%, Sound, Rules, Wallet) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* BOB Account 130174063 5% Match Revenue Badge */}
          {onOpenCommissionVault && (
            <button
              onClick={onOpenCommissionVault}
              title={`5% of each match pot gets deposited into BOB Account ${HOUSE_COMMISSION_ACCOUNT.accountNumber}`}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1C0E05] hover:bg-[#2C180B] border border-amber-700/50 rounded-lg text-xs text-amber-300 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <div className="flex flex-col text-left leading-none">
                <span className="text-[9px] text-stone-400">BOB #130174063 (5%)</span>
                <span className="font-mono font-bold text-[11px] text-amber-200">
                  Nu. {houseCommissionTotal}
                </span>
              </div>
            </button>
          )}

          {/* Linked Player Bank Badge */}
          <button
            onClick={onOpenAddBank}
            title="Link or Switch Bhutanese Bank Account"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1C0E05] hover:bg-[#2C180B] border border-amber-900/60 rounded-lg text-xs text-amber-200/90 transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <div className="flex flex-col text-left leading-none">
              <span className="text-[9px] text-stone-400">{activeAccount.appCode}</span>
              <span className="font-mono font-semibold text-[11px] text-amber-100">
                #{activeAccount.accountNumber}
              </span>
            </div>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            className="p-2 text-amber-200/70 hover:text-amber-200 hover:bg-[#3E2723]/60 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle sound"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-stone-500" />}
          </button>

          {/* Lore/Rules */}
          <button
            onClick={onOpenTradition}
            title="How to Play & Traditions"
            className="p-2 text-amber-200/70 hover:text-amber-200 hover:bg-[#3E2723]/60 rounded-lg transition-colors cursor-pointer"
            aria-label="Game rules and tradition"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Military-Grade Anti-Cheat & Security Sentinel Modal Trigger */}
          {onOpenSecurity && (
            <button
              onClick={onOpenSecurity}
              title="Anti-Cheat & Cryptographic Security Sentinel (SHA-256 / CSPRNG)"
              className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/60 rounded-lg transition-colors cursor-pointer"
              aria-label="Security status"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </button>
          )}

          {/* Wallet Balance Display */}
          <button
            onClick={onOpenWallet}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-950 to-[#3E2723] hover:from-amber-900 hover:to-[#4A302A] border border-amber-600/40 rounded-lg shadow-sm transition-all cursor-pointer group"
          >
            <Wallet className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <div className="text-left flex flex-col leading-tight">
              <span className="text-[10px] text-amber-400/80 font-medium">Bank Wallet</span>
              <span className="text-xs sm:text-sm font-bold text-amber-100 tabular-nums">
                Nu. {walletBalance.toLocaleString()}
              </span>
            </div>
          </button>

          {/* Google Sign-In / Player Authentication */}
          {user ? (
            <div className="flex items-center gap-2 pl-1.5 border-l border-amber-900/60">
              <div
                onClick={onOpenSecurity}
                className="flex items-center gap-2 cursor-pointer group"
                title={`Logged in as ${user.displayName || user.email} (Google Verified)`}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Player'}
                    className="w-8 h-8 rounded-full border-2 border-emerald-500/80 shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-900 text-emerald-200 border border-emerald-500 flex items-center justify-center font-bold text-xs">
                    {user.displayName ? user.displayName[0] : 'G'}
                  </div>
                )}
                <div className="hidden xl:flex flex-col text-left leading-none">
                  <span className="text-[11px] font-semibold text-amber-100 max-w-[90px] truncate">
                    {user.displayName || 'Player'}
                  </span>
                  <span className="text-[9px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                  </span>
                </div>
              </div>
              <button
                onClick={() => logout()}
                title="Sign out of Google"
                className="p-1 text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => loginWithGoogle()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-emerald-950 to-[#142615] hover:from-emerald-900 hover:to-[#1b351d] border border-emerald-600/60 rounded-lg text-xs font-semibold text-emerald-200 transition-all cursor-pointer shadow-sm group"
              title="Sign in or Sign up with Google Account"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="hidden sm:inline">Google Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
