import React, { useEffect, useRef } from 'react';
import { Trophy, Frown, Handshake, RotateCcw, Building2, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Opponent } from '../data/shoTradition';
import { BhutaneseBankAccount, HOUSE_COMMISSION_ACCOUNT } from '../data/bhutanBanks';

interface MatchSummaryModalProps {
  isOpen: boolean;
  onPlayAgain: () => void;
  onClose: () => void;
  player1Score: number;
  player2Score: number;
  entryFee: number;
  totalPot: number;
  winnings: number;
  opponent: Opponent;
  playerAccount: BhutaneseBankAccount;
  isTwoPlayerLocal?: boolean;
  wasSuddenDeath?: boolean;
}

export const MatchSummaryModal: React.FC<MatchSummaryModalProps> = ({
  isOpen,
  onPlayAgain,
  onClose,
  player1Score,
  player2Score,
  entryFee,
  totalPot,
  winnings,
  opponent,
  playerAccount,
  isTwoPlayerLocal = false,
  wasSuddenDeath = false,
}) => {
  const isVictory = player1Score > player2Score;
  const isDefeat = player2Score > player1Score;
  const isDraw = player1Score === player2Score;
  const houseCommission = Math.round(totalPot * 0.05);

  const confettiFiredRef = useRef(false);

  // Trigger rich confetti celebration on victory specifically when player1Score > player2Score
  const fireConfetti = () => {
    // Stage 1: Left & Right dual cannon burst
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 65,
      origin: { x: 0.15, y: 0.65 },
      colors: ['#F59E0B', '#D97706', '#DC2626', '#10B981', '#FCD34D', '#FFFFFF'],
      zIndex: 9999,
      disableForReducedMotion: true,
    });

    confetti({
      particleCount: 80,
      angle: 120,
      spread: 65,
      origin: { x: 0.85, y: 0.65 },
      colors: ['#F59E0B', '#D97706', '#DC2626', '#10B981', '#FCD34D', '#FFFFFF'],
      zIndex: 9999,
      disableForReducedMotion: true,
    });

    // Stage 2: Central golden fountain
    setTimeout(() => {
      confetti({
        particleCount: 70,
        spread: 110,
        origin: { x: 0.5, y: 0.45 },
        shapes: ['circle', 'square'],
        colors: ['#F59E0B', '#FBBF24', '#EF4444', '#34D399', '#FDE68A'],
        zIndex: 9999,
        scalar: 1.2,
        disableForReducedMotion: true,
      });
    }, 250);

    // Stage 3: Gentle gold glitter shower
    setTimeout(() => {
      confetti({
        particleCount: 45,
        spread: 140,
        origin: { x: 0.5, y: 0.2 },
        colors: ['#F59E0B', '#FCD34D', '#FFFFFF'],
        zIndex: 9999,
        gravity: 0.8,
        ticks: 200,
        disableForReducedMotion: true,
      });
    }, 500);
  };

  useEffect(() => {
    // Specifically fire celebratory confetti when the modal is open and player1Score > player2Score
    if (isOpen && player1Score > player2Score && !confettiFiredRef.current) {
      confettiFiredRef.current = true;
      fireConfetti();
    }
    if (!isOpen) {
      confettiFiredRef.current = false;
    }
  }, [isOpen, player1Score, player2Score]);

  if (!isOpen) return null;

  const p2Name = isTwoPlayerLocal ? 'Player 2' : opponent.name;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-[#2C1B0E] border-2 border-amber-600/70 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col text-white max-h-[92vh]">
        {/* Banner */}
        <div
          className={`px-6 py-5 text-center relative ${
            isVictory
              ? 'bg-gradient-to-b from-amber-600/30 to-amber-950/20 border-b border-amber-600/40'
              : isDefeat
              ? 'bg-gradient-to-b from-rose-900/30 to-[#2C1B0E] border-b border-rose-900/40'
              : 'bg-gradient-to-b from-stone-800/40 to-[#2C1B0E] border-b border-stone-700/40'
          }`}
        >
          <div className="flex justify-center mb-2.5">
            {isVictory ? (
              <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center shadow-lg animate-bounce">
                <Trophy className="w-7 h-7 text-amber-300" />
              </div>
            ) : isDefeat ? (
              <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center shadow-lg">
                <Frown className="w-7 h-7 text-rose-300" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center shadow-lg">
                <Handshake className="w-7 h-7 text-amber-300" />
              </div>
            )}
          </div>

          <h2 className="font-cinzel text-xl sm:text-2xl font-black text-amber-300 tracking-wide">
            {isVictory
              ? '🏆 MATCH VICTORY!'
              : isDefeat
              ? '💔 MATCH DEFEAT'
              : '🤝 MATCH DRAW'}
          </h2>
          {wasSuddenDeath && (
            <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/60 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
              <span>⚡ Clinched on Sudden Death Deciding Roll!</span>
            </div>
          )}
          <p className="text-xs text-amber-200/70 mt-0.5 font-tibetan">
            {isVictory
              ? 'རྒྱལ་ཁ་ཐོབ་སོང་། · Tashi Delek Victory!'
              : isDefeat
              ? 'ཕམ་ཁ་བྱུང་སོང་། · Better luck next round'
              : 'འདྲ་མཉམ་བྱུང་སོང་། · Honorable Draw'}
          </p>

          {isVictory && (
            <button
              onClick={fireConfetti}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-[11px] text-amber-200 font-medium transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Celebrate Again</span>
            </button>
          )}
        </div>

        {/* Breakdown Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Score Box */}
          <div className="p-3.5 rounded-xl bg-[#1E1005] border border-amber-900/60 flex flex-col items-center gap-2">
            <div className="w-full flex items-center justify-around">
              <div className="text-center">
                <span className="text-xs text-emerald-400 font-medium block">
                  {isTwoPlayerLocal ? 'Player 1' : 'You (P1)'}
                </span>
                <span className="text-3xl font-extrabold text-white font-cinzel">
                  {player1Score}
                </span>
                <span className="text-[10px] text-emerald-400/80 font-mono block">
                  {player1Score >= 3 ? '🏆 3 Wins Secured' : `${player1Score}/3 Wins`}
                </span>
              </div>
              <div className="text-center">
                <span className="text-amber-500/60 font-cinzel font-bold text-lg block">VS</span>
                <span className="text-[9px] text-amber-300/80 font-mono uppercase">
                  Target: 3 Wins
                </span>
              </div>
              <div className="text-center">
                <span className="text-xs text-orange-400 font-medium block">
                  {p2Name}
                </span>
                <span className="text-3xl font-extrabold text-white font-cinzel">
                  {player2Score}
                </span>
                <span className="text-[10px] text-orange-400/80 font-mono block">
                  {player2Score >= 3 ? '🏆 3 Wins Secured' : `${player2Score}/3 Wins`}
                </span>
              </div>
            </div>
          </div>

          {/* Stake & Earnings Breakdown */}
          <div className="space-y-1.5 text-xs text-stone-300">
            <div className="flex justify-between py-1 border-b border-amber-900/30">
              <span className="text-stone-400">Entry Fee Paid:</span>
              <span className="font-medium text-white tabular-nums">Nu. {entryFee}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-amber-900/30">
              <span className="text-stone-400">Total Match Pot:</span>
              <span className="font-medium text-amber-300 tabular-nums">Nu. {totalPot}</span>
            </div>

            {/* 5% of match gets into BOB account 130174063 */}
            <div className="p-2.5 rounded-lg bg-[#221206] border border-amber-900/60 space-y-1 mt-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-amber-300 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  5% of Match Pot:
                </span>
                <span className="font-bold text-amber-300 font-mono tabular-nums">
                  Nu. {houseCommission}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-stone-300">
                <span>Deposited into Account:</span>
                <span className="font-mono text-amber-200 font-bold">
                  BOB Account {HOUSE_COMMISSION_ACCOUNT.accountNumber}
                </span>
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 pt-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>5% credited to Bank of Bhutan Account 130174063</span>
              </div>
            </div>

            {/* Winner Payout to Player's Linked Bhutanese Bank Account */}
            <div className="p-2.5 rounded-lg bg-[#1B2919] border border-emerald-900/50 space-y-1 mt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-300 font-medium flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  {isVictory ? 'Winner Prize Deposit (95%):' : 'Winner Prize (95%):'}
                </span>
                <span
                  className={`font-bold font-mono text-sm tabular-nums ${
                    isVictory ? 'text-emerald-400 text-base' : 'text-stone-300'
                  }`}
                >
                  {isVictory ? `+Nu. ${winnings}` : `Nu. ${winnings}`}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-emerald-200/80">
                <span>Beneficiary Account:</span>
                <span className="font-mono truncate max-w-[200px]">
                  {playerAccount.bankName.split(' ')[0]} #{playerAccount.accountNumber}
                </span>
              </div>
              <div className="text-[10px] text-stone-400 flex items-center gap-1 pt-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>
                  {isVictory
                    ? `Transferred to ${playerAccount.accountHolder} via ${playerAccount.appCode}`
                    : `Awarded to ${p2Name}`}
                </span>
              </div>
            </div>
          </div>

          {/* Opponent Banter */}
          {!isTwoPlayerLocal && (
            <div className="p-3 rounded-lg bg-[#221206] border border-amber-900/40 text-xs italic text-amber-200/90 flex gap-2.5 items-start">
              <span className="text-base select-none">{opponent.avatarEmoji}</span>
              <div>
                <span className="font-semibold text-amber-300 not-italic block mb-0.5">
                  {opponent.name}:
                </span>
                <p>"{isVictory ? opponent.loseBanter : isDefeat ? opponent.winBanter : opponent.quote}"</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 bg-[#241306] border-t border-amber-900/40 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-amber-800/60 hover:bg-white/5 text-amber-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Review Board
          </button>
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
