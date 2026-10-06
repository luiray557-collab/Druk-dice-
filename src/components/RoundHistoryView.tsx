import React from 'react';
import { History, Award, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';

export interface RoundRecord {
  round: number;
  p1Dice: number;
  p2Dice: number;
  p1Total?: number;
  p2Total?: number;
  winner: 'p1' | 'p2' | 'tie';
  summaryText: string;
}

interface RoundHistoryViewProps {
  roundHistory: RoundRecord[];
  isMatchActive: boolean;
  currentRound: number;
}

export const RoundHistoryView: React.FC<RoundHistoryViewProps> = ({
  roundHistory,
  isMatchActive,
  currentRound,
}) => {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#2C180B] to-[#241306] border border-amber-800/40">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <History className="w-4 h-4" />
              <span>Match Round Annals</span>
            </div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-100">
              Sho Clashes Ledger
            </h2>
            <p className="text-xs text-stone-300 mt-1">
              {isMatchActive
                ? `Currently contested: Round ${currentRound} of 5`
                : 'Complete chronicle of rolled rounds in the current encounter'}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-stone-400 block">Rounds Completed</span>
            <span className="text-2xl font-bold text-amber-300 font-cinzel">
              {roundHistory.length} / 5
            </span>
          </div>
        </div>
      </div>

      {roundHistory.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#221206] border border-amber-900/30">
          <Award className="w-12 h-12 text-amber-600/40 mx-auto mb-3" />
          <h3 className="font-cinzel text-lg text-amber-200 font-semibold">
            No Rounds Rolled Yet
          </h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto mt-1">
            Pay the entry stake and slam the wooden Sho cup on the arena felt to record the first round!
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {roundHistory.map((rec) => (
            <div
              key={rec.round}
              className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                rec.winner === 'p1'
                  ? 'bg-emerald-950/20 border-emerald-900/40'
                  : rec.winner === 'p2'
                  ? 'bg-rose-950/20 border-rose-900/40'
                  : 'bg-amber-950/20 border-amber-900/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                    rec.winner === 'p1'
                      ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60'
                      : rec.winner === 'p2'
                      ? 'bg-rose-900/60 text-rose-300 border border-rose-700/60'
                      : 'bg-amber-900/60 text-amber-300 border border-amber-700/60'
                  }`}
                >
                  R{rec.round}
                </div>
                <div>
                  <span className="font-semibold text-amber-100 text-sm block">
                    {rec.summaryText}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                    <span>
                      You rolled: <strong className="text-amber-200">{rec.p1Dice}</strong>
                    </span>
                    <span>·</span>
                    <span>
                      Opponent rolled: <strong className="text-amber-200">{rec.p2Dice}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold">
                {rec.winner === 'p1' ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> You Won
                  </span>
                ) : rec.winner === 'p2' ? (
                  <span className="text-rose-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Opponent Won
                  </span>
                ) : (
                  <span className="text-amber-300 flex items-center gap-1">
                    <MinusCircle className="w-4 h-4" /> Tie
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
