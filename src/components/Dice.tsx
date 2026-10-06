import React from 'react';
import { SHO_CALLS } from '../data/shoTradition';
import { ThreeDDice } from './ThreeDDice';

interface DiceProps {
  value: number;
  isRolling: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDzongkhaNum?: boolean;
  label?: string;
  sublabel?: string;
  isWinner?: boolean;
  is3D?: boolean;
}

export const Dice: React.FC<DiceProps> = ({
  value,
  isRolling,
  size = 'lg',
  showDzongkhaNum = false,
  label,
  sublabel,
  isWinner = false,
  is3D = true,
}) => {
  const call = SHO_CALLS[value] || SHO_CALLS[1];

  const sizePixels = {
    sm: 56,
    md: 72,
    lg: 88,
  }[size];

  // Traditional 2D pip fallback if 3D is disabled
  const sizeClasses = {
    sm: 'w-14 h-14 rounded-xl text-xl',
    md: 'w-20 h-20 rounded-2xl text-2xl',
    lg: 'w-24 h-24 md:w-28 md:h-28 rounded-2xl text-3xl',
  }[size];

  const render2DPips = (val: number) => {
    const dot = (pos: string, isRed = false) => (
      <span
        key={pos}
        className={`absolute rounded-full shadow-inner ${
          isRed ? 'bg-[#DC2626]' : 'bg-[#1C1917]'
        } ${
          size === 'sm'
            ? 'w-2.5 h-2.5'
            : size === 'md'
            ? 'w-3.5 h-3.5'
            : 'w-4 h-4 md:w-5 md:h-5'
        } ${pos}`}
      />
    );

    switch (val) {
      case 1:
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <span
              className={`rounded-full bg-[#B91C1C] shadow-inner ${
                size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-8 h-8' : 'w-10 h-10 md:w-12 md:h-12'
              }`}
            />
          </div>
        );
      case 2:
        return (
          <div className="relative w-full h-full p-2.5 md:p-3">
            {dot('top-2.5 left-2.5 md:top-3 md:left-3')}
            {dot('bottom-2.5 right-2.5 md:bottom-3 md:right-3')}
          </div>
        );
      case 3:
        return (
          <div className="relative w-full h-full p-2.5 md:p-3">
            {dot('top-2.5 left-2.5 md:top-3 md:left-3')}
            {dot('top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2')}
            {dot('bottom-2.5 right-2.5 md:bottom-3 md:right-3')}
          </div>
        );
      case 4:
        return (
          <div className="relative w-full h-full p-2.5 md:p-3">
            {dot('top-2.5 left-2.5 md:top-3 md:left-3', true)}
            {dot('top-2.5 right-2.5 md:top-3 md:right-3', true)}
            {dot('bottom-2.5 left-2.5 md:bottom-3 md:left-3', true)}
            {dot('bottom-2.5 right-2.5 md:bottom-3 md:right-3', true)}
          </div>
        );
      case 5:
        return (
          <div className="relative w-full h-full p-2.5 md:p-3">
            {dot('top-2.5 left-2.5 md:top-3 md:left-3')}
            {dot('top-2.5 right-2.5 md:top-3 md:right-3')}
            {dot('top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2', true)}
            {dot('bottom-2.5 left-2.5 md:bottom-3 md:left-3')}
            {dot('bottom-2.5 right-2.5 md:bottom-3 md:right-3')}
          </div>
        );
      case 6:
        return (
          <div className="relative w-full h-full p-2.5 md:p-3">
            {dot('top-2.5 left-2.5 md:top-3 md:left-3')}
            {dot('top-1/2 left-2.5 md:left-3 -translate-y-1/2')}
            {dot('bottom-2.5 left-2.5 md:bottom-3 md:left-3')}
            {dot('top-2.5 right-2.5 md:top-3 md:right-3')}
            {dot('top-1/2 right-2.5 md:right-3 -translate-y-1/2')}
            {dot('bottom-2.5 right-2.5 md:bottom-3 md:right-3')}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center">
      {label && (
        <span className="text-xs uppercase tracking-wider text-amber-200/80 mb-2 font-medium">
          {label}
        </span>
      )}

      {/* 3D Dice or 2D Classical Dice */}
      {is3D ? (
        <div
          className={`relative transition-all duration-300 rounded-2xl ${
            isWinner && !isRolling
              ? 'ring-4 ring-amber-400/90 shadow-[0_0_35px_rgba(245,158,11,0.6)] animate-pulse'
              : ''
          }`}
        >
          <ThreeDDice
            value={value}
            isRolling={isRolling}
            size={sizePixels}
            showDzongkha={showDzongkhaNum}
          />
        </div>
      ) : (
        <div
          className={`relative ${sizeClasses} transition-all duration-200 select-none ${
            isRolling
              ? 'animate-dice-shake scale-105'
              : isWinner
              ? 'animate-dice-slam ring-4 ring-amber-400/90 shadow-[0_0_25px_rgba(245,158,11,0.5)]'
              : 'shadow-[0_12px_24px_rgba(0,0,0,0.6)]'
          } bg-gradient-to-br from-[#FFFDF7] via-[#F8F1DE] to-[#E7D6B7] border-2 border-[#8E6637] flex items-center justify-center`}
        >
          {isRolling ? (
            <div className="flex flex-col items-center justify-center text-amber-900/60 font-cinzel font-bold text-2xl animate-spin">
              ✦
            </div>
          ) : showDzongkhaNum ? (
            <div className="flex flex-col items-center justify-center">
              <span className="font-tibetan font-bold text-4xl md:text-5xl text-[#2C1802]">
                {call.dzongkhaNum}
              </span>
              <span className="text-[10px] font-mono font-semibold text-[#8B5E3C]">
                {value}
              </span>
            </div>
          ) : (
            render2DPips(value)
          )}
        </div>
      )}

      {/* Callout caption */}
      <div className="mt-2.5 text-center min-h-[36px]">
        {isRolling ? (
          <span className="text-xs text-amber-300/80 animate-pulse font-medium">
            Tumbling 3D Bone Dice...
          </span>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-amber-200">
              {call.name}
            </span>
            <span className="text-[11px] text-amber-400/70 font-tibetan">
              {call.tibetan}
            </span>
          </div>
        )}
      </div>

      {sublabel && (
        <span className="text-[11px] text-stone-400 mt-0.5">{sublabel}</span>
      )}
    </div>
  );
};
