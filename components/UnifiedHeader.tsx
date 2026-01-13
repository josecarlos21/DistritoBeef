
import React from 'react';
import { GlassContainer } from './UI';
import { cx } from '../utils';

interface UnifiedHeaderProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
  isSearchMode?: boolean;
}

export const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({ 
  left, 
  center, 
  right, 
  className,
  isSearchMode = false
}) => {
  return (
    <div className={cx("absolute top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none", className)}>
      <GlassContainer 
        strong 
        className={cx(
          "pointer-events-auto h-[64px] w-full max-w-[360px] px-3 flex items-center shadow-[0_20px_40px_rgba(0,0,0,0.6)] border border-white/15 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
          isSearchMode ? "gap-2" : "justify-between"
        )}
      >
        {/* Left Slot: Fixed width for balance, or hidden in search */}
        {!isSearchMode && (
          <div className="flex items-center justify-start min-w-[40px] shrink-0">
            {left}
          </div>
        )}

        {/* Center Slot: Flexible, centered text or Full width Search */}
        <div className={cx(
          "flex items-center justify-center transition-all duration-300",
          isSearchMode ? "flex-1 w-full justify-start" : "flex-col"
        )}>
          {center}
        </div>

        {/* Right Slot: Actions */}
        <div className="flex items-center justify-end gap-2 min-w-[40px] shrink-0">
          {right}
        </div>
      </GlassContainer>
    </div>
  );
};

// Sub-components for semantic slot usage
export const HeaderTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="flex flex-col items-center animate-in fade-in duration-300">
    <span className="text-xs font-black uppercase tracking-[0.25em] text-white leading-tight">
      {title}
    </span>
    {subtitle && (
      <span className="text-[9px] font-bold text-[var(--s)] uppercase tracking-wider mt-0.5 opacity-80">
        {subtitle}
      </span>
    )}
  </div>
);

export const HeaderAction = ({ 
  children, 
  onClick, 
  active 
}: { 
  children: React.ReactNode, 
  onClick: () => void, 
  active?: boolean 
}) => (
  <button 
    onClick={onClick}
    className={cx(
      "w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-95",
      active ? "bg-white/10 text-[var(--o)] shadow-[0_0_10px_rgba(255,159,69,0.2)]" : "hover:bg-white/5 text-[var(--tx)]"
    )}
  >
    {children}
  </button>
);
