/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dice } from './components/Dice';
import { WalletModal, WalletTransaction } from './components/WalletModal';
import { TraditionModal } from './components/TraditionModal';
import { MatchSummaryModal } from './components/MatchSummaryModal';
import { OpponentsView } from './components/OpponentsView';
import { RoundHistoryView, RoundRecord } from './components/RoundHistoryView';
import { AddBankModal } from './components/AddBankModal';
import { HouseCommissionModal, CommissionEntry } from './components/HouseCommissionModal';
import { WeeklyLimitModal, WeeklyPlayRecord } from './components/WeeklyLimitModal';
import { SecurityModal } from './components/SecurityModal';
import { RandomMatchmakingModal } from './components/RandomMatchmakingModal';
import { RandomChallenger } from './data/randomPlayers';
import { OPPONENTS, Opponent, SHO_CALLS, TWO_DICE_CALLS } from './data/shoTradition';
import {
  BHUTAN_BANKS,
  BhutaneseBankAccount,
  HOUSE_COMMISSION_ACCOUNT,
  INITIAL_PLAYER_ACCOUNTS,
} from './data/bhutanBanks';
import { sounds } from './utils/audio';
import { getSecureRandomDie } from './utils/secureRandom';
import { useSoundEffects } from './hooks/useSoundEffects';
import { computeRoundSecurityHash, generateSecuritySalt } from './utils/security';
import { useAuth } from './context/AuthContext';
import {
  Trophy,
  RotateCcw,
  Sparkles,
  Coins,
  ChevronDown,
  Info,
  Shield,
  Users,
  Swords,
  Layers,
  Flame,
  Volume2,
  VolumeX,
  Building2,
  ShieldCheck,
  Plus,
  ShieldAlert,
  AlertTriangle,
  Wifi,
  Lock,
  Cpu,
} from 'lucide-react';

