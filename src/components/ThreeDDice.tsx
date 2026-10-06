import React, { useEffect, useState } from 'react';

interface ThreeDDiceProps {
  value: number;
  isRolling: boolean;
  size?: number; // default 76px
  showDzongkha?: boolean;
  colorScheme?: 'ivory' | 'ebony' | 'crimson';
}

const DZONGKHA_NUMERALS: Record<number, string> = {
  1: '༡',
  2: '༢',
  3: '༣',
  4: '༤',
  5: '༥',
  6: '༦',
};

// Target angles to present face towards viewer (facing +Z)
const FACE_ROTATIONS: Record<number, { x: number; y: number }> = {
  1: { x: 0, y: 0 },
  6: { x: 0, y: 180 },
  2: { x: 0, y: -90 },
  5: { x: 0, y: 90 },
  3: { x: -90, y: 0 },
  4: { x: 90, y: 0 },
};

export const ThreeDDice: React.FC<ThreeDDiceProps> = ({
  value,
  isRolling,
  size = 72,
  showDzongkha = false,
  colorScheme = 'ivory',
}) => {
  const [rotations, setRotations] = useState<{ x: number; y: number; z: number }>({
    x: 0,
    y: 0,
    z: 0,
  });

  const half = size / 2;

  useEffect(() => {
    if (isRolling) {
      // Generate tumbling spins while rolling
      const interval = setInterval(() => {
        setRotations({
          x: Math.floor(Math.random() * 360 * 3) - 360,
          y: Math.floor(Math.random() * 360 * 3) - 360,
          z: Math.floor(Math.random() * 90) - 45,
        });
      }, 70);
      return () => clearInterval(interval);
    } else {
      // Settle on the exact face corresponding to the rolled value
      const target = FACE_ROTATIONS[value] || FACE_ROTATIONS[1];
      // Add extra full turns for natural settle physics
      setRotations({
        x: target.x,
        y: target.y,
        z: 0,
      });
    }
  }, [isRolling, value]);

  // Render authentic pips
  const renderPips = (val: number) => {
    if (showDzongkha) {
      return (
        <span
          className={`font-tibetan font-bold select-none leading-none ${
            val === 1 || val === 4 ? 'text-red-700' : 'text-stone-900'
          }`}
          style={{ fontSize: size * 0.44 }}
        >
          {DZONGKHA_NUMERALS[val]}
        </span>
      );
    }

    const isRed = val === 1 || val === 4;
    const pipColor = isRed
      ? 'bg-gradient-to-br from-red-600 to-red-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]'
      : 'bg-gradient-to-br from-stone-800 to-black shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]';

    const pipSize = size * 0.16;

    switch (val) {
      case 1:
        return (
          <div
            className={`rounded-full ${pipColor}`}
            style={{ width: size * 0.28, height: size * 0.28 }}
          />
        );
      case 2:
        return (
          <div className="w-full h-full p-2.5 flex flex-col justify-between">
            <div className="flex justify-start">
              <div className={`rounded-full ${pipColor}`} style={{ width: pipSize, height: pipSize }} />
            </div>
            <div className="flex justify-end">
              <div className={`rounded-full ${pipColor}`} style={{ width: pipSize, height: pipSize }} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full p-2.5 flex flex-col justify-between">
            <div className="flex justify-start">
              <div className={`rounded-full ${pipColor}`} style={{ width: pipSize, height: pipSize }} />
            </div>
            <div className="flex justify-center">
              <div className={`rounded-full ${pipColor}`} style={{ width: pipSize, height: pipSize }} />
            </div>
            <div className="flex justify-end">
              <div className={`rounded-full ${pipColor}`} style={{ width: pipSize, height: pipSize }} />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full p-2.5 flex flex-col justify-between">
            <div className="flex justify-between">
              <div className={`rounded-full ${pipColor}`} style={{ width: pipSize, height: pipSize }} />
              <div className={`rounded-full ${pipColor}`} style={{ width: pipSize, height: pipSize }} />
            </div>
            <div className="flex justify-between">
              <div className={`rounded-full ${pipColor}`} style={{ width: pipSize, height: pipSize }} />
              <div className={`rounded-full ${pipColor}`} style={{ width: pipSize, height: pipSize }} />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full p-2.5 flex flex-col justify-between">
            <div className="flex justify-between">
              <div className={`rounded-full ${pipColor}`} style={{ width: pipSize, height: pipSize }} />
              <div className={`rounded-full ${pipColor}`} style={{ width: pipSize, height: pipSize }} />
            </div>
            <div className="flex justify-center">
              <div className={`rounded-full ${pipColor}`} style={{ width: pipSize, height: pipSize }} />
            </div>
            <div className="flex justify-between">
              <div className={`rounded-full ${pipColor}`} style={{ width: pipSize, height: pipSize }} />
              <div className={`rounded-full ${pipColor}`} style={{ width: pipSize, height: pipSize }} />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="w-full h-full p-2 flex flex-col justify-between">
            <div className="flex justify-between">
              <div className={`rounded-full ${pipColor}`} style={{ width: pipSize, height: pipSize }} />
              <div className={`rounded-full ${pipColor}`} style={{ width: pipSize, height: pipSize }} />
            </div>
            <div className="flex justify-between">
              <div className={`rounded-full ${pipColor}`} style={{ width: pipSize, height: pipSize }} />
              <div className={`rounded-full ${pipColor}`} style={{ width: pipSize, height: pipSize }} />
            </div>
            <div className="flex justify-between">
              <div className={`rounded-full ${pipColor}`} style={{ width: pipSize, height: pipSize }} />
              <div className={`rounded-full ${pipColor}`} style={{ width: pipSize, height: pipSize }} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Base texture styles
  const faceBaseStyle =
    colorScheme === 'ivory'
      ? 'bg-gradient-to-br from-[#FFFDF9] via-[#FAF4E6] to-[#EAE0CA] border border-amber-900/30'
      : 'bg-gradient-to-br from-[#2E1D13] to-[#1A0E06] border border-amber-600/40 text-amber-200';

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{
        width: size + 24,
        height: size + 24,
        perspective: '750px',
      }}
    >
      {/* Dynamic 3D Drop Shadow on Felt */}
      <div
        className={`absolute bottom-1 w-14 h-4 bg-black/60 rounded-full blur-[4px] transition-all duration-300 pointer-events-none ${
          isRolling ? 'scale-75 opacity-40' : 'scale-110 opacity-70'
        }`}
      />

      {/* 3D Rotating Cube Container */}
      <div
        className={`relative transition-transform duration-${isRolling ? '100' : '500'}`}
        style={{
          width: size,
          height: size,
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotations.x}deg) rotateY(${rotations.y}deg) rotateZ(${rotations.z}deg)`,
          transitionTimingFunction: isRolling ? 'linear' : 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        {/* Face 1: Front */}
        <div
          className={`absolute inset-0 rounded-xl shadow-inner flex items-center justify-center ${faceBaseStyle}`}
          style={{ transform: `translateZ(${half}px)` }}
        >
          {renderPips(1)}
        </div>

        {/* Face 6: Back */}
        <div
          className={`absolute inset-0 rounded-xl shadow-inner flex items-center justify-center ${faceBaseStyle}`}
          style={{ transform: `rotateY(180deg) translateZ(${half}px)` }}
        >
          {renderPips(6)}
        </div>

        {/* Face 2: Right */}
        <div
          className={`absolute inset-0 rounded-xl shadow-inner flex items-center justify-center ${faceBaseStyle}`}
          style={{ transform: `rotateY(90deg) translateZ(${half}px)` }}
        >
          {renderPips(2)}
        </div>

        {/* Face 5: Left */}
        <div
          className={`absolute inset-0 rounded-xl shadow-inner flex items-center justify-center ${faceBaseStyle}`}
          style={{ transform: `rotateY(-90deg) translateZ(${half}px)` }}
        >
          {renderPips(5)}
        </div>

        {/* Face 3: Top */}
        <div
          className={`absolute inset-0 rounded-xl shadow-inner flex items-center justify-center ${faceBaseStyle}`}
          style={{ transform: `rotateX(90deg) translateZ(${half}px)` }}
        >
          {renderPips(3)}
        </div>

        {/* Face 4: Bottom */}
        <div
          className={`absolute inset-0 rounded-xl shadow-inner flex items-center justify-center ${faceBaseStyle}`}
          style={{ transform: `rotateX(-90deg) translateZ(${half}px)` }}
        >
          {renderPips(4)}
        </div>
      </div>
    </div>
  );
};
