
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
          "pointer-events-auto h-[64px] w-full max-w-[360px] px-2 flex items-center shadow-[0_20px_40px_rgba(0,0,0,0.6)] border border-white/15 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
          isSearchMode ? "gap-2 pl-3 pr-2" : "justify-between"
        )}
      >
        {/* Left Slot: Fixed width for balance, or hidden in search */}
        {!isSearchMode && (
          <div className="flex items-center justify-start min-w-[40px] shrink-0 pl-1">
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
        <div className="flex items-center justify-end gap-1.5 min-w-[40px] shrink-0 pr-1">
          {right}
        </div>
      </GlassContainer>
    </div>
  );
};

// Sub-components for semantic slot usage

export const HeaderTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
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

interface HeaderActionProps { 
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  className?: string;
}

export const HeaderAction: React.FC<HeaderActionProps> = ({ 
  children, 
  onClick, 
  active,
  className
}) => (
  <button 
    onClick={onClick}
    className={cx(
      "w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-95",
      active ? "bg-white/10 text-[var(--o)] shadow-[0_0_10px_rgba(255,159,69,0.2)]" : "hover:bg-white/5 text-[var(--tx)]",
      className
    )}
  >
    {children}
  </button>
);

// Grouped Control (e.g. for Zoom +/-)
export const HeaderSegmentedControl: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex bg-white/5 rounded-2xl p-0.5 border border-white/5">
    {children}
  </div>
);

interface SegmentButtonProps { 
  children: React.ReactNode;
  onClick: () => void; 
  active?: boolean;
}

export const SegmentButton: React.FC<SegmentButtonProps> = ({ 
  children, 
  onClick, 
  active 
}) => (
  <button 
    onClick={onClick}
    className={cx(
      "w-9 h-9 rounded-[14px] flex items-center justify-center transition-all active:scale-90",
      active ? "bg-[var(--o)] text-black shadow-lg" : "text-white hover:bg-white/10"
    )}
  >
    {children}
  </button>
);