import React from 'react';
import { X, ShieldAlert, Clock, RefreshCw, CheckCircle2, History, AlertTriangle } from 'lucide-react';

export interface WeeklyPlayRecord {
  id: string;
  amount: number;
  timestamp: number;
  opponent: string;
}

interface WeeklyLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  weeklyLimit: number;
  weeklyStaked: number;
  weeklyRemaining: number;
  records: WeeklyPlayRecord[];
  onResetWeeklyLimit: () => void;
  entryFee: number;
}

export const WeeklyLimitModal: React.FC<WeeklyLimitModalProps> = ({
  isOpen,
  onClose,
  weeklyLimit,
  weeklyStaked,
  weeklyRemaining,
  records,
  onResetWeeklyLimit,
  entryFee,
}) => {
  if (!isOpen) return null;

  const percentage = Math.min(100, Math.round((weeklyStaked / weeklyLimit) * 100));
  const isLimitReached = weeklyStaked >= weeklyLimit;
  const cannotAffordNextStake = weeklyRemaining < entryFee;

  // Calculate earliest record expiry in rolling 7-day window
  const oldestRecord = records.length > 0 ? records[records.length - 1] : null;
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  const earliestExpiryDate = oldestRecord
    ? new Date(oldestRecord.timestamp + SEVEN_DAYS_MS)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#241408] border-2 border-amber-600/70 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#2C180B] to-[#3B1E0C] border-b border-amber-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isLimitReached
                ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                : 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-base sm:text-lg font-bold text-amber-100 flex items-center gap-2">
                <span>Weekly Play Limitation</span>
              </h2>
              <p className="text-xs text-amber-400 font-mono">
                Mandatory Ceiling: Nu. {weeklyLimit.toLocaleString()} / Week
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
          {/* Main Limit Meter Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#3D210D] to-[#251307] border border-amber-600/60 shadow-xl relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold block mb-1">
                  7-Day Rolling Play Quota
                </span>
                <span className="text-3xl font-extrabold text-white font-cinzel tabular-nums">
                  Nu. {weeklyStaked.toLocaleString()}{' '}
                  <span className="text-sm font-normal text-stone-400">/ Nu. {weeklyLimit.toLocaleString()}</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-400 block mb-0.5">Remaining Quota</span>
                <span className={`text-xl font-bold font-mono ${
                  cannotAffordNextStake ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  Nu. {weeklyRemaining.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 space-y-1.5">
              <div className="w-full h-3 rounded-full bg-[#180C04] border border-amber-900/60 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    percentage >= 100
                      ? 'bg-rose-500'
                      : percentage >= 80
                      ? 'bg-amber-400'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-stone-400">
                <span>Used: {percentage}%</span>
                <span>Max Ceiling: Nu. {weeklyLimit.toLocaleString()}</span>
              </div>
            </div>

            {/* Status Alert Banner */}
            {cannotAffordNextStake ? (
              <div className="mt-4 p-3 rounded-xl bg-rose-950/70 border border-rose-600/50 flex items-start gap-2.5 text-xs text-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Weekly Ceiling Enforced</span>
                  <span className="text-rose-300/90 text-[11px]">
                    You have reached the maximum allowed stakes for this week. In accordance with rules, player cannot stake more than Nu. 7,000 in a 7-day week.
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-700/40 flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You have Nu. {weeklyRemaining.toLocaleString()} remaining to wager this week.</span>
              </div>
            )}
          </div>

          {/* Rule Details */}
          <div className="p-3.5 rounded-xl bg-[#1C0E05] border border-amber-950 text-xs text-stone-300 space-y-1.5 leading-relaxed">
            <span className="font-semibold text-amber-200 block">
              🛡️ Bhutanese Responsible Play Directive:
            </span>
            <p className="text-stone-300/90">
              Each player has a strict limitation of <strong>Nu. 7,000 in a week</strong>. Once your stakes reach Nu. 7,000 within any 7-day period, further match entries are locked until previous stakes roll out of the window.
            </p>
            {earliestExpiryDate && (
              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  Earliest quota release: {earliestExpiryDate.toLocaleDateString()} at{' '}
                  {earliestExpiryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
          </div>

          {/* Weekly Stakes Log */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs uppercase tracking-wider text-amber-400/80 font-semibold flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-amber-500" />
                This Week's Match Stakes ({records.length})
              </h3>
              <button
                onClick={onResetWeeklyLimit}
                className="text-[11px] text-stone-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                title="Reset weekly quota (for testing and new cycle)"
              >
                <RefreshCw className="w-3 h-3" /> Reset Quota
              </button>
            </div>

            {records.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#1C0E05] border border-amber-950 text-center text-xs text-stone-500">
                No match stakes placed yet this week. Play up to Nu. 7,000!
              </div>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {records.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-2 rounded-lg bg-[#1C0E05] border border-amber-950/70 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-amber-100 block">
                        Match Stake vs {rec.opponent}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {new Date(rec.timestamp).toLocaleDateString()} ·{' '}
                        {new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-rose-400 tabular-nums">
                      -Nu. {rec.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#2C180B] border-t border-amber-900/40 flex items-center justify-between">
          <span className="text-[11px] text-stone-400 font-mono">
            Limit: Nu. 7,000 per 7-day cycle
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