export const WEEKLY_PLAY_LIMIT = 7000;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// Generated asset paths
import dragonCrestImg from './assets/images/druk_dragon_crest_1791011743065.jpg';
import diceFeltImg from './assets/images/himalayan_dice_felt_1791011756064.jpg';
import opponentsTrioImg from './assets/images/bhutan_opponents_trio_1791011767434.jpg';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'arena' | 'opponents' | 'rules' | 'history'>('arena');

  // Game Mode
  const [gameMode, setGameMode] = useState<'standard' | 'twoDice' | 'passPlay'>('standard');
  const [showDzongkhaDigits, setShowDzongkhaDigits] = useState(false);
  const [is3DMode, setIs3DMode] = useState(true);

  // Modals
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isTraditionOpen, setIsTraditionOpen] = useState(false);
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);
  const [isCommissionVaultOpen, setIsCommissionVaultOpen] = useState(false);
  const [isWeeklyLimitModalOpen, setIsWeeklyLimitModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isMatchmakingModalOpen, setIsMatchmakingModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cryptographic Match Hash & Anti-Cheat State
  const [currentMatchId, setCurrentMatchId] = useState<string>(() => 'M-' + Math.floor(1000 + Math.random() * 9000));
  const [currentMatchHash, setCurrentMatchHash] = useState<string>(() => generateSecuritySalt());

  // Google Authentication State
  const { user, userProfile, syncProfileToCloud } = useAuth();

  // Weekly Play Limitation Tracking (Nu. 7,000 / week)
  const [weeklyPlayRecords, setWeeklyPlayRecords] = useState<WeeklyPlayRecord[]>(() => {
    const saved = localStorage.getItem('druk_dice_weekly_play');
    if (saved) {
      try {
        const parsed: WeeklyPlayRecord[] = JSON.parse(saved);
        return parsed.filter((r) => Date.now() - r.timestamp < SEVEN_DAYS_MS);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Bhutanese Bank Accounts
  const [bankAccounts, setBankAccounts] = useState<BhutaneseBankAccount[]>(() => {
    const saved = localStorage.getItem('druk_dice_banks');
    return saved ? JSON.parse(saved) : INITIAL_PLAYER_ACCOUNTS;
  });

  const [activeAccount, setActiveAccount] = useState<BhutaneseBankAccount>(() => {
    const saved = localStorage.getItem('druk_dice_banks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const def = parsed.find((a: BhutaneseBankAccount) => a.isDefault);
        return def || parsed[0] || INITIAL_PLAYER_ACCOUNTS[0];
      } catch {
        return INITIAL_PLAYER_ACCOUNTS[0];
      }
    }
    return INITIAL_PLAYER_ACCOUNTS[0];
  });

  // House Commission (BOB Acc No. 130174063)
  const [houseCommissionTotal, setHouseCommissionTotal] = useState<number>(() => {
    const saved = localStorage.getItem('druk_dice_commission_total');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [commissionLog, setCommissionLog] = useState<CommissionEntry[]>(() => {
    const saved = localStorage.getItem('druk_dice_commission_log');
    return saved ? JSON.parse(saved) : [];
  });

  // Opponent
  const [selectedOpponent, setSelectedOpponent] = useState<Opponent>(OPPONENTS[0]);

  // Wallet and Stakes (faithful to Flutter model)
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('druk_dice_balance');
    return saved ? parseInt(saved, 10) : 500;
  });

  const [entryFee, setEntryFee] = useState<number>(50);
  const totalPot = entryFee * 2;

  // Transactions ledger
  const [transactions, setTransactions] = useState<WalletTransaction[]>([
    {
      id: 'tx_init',
      type: 'topup',
      amount: 500,
      description: 'Initial Bhutan Banking Verification Grant',
      timestamp: 'Today, Thimphu',
    },
  ]);

  // Match State
  const [currentRound, setCurrentRound] = useState(1);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  // Single die values
  const [p1Dice, setP1Dice] = useState(1);
  const [p2Dice, setP2Dice] = useState(1);

  // Two-dice mode secondary values
  const [p1Dice2, setP1Dice2] = useState(1);
  const [p2Dice2, setP2Dice2] = useState(1);

  const [isRolling, setIsRolling] = useState(false);
  const [isMatchActive, setIsMatchActive] = useState(false);
  const [isMatchFinished, setIsMatchFinished] = useState(false);

  // Round History
  const [roundHistory, setRoundHistory] = useState<RoundRecord[]>([]);

  // Last round outcome banner
  const [lastRoundNotice, setLastRoundNotice] = useState<string | null>(null);

  // Sudden Death / Deciding Roll state (for Draws)
  const [isSuddenDeath, setIsSuddenDeath] = useState(false);
  const [suddenDeathCount, setSuddenDeathCount] = useState(0);
  const [wasSuddenDeathWinner, setWasSuddenDeathWinner] = useState(false);

  // Persist State to localStorage
  useEffect(() => {
    localStorage.setItem('druk_dice_balance', walletBalance.toString());
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem('druk_dice_banks', JSON.stringify(bankAccounts));
  }, [bankAccounts]);

  useEffect(() => {
    localStorage.setItem('druk_dice_commission_total', houseCommissionTotal.toString());
  }, [houseCommissionTotal]);

  useEffect(() => {
    localStorage.setItem('druk_dice_commission_log', JSON.stringify(commissionLog));
  }, [commissionLog]);

  useEffect(() => {
    localStorage.setItem('druk_dice_weekly_play', JSON.stringify(weeklyPlayRecords));
  }, [weeklyPlayRecords]);

  // Rolling 7-day Weekly Limitation calculations (Nu. 7,000 maximum per week)
  const activeWeeklyRecords = weeklyPlayRecords.filter(
    (r) => Date.now() - r.timestamp < SEVEN_DAYS_MS
  );
  const weeklyStakedTotal = activeWeeklyRecords.reduce((sum, r) => sum + r.amount, 0);
  const weeklyRemaining = Math.max(0, WEEKLY_PLAY_LIMIT - weeklyStakedTotal);
  const isWeeklyLimitExceeded = weeklyStakedTotal + entryFee > WEEKLY_PLAY_LIMIT;

  const handleResetWeeklyLimit = () => {
    setWeeklyPlayRecords([]);
    showToast('Weekly play quota reset to full Nu. 7,000');
  };

  // Integrated Himalayan Sound Effects Hook (auto cues for rolling, winning, losing, match start)
  const {
    soundEnabled,
    toggleSound: handleToggleSound,
    playClick,
    playCoin: playCoinSound,
  } = useSoundEffects({
    isRolling,
    isMatchFinished,
    isMatchActive,
    isVictory: isMatchFinished && player1Score > player2Score,
    isDefeat: isMatchFinished && player2Score > player1Score,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Add / Link new Bhutanese Bank Account
  const handleAddAccount = (newAcc: BhutaneseBankAccount) => {
    setBankAccounts((prev) => {
      let updated = prev;
      if (newAcc.isDefault) {
        updated = updated.map((a) => ({ ...a, isDefault: false }));
      }
      return [newAcc, ...updated];
    });

    if (newAcc.isDefault) {
      setActiveAccount(newAcc);
    }
    showToast(`Linked ${newAcc.bankName} (${newAcc.appCode}) Acc #${newAcc.accountNumber}`);
  };

  // Switch Active Account
  const handleSelectAccount = (acc: BhutaneseBankAccount) => {
    setActiveAccount(acc);
    setBankAccounts((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === acc.id }))
    );
    showToast(`Active bank set to ${acc.bankName} #${acc.accountNumber}`);
  };

  // Add funds to wallet
  const handleAddFunds = (amount: number, description: string) => {
    setWalletBalance((prev) => prev + amount);
    setTransactions((prev) => [
      {
        id: 'tx_' + Date.now(),
        type: 'topup',
        amount,
        description,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ]);
    showToast(`Deposited +Nu. ${amount} via ${description}`);
  };

  // Reset wallet
  const handleResetBalance = () => {
    setWalletBalance(500);
    setTransactions((prev) => [
      {
        id: 'tx_' + Date.now(),
        type: 'topup',
        amount: 500,
        description: 'Wallet Reset to Standard Nu. 500',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ]);
    showToast('Banking Wallet reset to initial Nu. 500');
  };

  // Start New Match
  const startNewMatch = () => {
    // 1. Check Weekly Limitation of Nu. 7,000
    if (isWeeklyLimitExceeded) {
      showToast(
        `Weekly limit reached! Player can play at most Nu. 7,000 in a week. Remaining: Nu. ${weeklyRemaining}.`
      );
      setIsWeeklyLimitModalOpen(true);
      return;
    }

    if (walletBalance < entryFee) {
      showToast(`Insufficient balance in ${activeAccount.appCode}! Top-up to continue.`);
      setIsWalletOpen(true);
      return;
    }

    sounds.playCoinClink();

    // Deduct entry fee
    setWalletBalance((prev) => prev - entryFee);
    setTransactions((prev) => [
      {
        id: 'tx_' + Date.now(),
        type: 'stake',
        amount: entryFee,
        description: `Sho Stake via ${activeAccount.appCode} #${activeAccount.accountNumber}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ]);

    // Record stake towards the Nu. 7,000 weekly play quota
    const newWeeklyRecord: WeeklyPlayRecord = {
      id: 'wp_' + Date.now(),
      amount: entryFee,
      timestamp: Date.now(),
      opponent: gameMode === 'passPlay' ? 'Player 2' : selectedOpponent.name,
    };
    setWeeklyPlayRecords((prev) => [
      newWeeklyRecord,
      ...prev.filter((r) => Date.now() - r.timestamp < SEVEN_DAYS_MS),
    ]);

    const freshMatchId = 'M-' + Math.floor(1000 + Math.random() * 9000);
    setCurrentMatchId(freshMatchId);
    setCurrentMatchHash(generateSecuritySalt());

    setCurrentRound(1);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setP1Dice(1);
    setP2Dice(1);
    setP1Dice2(1);
    setP2Dice2(1);
    setRoundHistory([]);
    setIsMatchActive(true);
    setIsMatchFinished(false);
    setLastRoundNotice(null);
    setIsSuddenDeath(false);
    setSuddenDeathCount(0);
    setWasSuddenDeathWinner(false);
    setActiveTab('arena');
  };

  // Handler for Random Player Matchmaking
  const handleRandomMatchFound = (challenger: RandomChallenger) => {
    const opp: Opponent = {
      id: challenger.id,
      name: challenger.name,
      title: challenger.dzongkhag,
      avatarEmoji: challenger.avatarEmoji,
      difficulty: 'Medium',
      flavorText: `Random online player matched from ${challenger.dzongkhag}. Play style: ${challenger.playStyle}. Rating: ${challenger.rating} ⚡`,
      recommendedStake: entryFee,
      winRate: challenger.winRate,
    };
    setSelectedOpponent(opp);
    showToast(`Matched with ${challenger.name} from ${challenger.dzongkhag}!`);
    startNewMatch();
  };

  // Roll Round using CSPRNG with dynamic jitter (unguessable & unbiased)
  const rollRound = () => {
    if (!isMatchActive || isRolling || isMatchFinished) return;

    setIsRolling(true);
    setLastRoundNotice(null);
    sounds.playDiceShake();

    // High-entropy rapid jitter animation during cup shake (CSPRNG driven)
    let ticks = 0;
    const interval = setInterval(() => {
      setP1Dice(getSecureRandomDie(1, 6));
      setP2Dice(getSecureRandomDie(1, 6));
      if (gameMode === 'twoDice') {
        setP1Dice2(getSecureRandomDie(1, 6));
        setP2Dice2(getSecureRandomDie(1, 6));
      }
      ticks++;
      if (ticks >= 9) {
        clearInterval(interval);
      }
    }, 55);

    setTimeout(() => {
      clearInterval(interval);
      sounds.playDiceSlam();

      // Final unguessable, unbiased CSPRNG values via Web Crypto API with rejection sampling
      const newP1 = getSecureRandomDie(1, 6);
      const newP2 = getSecureRandomDie(1, 6);
      const newP1Second = getSecureRandomDie(1, 6);
      const newP2Second = getSecureRandomDie(1, 6);

      setP1Dice(newP1);
      setP2Dice(newP2);
      setP1Dice2(newP1Second);
      setP2Dice2(newP2Second);

      const p1ComparisonValue = gameMode === 'twoDice' ? newP1 + newP1Second : newP1;
      const p2ComparisonValue = gameMode === 'twoDice' ? newP2 + newP2Second : newP2;

      setIsRolling(false);

      // Compute Cryptographic SHA-256 Round Integrity Hash
      const entropySalt = generateSecuritySalt();
      computeRoundSecurityHash(
        currentMatchId,
        currentRound,
        p1ComparisonValue,
        p2ComparisonValue,
        Date.now(),
        entropySalt
      ).then((hash) => {
        setCurrentMatchHash(hash);
      });

      // Determine round winner
      let roundWinner: 'p1' | 'p2' | 'tie' = 'tie';
      if (p1ComparisonValue > p2ComparisonValue) {
        roundWinner = 'p1';
      } else if (p2ComparisonValue > p1ComparisonValue) {
        roundWinner = 'p2';
      }

      const updatedP1 = roundWinner === 'p1' ? player1Score + 1 : player1Score;
      const updatedP2 = roundWinner === 'p2' ? player2Score + 1 : player2Score;
      const isOvertime = currentRound > 5 || isSuddenDeath;

      let roundSummary = '';
      if (roundWinner === 'p1') {
        roundSummary = `${isOvertime ? 'Overtime R' : 'R'}${currentRound}: ${gameMode === 'passPlay' ? 'Player 1' : 'You'} Won (${p1ComparisonValue} vs ${p2ComparisonValue}) · [${updatedP1}/3 Wins]`;
        setLastRoundNotice(`Round ${currentRound}: ${gameMode === 'passPlay' ? 'Player 1' : 'You'} Won! (${updatedP1}/3 wins)`);
      } else if (roundWinner === 'p2') {
        roundSummary = `${isOvertime ? 'Overtime R' : 'R'}${currentRound}: ${gameMode === 'passPlay' ? 'Player 2' : selectedOpponent.name} Won (${p2ComparisonValue} vs ${p1ComparisonValue}) · [${updatedP2}/3 Wins]`;
        setLastRoundNotice(`Round ${currentRound}: ${gameMode === 'passPlay' ? 'Player 2' : selectedOpponent.name} Won! (${updatedP2}/3 wins)`);
      } else {
        roundSummary = `${isOvertime ? 'Overtime R' : 'R'}${currentRound}: Tie (${p1ComparisonValue} vs ${p2ComparisonValue})`;
        setLastRoundNotice(`Round ${currentRound}: Even Tie!`);
      }

      setRoundHistory((prev) => [
        ...prev,
        {
          round: currentRound,
          p1Dice: newP1,
          p2Dice: newP2,
          p1Total: p1ComparisonValue,
          p2Total: p2ComparisonValue,
          winner: roundWinner,
          summaryText: roundSummary,
        },
      ]);

      // VICTORY RULE: Player must at least win 3 rolls!
      if (updatedP1 >= 3) {
        // Player 1 claims 3 roll wins and secures match victory!
        setPlayer1Score(updatedP1);
        setWasSuddenDeathWinner(isOvertime);
        finishMatch(updatedP1, updatedP2, isOvertime);
        return;
      }

      if (updatedP2 >= 3) {
        // Opponent claims 3 roll wins and secures match victory!
        setPlayer2Score(updatedP2);
        setWasSuddenDeathWinner(false);
        finishMatch(updatedP1, updatedP2, isOvertime);
        return;
      }

      // Neither player has reached 3 wins yet:
      if (roundWinner === 'p1') setPlayer1Score(updatedP1);
      if (roundWinner === 'p2') setPlayer2Score(updatedP2);

      // Check if after Round 5 neither has reached 3 wins (due to tie rounds: e.g. 2-2, 2-1, 1-1):
      if (currentRound >= 5) {
        setIsSuddenDeath(true);
        setSuddenDeathCount((prev) => prev + 1);
        setCurrentRound((prev) => prev + 1);
        setLastRoundNotice(`⚡ Round 5 concluded without 3 wins! Overtime active: Player must win at least 3 rolls to claim match! (${updatedP1}/3 vs ${updatedP2}/3)`);
        showToast('Must win at least 3 rolls! Overtime round activated.');
        sounds.playWinChime();
      } else {
        setCurrentRound((prev) => prev + 1);
      }
    }, 650);
  };

  // Finish match logic:
  // All 5% commission routes to user's BOB Acc No. 130174063!
  const finishMatch = (finalP1Score: number, finalP2Score: number, wasSuddenDeathOutcome = false) => {
    setIsMatchFinished(true);
    setIsMatchActive(false);
    setIsSuddenDeath(false);
    setWasSuddenDeathWinner(wasSuddenDeathOutcome);

    const commissionAmount = Math.round(totalPot * 0.05);

    if (finalP1Score > finalP2Score) {
      const winnings = Math.round(totalPot * 0.95); // 95% to winner
      setWalletBalance((prev) => prev + winnings);
      sounds.playWinChime();

      // Record player payout to their linked Bhutanese bank
      setTransactions((prev) => [
        {
          id: 'tx_' + Date.now(),
          type: 'win',
          amount: winnings,
          description: `Victory Payout credited to ${activeAccount.appCode} #${activeAccount.accountNumber}${wasSuddenDeathOutcome ? ' (Sudden Death)' : ''}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev,
      ]);

      // Route 5% commission into user's BOB Acc No. 130174063
      setHouseCommissionTotal((prev) => prev + commissionAmount);
      setCommissionLog((prev) => [
        {
          id: 'com_' + Date.now(),
          matchId: 'M-' + Math.floor(1000 + Math.random() * 9000),
          totalPot,
          commissionAmount,
          winnerName: activeAccount.accountHolder,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev,
      ]);
    } else if (finalP2Score > finalP1Score) {
      sounds.playLossSound();

      // Commission is still collected and routed to BOB Acc No. 130174063
      setHouseCommissionTotal((prev) => prev + commissionAmount);
      setCommissionLog((prev) => [
        {
          id: 'com_' + Date.now(),
          matchId: 'M-' + Math.floor(1000 + Math.random() * 9000),
          totalPot,
          commissionAmount,
          winnerName: gameMode === 'passPlay' ? 'Player 2' : selectedOpponent.name,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev,
      ]);
    } else {
      // Draw fallback: return entry fee
      setWalletBalance((prev) => prev + entryFee);
      setTransactions((prev) => [
        {
          id: 'tx_' + Date.now(),
          type: 'topup',
          amount: entryFee,
          description: `Draw Refund credited to ${activeAccount.appCode} #${activeAccount.accountNumber}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev,
      ]);
    }
  };

  const calculatedWinnings = Math.round(totalPot * 0.95);

  return (
    <div className="min-h-screen bg-[#1E1005] text-[#F5EDE0] flex flex-col font-sans relative selection:bg-amber-600 selection:text-white pb-12">
      {/* Top Bar Contract (3 zones) */}
      <Header
        walletBalance={walletBalance}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenTradition={() => setIsTraditionOpen(true)}
        onOpenCommissionVault={() => setIsCommissionVaultOpen(true)}
        onOpenAddBank={() => setIsAddBankOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeAccount={activeAccount}
        houseCommissionTotal={houseCommissionTotal}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-3.5 bg-amber-950/95 border border-amber-600/80 text-amber-100 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 w-full pt-6 flex-1 flex flex-col">
        {activeTab === 'opponents' ? (
          <OpponentsView
            selectedOpponent={selectedOpponent}
            onSelectOpponent={(opp) => {
              setSelectedOpponent(opp);
              setEntryFee(opp.recommendedStake);
            }}
            onChallenge={(opp) => {
              setSelectedOpponent(opp);
              setEntryFee(opp.recommendedStake);
              startNewMatch();
            }}
            isMatchActive={isMatchActive}
          />
        ) : activeTab === 'history' ? (
          <RoundHistoryView
            roundHistory={roundHistory}
            isMatchActive={isMatchActive}
            currentRound={currentRound}
          />
        ) : (
          /* ARENA TAB */
          <div className="space-y-5 flex-1 flex flex-col justify-between">
            {/* Top Match Controls & Stake Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Card 1: Entry Fee / Stake Selection (Flutter Dropdown & Quick Stakes) */}
              <div className="p-4 rounded-xl bg-[#2C1B0E] border border-amber-900/60 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider text-amber-300/80 font-semibold flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    Select Stake Fee
                  </span>
                  <span className="text-xs text-stone-400">
                    Pot: <strong className="text-amber-300">Nu. {totalPot}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {[20, 50, 100, 200, 500].map((fee) => (
                    <button
                      key={fee}
                      onClick={() => !isMatchActive && setEntryFee(fee)}
                      disabled={isMatchActive}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        entryFee === fee
                          ? 'bg-amber-500 text-black border-amber-400 shadow-sm'
                          : 'bg-[#1E1005] text-amber-200/80 border-amber-950 hover:border-amber-700/60'
                      } ${isMatchActive ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {fee}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card 2: Match Format & Dzongkha Display Switcher */}
              <div className="p-4 rounded-xl bg-[#2C1B0E] border border-amber-900/60 shadow-md flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-amber-300/80 font-semibold block mb-1">
                    Game Variant
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => !isMatchActive && setGameMode('standard')}
                      disabled={isMatchActive}
                      className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                        gameMode === 'standard'
                          ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      Classic 1-Die
                    </button>
                    <button
                      onClick={() => !isMatchActive && setGameMode('twoDice')}
                      disabled={isMatchActive}
                      className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                        gameMode === 'twoDice'
                          ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      2-Dice Sho
                    </button>
                    <button
                      onClick={() => !isMatchActive && setGameMode('passPlay')}
                      disabled={isMatchActive}
                      className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                        gameMode === 'passPlay'
                          ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      2-Player
                    </button>
                  </div>
                </div>

                <div className="border-l border-amber-900/40 pl-3 text-right">
                  <span className="text-[11px] text-stone-400 block mb-1">Pips / Script</span>
                  <button
                    onClick={() => setShowDzongkhaDigits(!showDzongkhaDigits)}
                    className="px-2 py-1 text-xs bg-[#1E1005] hover:bg-[#341C0A] border border-amber-900/60 rounded text-amber-300 font-tibetan cursor-pointer"
                  >
                    {showDzongkhaDigits ? 'Dzongkha ༡༢༣' : 'Classic Pips'}
                  </button>
                </div>
              </div>

              {/* Card 3: Opponent Spotlight */}
              <div className="p-4 rounded-xl bg-[#2C1B0E] border border-amber-900/60 shadow-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-xl">
                    {gameMode === 'passPlay' ? '👥' : selectedOpponent.avatarEmoji}
                  </div>
                  <div>
                    <span className="text-xs text-amber-400/80 font-medium block">
                      {gameMode === 'passPlay' ? 'Local Duel' : 'Challenger'}
                    </span>
                    <span className="font-bold text-amber-100 text-sm block">
                      {gameMode === 'passPlay' ? 'Pass & Play (P2)' : selectedOpponent.name}
                    </span>
                  </div>
                </div>
                {gameMode !== 'passPlay' && (
                  <button
                    onClick={() => setActiveTab('opponents')}
                    disabled={isMatchActive}
                    className="text-xs text-amber-400 hover:text-amber-200 underline cursor-pointer disabled:opacity-50"
                  >
                    Change
                  </button>
                )}
              </div>
            </div>

            {/* Active Player Bhutanese Bank Bar (Clean, no commission target displayed) */}
            <div className="p-3.5 rounded-xl bg-[#241306] border border-amber-900/50 flex items-center justify-between text-xs shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">
                    Your Linked Bhutanese Bank Account (for 95% Winnings):
                  </span>
                  <span className="font-semibold text-amber-100">
                    {activeAccount.bankName} · {activeAccount.accountNumber} ({activeAccount.appCode})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsAddBankOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#361E0E] hover:bg-[#482813] border border-amber-700/50 text-[11px] text-amber-300 font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Link / Switch Bank</span>
              </button>
            </div>

            {/* Weekly Responsible Play Quota Widget (Nu. 7,000 Limitation) */}
            <div
              onClick={() => setIsWeeklyLimitModalOpen(true)}
              className="p-3 px-4 rounded-xl bg-gradient-to-r from-[#2A1608] to-[#1E0F05] border border-amber-800/60 hover:border-amber-600/70 transition-all flex items-center justify-between cursor-pointer group shadow-sm text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isWeeklyLimitExceeded
                      ? 'bg-rose-950/70 text-rose-400 border border-rose-700/60'
                      : 'bg-amber-950/70 text-amber-400 border border-amber-700/50'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-amber-100">
                      Weekly Play Quota: Nu. {weeklyStakedTotal.toLocaleString()} / Nu.{' '}
                      {WEEKLY_PLAY_LIMIT.toLocaleString()}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        isWeeklyLimitExceeded
                          ? 'bg-rose-900/60 text-rose-300 border border-rose-700/50'
                          : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                      }`}
                    >
                      {weeklyRemaining > 0 ? `Nu. ${weeklyRemaining.toLocaleString()} left` : 'Limit Reached'}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    Player limitation: Maximum Nu. 7,000 in a 7-day week
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-16 sm:w-28 h-2 rounded-full bg-[#120803] border border-amber-950 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isWeeklyLimitExceeded
                        ? 'bg-rose-500'
                        : weeklyStakedTotal >= 5500
                        ? 'bg-amber-400'
                        : 'bg-emerald-500'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((weeklyStakedTotal / WEEKLY_PLAY_LIMIT) * 100)
                      )}%`,
                    }}
                  />
                </div>
                <span className="text-[11px] text-amber-400/90 font-medium group-hover:underline">
                  Quota
                </span>
              </div>
            </div>

            {/* Warning if weekly limit reached and match is idle */}
            {isWeeklyLimitExceeded && !isMatchActive && (
              <div
                onClick={() => setIsWeeklyLimitModalOpen(true)}
                className="p-3 rounded-xl bg-rose-950/70 border border-rose-600/70 text-rose-200 text-xs flex items-center justify-between cursor-pointer hover:bg-rose-950/90 transition-colors animate-pulse"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    <strong>Weekly Limitation Active:</strong> You have staked Nu.{' '}
                    {weeklyStakedTotal.toLocaleString()} of your Nu.{' '}
                    {WEEKLY_PLAY_LIMIT.toLocaleString()} weekly limit. Play is locked until quota releases.
                  </span>
                </div>
                <span className="text-[11px] font-bold underline shrink-0 ml-2">View Quota</span>
              </div>
            )}

            {/* Match HUD Card (Faithful to Flutter Widget) */}
            <div className="p-5 rounded-2xl bg-[#3E2723] border border-amber-700/40 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <span className="font-tibetan text-9xl text-amber-200">ཤོ</span>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                {/* Pot Banner */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
                    Total Match Pot:
                  </span>
                  <span className="font-cinzel text-xl sm:text-2xl font-black text-amber-300">
                    Nu. {totalPot}
                  </span>
                </div>

                {/* Round Indicator or Sudden Death Banner */}
                {isSuddenDeath || currentRound > 5 ? (
                  <div className="mb-3 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600/40 via-amber-500/20 to-amber-600/40 border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)] text-center animate-pulse">
                    <span className="font-cinzel text-xs sm:text-sm font-black text-amber-200 tracking-wider flex items-center justify-center gap-1.5">
                      <span>⚡ OVERTIME: MUST WIN AT LEAST 3 ROLLS</span>
                    </span>
                    <span className="text-[11px] text-amber-300 font-tibetan block mt-0.5">
                      ཐག་གཅོད་ ཤོ་རིལ · Round {currentRound} · Race to 3 roll wins ({player1Score}/3 vs {player2Score}/3)!
                    </span>
                  </div>
                ) : (
                  <div className="text-sm font-bold text-amber-100/90 mb-4 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-900/60 border border-amber-600/40 text-xs">
                      Round {currentRound} / 5 · Must Win 3 Rolls
                    </span>
                    {lastRoundNotice && (
                      <span className="text-xs text-amber-300 font-normal">
                        · {lastRoundNotice}
                      </span>
                    )}
                  </div>
                )}

                {/* P1 vs P2 Scores & 3-Win Target Indicators */}
                <div className="w-full max-w-md flex items-center justify-around py-3 px-4 rounded-xl bg-[#241306]/80 border border-amber-900/60">
                  <div className="text-center flex flex-col items-center">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-0.5">
                      {gameMode === 'passPlay' ? 'Player 1' : 'You (P1)'}
                    </span>
                    <span className="text-4xl sm:text-5xl font-extrabold text-emerald-400 font-cinzel tabular-nums">
                      {player1Score}
                    </span>
                    {/* 3-Roll Win Pips */}
                    <div className="flex items-center gap-1.5 mt-1.5" title={`${player1Score} of 3 wins needed`}>
                      {[1, 2, 3].map((slot) => (
                        <span
                          key={slot}
                          className={`w-2.5 h-2.5 rounded-full border transition-all ${
                            player1Score >= slot
                              ? 'bg-emerald-400 border-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.8)] scale-110'
                              : 'bg-emerald-950/40 border-emerald-800/50'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-emerald-400/80 font-mono mt-0.5">
                      {player1Score}/3 Wins
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-xl font-cinzel font-black text-stone-400">VS</span>
                    <span className="text-[10px] text-amber-300 font-mono font-bold tracking-wider uppercase mt-0.5">
                      Target 3 Wins
                    </span>
                    <span className="text-[9px] text-stone-400 font-mono">
                      {currentRound <= 5 ? `Best of 5` : `Overtime R${currentRound}`}
                    </span>
                  </div>

                  <div className="text-center flex flex-col items-center">
                    <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider block mb-0.5">
                      {gameMode === 'passPlay' ? 'Player 2' : `${selectedOpponent.name.split(' ')[0]} (P2)`}
                    </span>
                    <span className="text-4xl sm:text-5xl font-extrabold text-orange-400 font-cinzel tabular-nums">
                      {player2Score}
                    </span>
                    {/* 3-Roll Win Pips */}
                    <div className="flex items-center gap-1.5 mt-1.5" title={`${player2Score} of 3 wins needed`}>
                      {[1, 2, 3].map((slot) => (
                        <span
                          key={slot}
                          className={`w-2.5 h-2.5 rounded-full border transition-all ${
                            player2Score >= slot
                              ? 'bg-orange-400 border-orange-300 shadow-[0_0_8px_rgba(251,146,60,0.8)] scale-110'
                              : 'bg-orange-950/40 border-orange-800/50'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-orange-400/80 font-mono mt-0.5">
                      {player2Score}/3 Wins
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dice Arena (Felt Mat & Rolling Stage) */}
            <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#2A170A] to-[#1C0E04] border-2 border-[#5C3A1E] shadow-2xl flex flex-col items-center justify-center min-h-[260px] overflow-hidden">
              {/* Background table felt texture overlay */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center"
                style={{ backgroundImage: `url(${diceFeltImg})` }}
              />

              {/* Auspicious Tibetan Dragon Crest Emblem Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <img
                  src={dragonCrestImg}
                  alt="Druk Thunder Dragon"
                  className="w-64 h-64 object-contain rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Dice Display Arena */}
              <div className="relative z-10 w-full flex items-center justify-around gap-4 sm:gap-8">
                {/* P1 Dice Box */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-3">
                    <Dice
                      value={p1Dice}
                      isRolling={isRolling}
                      showDzongkhaNum={showDzongkhaDigits}
                      label={gameMode === 'passPlay' ? 'Player 1' : 'You'}
                      isWinner={!isRolling && p1Dice > p2Dice}
                    />
                    {gameMode === 'twoDice' && (
                      <Dice
                        value={p1Dice2}
                        isRolling={isRolling}
                        showDzongkhaNum={showDzongkhaDigits}
                        size="md"
                      />
                    )}
                  </div>
                  {gameMode === 'twoDice' && !isRolling && (
                    <span className="mt-1 text-xs font-bold text-amber-300 font-cinzel">
                      Total: {p1Dice + p1Dice2} · {TWO_DICE_CALLS[p1Dice + p1Dice2]?.name || ''}
                    </span>
                  )}
                </div>

                {/* Traditional Sho Cup Icon / Shaker graphic in center */}
                <div className="hidden sm:flex flex-col items-center justify-center text-amber-500/40">
                  <div
                    className={`w-14 h-14 rounded-2xl border border-amber-700/50 bg-[#361E0E]/80 flex items-center justify-center shadow-lg transition-transform ${
                      isRolling ? 'animate-dice-shake' : ''
                    }`}
                  >
                    <span className="font-tibetan text-2xl text-amber-300">ཤོ</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400/60 mt-1">
                    Sho-Para
                  </span>
                </div>

                {/* P2 Opponent Dice Box */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-3">
                    <Dice
                      value={p2Dice}
                      isRolling={isRolling}
                      showDzongkhaNum={showDzongkhaDigits}
                      label={gameMode === 'passPlay' ? 'Player 2' : selectedOpponent.name.split(' ')[0]}
                      isWinner={!isRolling && p2Dice > p1Dice}
                    />
                    {gameMode === 'twoDice' && (
                      <Dice
                        value={p2Dice2}
                        isRolling={isRolling}
                        showDzongkhaNum={showDzongkhaDigits}
                        size="md"
                      />
                    )}
                  </div>
                  {gameMode === 'twoDice' && !isRolling && (
                    <span className="mt-1 text-xs font-bold text-amber-300 font-cinzel">
                      Total: {p2Dice + p2Dice2} · {TWO_DICE_CALLS[p2Dice + p2Dice2]?.name || ''}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Action Area (Faithful to Flutter buttons) */}
            <div className="space-y-3">
              {!isMatchActive ? (
                <button
                  onClick={startNewMatch}
                  className={`w-full h-14 rounded-xl font-cinzel font-black text-sm sm:text-base tracking-wide shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isWeeklyLimitExceeded
                      ? 'bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 border-2 border-rose-600/80 text-rose-200 hover:border-rose-400 animate-pulse'
                      : 'bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-black hover:shadow-amber-500/20'
                  }`}
                >
                  {isWeeklyLimitExceeded ? (
                    <>
                      <ShieldAlert className="w-5 h-5 text-rose-400" />
                      <span>WEEKLY LIMIT REACHED (NU. {weeklyRemaining} REMAINING)</span>
                    </>
                  ) : (
                    <>
                      <Swords className="w-5 h-5" />
                      <span>PAY NU. {entryFee} & START MATCH (MUST WIN 3 ROLLS)</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={rollRound}
                  disabled={isRolling}
                  className={`w-full h-14 rounded-xl font-cinzel font-black text-sm sm:text-base tracking-wide shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isRolling
                      ? 'bg-amber-900/60 text-amber-300/60 cursor-wait'
                      : player1Score === 2 && player2Score === 2
                      ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black border-2 border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.6)] animate-pulse'
                      : player1Score === 2
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-pulse'
                      : isSuddenDeath || currentRound > 5
                      ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white hover:shadow-emerald-600/30'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  <span>
                    {isRolling
                      ? 'Rolling Bone Dice (CSPRNG)...'
                      : player1Score === 2 && player2Score === 2
                      ? '⚡ ROLL MATCH POINT (2-2 DEADLOCK · NEXT WIN WINS POT!)'
                      : player1Score === 2
                      ? '⚡ ROLL FOR MATCH VICTORY (CLAIM 3RD WIN!)'
                      : player2Score === 2
                      ? '⚠️ DEFEND MATCH POINT (OPPONENT AT 2/3 WINS)'
                      : currentRound > 5 || isSuddenDeath
                      ? `⚡ ROLL OVERTIME ROUND ${currentRound} (MUST REACH 3 WINS)`
                      : `ROLL DICE FOR ROUND ${currentRound} (FIRST TO 3 WINS)`}
                  </span>
                </button>
              )}

              {/* Cryptographic Randomness & Fairness Assurance */}
              <div className="flex items-center justify-between text-[11px] text-amber-300/80 px-1 pt-1 border-t border-amber-950/60">
                <span className="flex items-center gap-1 font-mono">
                  <span>🔒 CSPRNG Randomness: Web Crypto API (Unbiased Rejection Sampling)</span>
                </span>
                <span className="text-stone-400">
                  Target: 3 Wins Needed
                </span>
              </div>

              {/* Status footer with quick actions */}
              <div className="flex items-center justify-between text-xs text-amber-200/60 px-1">
                <span>
                  {isMatchActive
                    ? isSuddenDeath || currentRound > 5
                      ? `⚡ Overtime in progress · Round ${currentRound} · Race to 3 wins!`
                      : `Match in progress · Round ${currentRound} of 5 · Race to 3 wins`
                    : `Ready to roll against ${selectedOpponent.name}`}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('history')}
                    className="hover:text-amber-300 underline cursor-pointer"
                  >
                    View Round Log ({roundHistory.length})
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => setIsWeeklyLimitModalOpen(true)}
                    className="hover:text-amber-300 underline cursor-pointer text-amber-400/90"
                    title="View Nu. 7,000 weekly play limit quota and history"
                  >
                    Weekly Limit (Nu. {weeklyStakedTotal}/7k)
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => setIsWalletOpen(true)}
                    className="hover:text-amber-300 underline cursor-pointer"
                  >
                    Banking Wallet
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Match Finished Dialog with Confetti effect & BOB Account Commission */}
      <MatchSummaryModal
        isOpen={isMatchFinished}
        onPlayAgain={startNewMatch}
        onClose={() => setIsMatchFinished(false)}
        player1Score={player1Score}
        player2Score={player2Score}
        entryFee={entryFee}
        totalPot={totalPot}
        winnings={calculatedWinnings}
        opponent={selectedOpponent}
        playerAccount={activeAccount}
        isTwoPlayerLocal={gameMode === 'passPlay'}
        wasSuddenDeath={wasSuddenDeathWinner}
      />

      {/* Wallet Modal */}
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        balance={walletBalance}
        transactions={transactions}
        onAddFunds={handleAddFunds}
        onResetBalance={handleResetBalance}
        bankAccounts={bankAccounts}
        activeAccount={activeAccount}
        onSelectAccount={handleSelectAccount}
        onOpenAddBank={() => setIsAddBankOpen(true)}
        onOpenCommissionVault={() => setIsCommissionVaultOpen(true)}
        houseCommissionTotal={houseCommissionTotal}
        weeklyLimit={WEEKLY_PLAY_LIMIT}
        weeklyStaked={weeklyStakedTotal}
        weeklyRemaining={weeklyRemaining}
        onOpenWeeklyLimit={() => {
          setIsWalletOpen(false);
          setIsWeeklyLimitModalOpen(true);
        }}
      />

      {/* Weekly Play Limitation Modal (Nu. 7,000 Ceiling) */}
      <WeeklyLimitModal
        isOpen={isWeeklyLimitModalOpen}
        onClose={() => setIsWeeklyLimitModalOpen(false)}
        weeklyLimit={WEEKLY_PLAY_LIMIT}
        weeklyStaked={weeklyStakedTotal}
        weeklyRemaining={weeklyRemaining}
        records={activeWeeklyRecords}
        onResetWeeklyLimit={handleResetWeeklyLimit}
        entryFee={entryFee}
      />

      {/* Add / Link Bhutanese Bank Account Modal */}
      <AddBankModal
        isOpen={isAddBankOpen}
        onClose={() => setIsAddBankOpen(false)}
        onAddAccount={handleAddAccount}
      />

      {/* House Commission Treasury Modal (BOB Acc No. 130174063) */}
      <HouseCommissionModal
        isOpen={isCommissionVaultOpen}
        onClose={() => setIsCommissionVaultOpen(false)}
        commissionTotal={houseCommissionTotal}
        commissionLog={commissionLog}
      />

      {/* Tradition & Cultural Rules Modal */}
      <TraditionModal
        isOpen={isTraditionOpen}
        onClose={() => setIsTraditionOpen(false)}
      />
    </div>
  );
}
