import React, { useState, useEffect } from 'react';
import { X, Search, Wifi, Swords, ShieldCheck, CheckCircle2, UserCheck } from 'lucide-react';
import { BHUTAN_RANDOM_PLAYERS, RandomChallenger, getRandomPlayer } from '../data/randomPlayers';

interface RandomMatchmakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMatchFound: (challenger: RandomChallenger) => void;
  entryFee: number;
}

export const RandomMatchmakingModal: React.FC<RandomMatchmakingModalProps> = ({
  isOpen,
  onClose,
  onMatchFound,
  entryFee,
}) => {
  const [stage, setStage] = useState<'searching' | 'found'>('searching');
  const [matchedChallenger, setMatchedChallenger] = useState<RandomChallenger | null>(null);
  const [searchSeconds, setSearchSeconds] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setStage('searching');
      setMatchedChallenger(null);
      setSearchSeconds(0);
      return;
    }

    setStage('searching');
    setSearchSeconds(0);

    const timer = setInterval(() => {
      setSearchSeconds((s) => s + 1);
    }, 1000);

    // Random matchmaking resolution between 2.2s and 3.5s
    const resolveTime = 2200 + Math.floor(Math.random() * 1400);
    const timeout = setTimeout(() => {
      const picked = getRandomPlayer();
      setMatchedChallenger(picked);
      setStage('found');

      // Automatically launch match after brief preview
      const autoLaunch = setTimeout(() => {
        onMatchFound(picked);
        onClose();
      }, 1500);

      return () => clearTimeout(autoLaunch);
    }, resolveTime);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#241408] border-2 border-amber-600/70 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#2C180B] to-[#3B1E0C] border-b border-amber-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-amber-400" />
            <span className="font-cinzel text-sm font-bold text-amber-100">
              Random Player Matchmaking
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
          {stage === 'searching' ? (
            <>
              {/* Radar Animation */}
              <div className="relative w-28 h-28 flex items-center justify-center my-2">
                <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 animate-ping opacity-60" />
                <div className="absolute inset-2 rounded-full border border-amber-400/40 animate-pulse" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center text-2xl shadow-xl shadow-amber-900/50">
                  <span>🎲</span>
                </div>
              </div>

              <div>
                <h3 className="font-cinzel text-lg font-bold text-white mb-1">
                  Searching for a Random Player...
                </h3>
                <p className="text-xs text-amber-300/80">
                  Scanning active players in Thimphu, Paro, Punakha & Bumthang ({searchSeconds}s)
                </p>
              </div>

              {/* Stake & Security Pill */}
              <div className="px-3.5 py-1.5 rounded-full bg-[#180B03] border border-amber-800/60 text-xs text-amber-200 flex items-center gap-2">
                <span>Matching for Pot: <strong>Nu. {entryFee * 2}</strong></span>
                <span>·</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Wifi className="w-3 h-3" /> Live Queue
                </span>
              </div>
            </>
          ) : (
            matchedChallenger && (
              <div className="w-full space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-900/40">
                  <UserCheck className="w-6 h-6" />
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold block">
                    Opponent Found!
                  </span>
                  <h3 className="font-cinzel text-xl font-black text-amber-100 mt-0.5">
                    {matchedChallenger.name}
                  </h3>
                  <span className="text-xs text-stone-400 block mt-0.5">
                    📍 {matchedChallenger.dzongkhag}
                  </span>
                </div>

                {/* Opponent Card Preview */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#2D1B0F] to-[#1E0F05] border border-amber-700/60 flex items-center justify-between text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-950/90 border border-amber-600/40 flex items-center justify-center text-2xl">
                      {matchedChallenger.avatarEmoji}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-amber-200 block">
                        Rating: {matchedChallenger.rating} ⚡
                      </span>
                      <span className="text-[11px] text-stone-400 block">
                        Win Rate: {matchedChallenger.winRate} · {matchedChallenger.playStyle}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {matchedChallenger.ping}ms
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Entering 3-win match arena now...</span>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
