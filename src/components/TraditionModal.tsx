import React from 'react';
import { X, Flame, Shield, Award, Sparkles } from 'lucide-react';
import { SHO_CALLS, TWO_DICE_CALLS } from '../data/shoTradition';

interface TraditionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TraditionModal: React.FC<TraditionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#241408] border border-amber-800/60 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#2C180B] border-b border-amber-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-xl select-none">
              <span>🎲</span>
            </div>
            <div>
              <h2 className="font-cinzel text-lg font-bold text-amber-100">
                Bhutanese Sho Tradition & Rules · འབྲུག་ ཤོ་
              </h2>
              <p className="text-xs text-amber-400/80">
                The noble art of Himalayan dice rolling & match wagering
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

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto text-sm text-stone-300">
          {/* Introduction Card */}
          <div className="p-4 rounded-xl bg-[#2D1B0F] border border-amber-900/60 leading-relaxed">
            <h3 className="font-cinzel text-amber-200 font-bold mb-2 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              The Heritage of Sho in the Thunder Dragon Kingdom
            </h3>
            <p className="text-xs text-stone-300/90 leading-normal">
              In Bhutan, <strong>Sho (ཤོ་)</strong> is one of the kingdom’s most beloved traditional games, often played alongside archery (Dha) during festivals like <em>Losar (New Year)</em> and Blessed Rainy Day. Players roll bone dice from a polished wooden cup (<em>Sho-para</em>) onto a thick leather circular pad (<em>Kha-ten</em>), chanting auspicious poetry to summon fortune and confound their rivals!
            </p>
          </div>

          {/* Rules Section */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-500" />
              Match Format & Stakes Rules
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#1C0E05] border border-amber-950 rounded-lg">
                <span className="font-semibold text-amber-200 block mb-1">
                  1. Best of 5 (Must Win at Least 3 Rolls)
                </span>
                <p className="text-stone-400">
                  A player must win at least 3 rolls to claim match victory. If neither player reaches 3 wins by Round 5 (due to ties), the match proceeds into Overtime until a player secures their 3rd win!
                </p>
              </div>

              <div className="p-3 bg-[#1C0E05] border border-amber-950 rounded-lg">
                <span className="font-semibold text-amber-200 block mb-1">
                  2. Stake Pot & 5% Commission (BOB Acc 130174063)
                </span>
                <p className="text-stone-400">
                  Both players contribute an equal stake (e.g. Nu. 50 each = Nu. 100 pot). The victor claims 95% of the total pot, with 5% automatically deposited into Bank of Bhutan (BOB) Account 130174063.
                </p>
              </div>

              <div className="p-3 bg-[#1C0E05] border border-amber-950 rounded-lg">
                <span className="font-semibold text-amber-200 block mb-1">
                  3. Ties & Even Clashes
                </span>
                <p className="text-stone-400">
                  When both dice show identical values, neither gains a point. If the 5 rounds end in a tie, the match is declared an honorable draw!
                </p>
              </div>

              <div className="p-3 bg-[#1C0E05] border border-amber-950 rounded-lg">
                <span className="font-semibold text-amber-200 block mb-1">
                  4. Authentic Dzongkha Calls
                </span>
                <p className="text-stone-400">
                  Toggle between traditional Dzongkha script (༡, ༢, ༣, ༤, ༥, ༦) and classical vermilion/obsidian pip dice faces anytime.
                </p>
              </div>

              <div className="p-3 bg-[#1C0E05] border border-amber-950 rounded-lg sm:col-span-2">
                <span className="font-semibold text-amber-200 block mb-1">
                  5. Weekly Play Limitation (Nu. 7,000 Max / Week)
                </span>
                <p className="text-stone-400">
                  In accordance with Bhutanese safe play regulations, each player has a strict limitation of <strong>Nu. 7,000 in a 7-day week</strong>. Once your stakes total Nu. 7,000, new match entries are locked until previous stakes roll out of the 7-day window.
                </p>
              </div>
            </div>
          </div>

          {/* Traditional Calls Breakdown */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              The Six Sacred Dice Chants (Single Die)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {Object.values(SHO_CALLS).map((call) => (
                <div
                  key={call.value}
                  className="p-2.5 rounded-lg bg-[#1C0E05] border border-amber-950 text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-tibetan text-amber-300 font-bold text-lg">
                      {call.dzongkhaNum}
                    </span>
                    <span className="text-stone-400 text-xs font-mono">({call.value})</span>
                  </div>
                  <span className="font-semibold text-amber-100 text-xs block mt-1">
                    {call.name}
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    {call.meaning}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Two-Dice Pairs in Sho */}
          <div className="p-3.5 bg-[#1C0E05] border border-amber-950 rounded-xl">
            <span className="text-xs font-semibold text-amber-300 block mb-1.5">
              Traditional Two-Dice Combinations
            </span>
            <div className="flex flex-wrap gap-2 text-[11px] text-stone-300">
              <span className="px-2 py-1 bg-[#2C180B] rounded border border-amber-900/50">
                <strong>Khatser (2)</strong>: Twin Peaks
              </span>
              <span className="px-2 py-1 bg-[#2C180B] rounded border border-amber-900/50">
                <strong>Zhi-nor (4)</strong>: Four Auspicious Blessings
              </span>
              <span className="px-2 py-1 bg-[#2C180B] rounded border border-amber-900/50">
                <strong>Gye-tse (8)</strong>: Eight Lucky Treasures
              </span>
              <span className="px-2 py-1 bg-[#2C180B] rounded border border-amber-900/50">
                <strong>Druk-chen (12)</strong>: Thunder of the Great Dragon
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#2C180B] border-t border-amber-900/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            I am Ready to Roll
          </button>
        </div>
      </div>
    </div>
  );
};
