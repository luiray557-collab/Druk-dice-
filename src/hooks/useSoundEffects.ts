import { useEffect, useRef, useState, useCallback } from 'react';
import { sounds } from '../utils/audio';

interface UseSoundEffectsOptions {
  isRolling: boolean;
  isMatchFinished: boolean;
  isMatchActive: boolean;
  isVictory?: boolean;
  isDefeat?: boolean;
  initialSoundEnabled?: boolean;
}

export function useSoundEffects({
  isRolling,
  isMatchFinished,
  isMatchActive,
  isVictory = false,
  isDefeat = false,
  initialSoundEnabled = true,
}: UseSoundEffectsOptions) {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(initialSoundEnabled);

  // Synchronization with singleton
  useEffect(() => {
    sounds.enabled = soundEnabled;
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      sounds.enabled = next;
      return next;
    });
  }, []);

  // Previous states tracking to detect true transitions
  const prevRollingRef = useRef<boolean>(isRolling);
  const prevMatchFinishedRef = useRef<boolean>(isMatchFinished);
  const prevMatchActiveRef = useRef<boolean>(isMatchActive);

  // 1. Audio cue for rolling (cup shake) and completion (slam)
  useEffect(() => {
    if (!prevRollingRef.current && isRolling) {
      // Transitioned to rolling -> play dice shake
      sounds.playDiceShake();
    } else if (prevRollingRef.current && !isRolling) {
      // Transitioned from rolling to settled -> play heavy wooden mat slam
      sounds.playDiceSlam();
    }
    prevRollingRef.current = isRolling;
  }, [isRolling]);

  // 2. Audio cue for match completion (victory chime or defeat gong)
  useEffect(() => {
    if (!prevMatchFinishedRef.current && isMatchFinished) {
      if (isVictory) {
        sounds.playWinChime();
      } else if (isDefeat) {
        sounds.playLossSound();
      }
    }
    prevMatchFinishedRef.current = isMatchFinished;
  }, [isMatchFinished, isVictory, isDefeat]);

  // 3. Audio cue for match start event (temple bell & staking coins)
  useEffect(() => {
    if (!prevMatchActiveRef.current && isMatchActive) {
      sounds.playMatchStart();
    }
    prevMatchActiveRef.current = isMatchActive;
  }, [isMatchActive]);

  return {
    soundEnabled,
    toggleSound,
    playRoll: () => sounds.playDiceShake(),
    playSlam: () => sounds.playDiceSlam(),
    playVictory: () => sounds.playWinChime(),
    playDefeat: () => sounds.playLossSound(),
    playMatchStart: () => sounds.playMatchStart(),
    playRoundWin: () => sounds.playRoundWin(),
    playCoin: () => sounds.playCoinClink(),
    playClick: () => sounds.playClick(),
  };
}
