import React from 'react';
import { OPPONENTS, Opponent } from '../data/shoTradition';
import { Check, ShieldCheck, Flame, Compass } from 'lucide-react';

interface OpponentsViewProps {
  selectedOpponent: Opponent;
  onSelectOpponent: (opp: Opponent) => void;
  onChallenge: (opp: Opponent) => void;
  isMatchActive: boolean;
  onOpenMatchmaking?: () => void;
}

export const OpponentsView: React.FC<OpponentsViewProps> = ({
  selectedOpponent,
  onSelectOpponent,
  onChallenge,
  isMatchActive,
  onOpenMatchmaking,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#2C180B] via-[#361E0E] to-[#241306] border border-amber-800/40 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Kingdom Challengers of Bhutan</span>
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-100">
            Select Your Sho Worthy Opponent
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
            From the archery grounds of Changlimithang to the high passes of Bumthang, choose a local master or find a random online player to roll against in an honorable 5-round wager.
          </p>
        </div>
      </div>

      {/* Grid of Opponents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Featured Random Matchmaking Card */}
        {onOpenMatchmaking && (
          <div
            onClick={onOpenMatchmaking}
            className="md:col-span-2 lg:col-span-3 p-5 rounded-xl bg-gradient-to-r from-[#2F1A0C] via-[#3E2412] to-[#241306] border-2 border-amber-500/70 hover:border-amber-400 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
                <span>🎲</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-cinzel text-lg font-bold text-amber-100">
                    Random Player Matchmaking
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Online Queue Active
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-1">
                  Pair instantly with a random active challenger from across Bhutan (Thimphu, Paro, Punakha, Bumthang).
                </p>
              </div>
            </div>
            <button
              type="button"
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-cinzel font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              <span>FIND RANDOM PLAYER</span>
            </button>
          </div>
        )}

        {OPPONENTS.map((opp) => {
          const isSelected = selectedOpponent.id === opp.id;
          return (
            <div
              key={opp.id}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#331C0C] border-amber-500 ring-2 ring-amber-500/30 shadow-lg'
                  : 'bg-[#221206] border-amber-900/40 hover:border-amber-700/60'
              }`}
            >
              <div>
                {/* Character Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-700/50 flex items-center justify-center text-2xl shadow-inner">
                      {opp.avatarEmoji}
                    </div>
                    <div>
                      <h3 className="font-bold text-amber-100 text-base leading-tight">
                        {opp.name}
                      </h3>
                      <span className="text-xs text-amber-400 font-tibetan block">
                        {opp.dzongkhaTitle}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="p-1 rounded-full bg-amber-500 text-black">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>

                {/* Subtitle / Details */}
                <div className="text-xs text-stone-400 mb-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-300/80">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                    <span>{opp.role}</span>
                  </div>
                  <div className="text-stone-400">{opp.origin}</div>
                </div>

                {/* Quote */}
                <div className="p-3 rounded-lg bg-[#180C04] border border-amber-950/70 text-xs italic text-stone-300/90 mb-4">
                  "{opp.quote}"
                </div>
              </div>

              {/* Bottom Action Area */}
              <div className="pt-3 border-t border-amber-900/30 flex items-center justify-between gap-2">
                <span className="text-xs text-amber-400/80 font-medium">
                  Stake: Nu. {opp.recommendedStake}
                </span>

                <button
                  onClick={() => {
                    onSelectOpponent(opp);
                    if (!isMatchActive) {
                      onChallenge(opp);
                    }
                  }}
                  disabled={isMatchActive && isSelected}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-black hover:bg-amber-400'
                      : 'bg-[#3A200E] text-amber-200 hover:bg-amber-700 hover:text-white border border-amber-800/60'
                  }`}
                >
                  {isSelected ? 'Active Challenger' : 'Challenge'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
