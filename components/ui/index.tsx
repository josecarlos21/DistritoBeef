import React, { useEffect, useState, useRef } from 'react';
import { LucideIcon, X, Bell, Loader2 } from 'lucide-react';
import { cx, triggerHaptic } from '../../utils';

// Glass Container
interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
  strong?: boolean;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({ children, className, strong }) => (
  <div 
    className={cx("relative rounded-[28px] border backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,.55)]", className)} 
    style={{ background: strong ? "var(--gs)" : "var(--gl)", borderColor: strong ? "var(--bs)" : "var(--b)" }}
  >
    {children}
  </div>
);

// Badge
interface BadgeProps {
  label: string;
  dot?: boolean;
  color?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, dot, color }) => (
  <div 
    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md" 
    style={{ background: "rgba(0,0,0,.4)", borderColor: "var(--b)" }}
  >
    {dot ? <span className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ background: color || "var(--o)", color: color || "var(--o)" }} /> : null}
    <span className="text-[10px] font-black uppercase tracking-[.16em]" style={{ color: "var(--tx)" }}>{label}</span>
  </div>
);

// Icon Button with Haptics
interface IconButtonProps {
  Icon: LucideIcon;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  color?: string;
  label?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ Icon, onClick, color, label }) => (
  <button 
    type="button"
    onClick={(e) => {
        triggerHaptic('light');
        onClick(e);
    }} 
    aria-label={label} 
    className="w-10 h-10 rounded-2xl border backdrop-blur-xl flex items-center justify-center active:scale-95 transition-transform" 
    style={{ background: "rgba(0,0,0,.28)", borderColor: "var(--b)" }}
  >
    <Icon size={16} color={color || "var(--tx)"} strokeWidth={2.6} />
  </button>
);

// Notification Toast
interface ToastProps {
  message: string;
  type?: 'info' | 'alert';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    triggerHaptic(type === 'alert' ? 'heavy' : 'light');
    timerRef.current = setTimeout(() => {
        onClose();
    }, 5000);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [onClose, type]);

  return (
    <div className="fixed top-20 left-4 right-4 z-[150] animate-in slide-in-from-top-4 duration-500">
      <div className="rounded-2xl border p-4 shadow-2xl backdrop-blur-xl flex items-start gap-3 relative overflow-hidden" 
        style={{ 
          background: "rgba(14, 12, 9, 0.95)", 
          borderColor: type === 'alert' ? 'var(--o)' : 'var(--b)' 
        }}
      >
        <div className={cx("w-1 absolute left-0 top-0 bottom-0", type === 'alert' ? "bg-[var(--o)]" : "bg-[var(--c)]")} />
        <div className="mt-0.5">
           <Bell size={16} color={type === 'alert' ? 'var(--o)' : 'var(--tx)'} />
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-black uppercase tracking-[.2em] mb-1" style={{ color: "var(--m)" }}>
            {type === 'alert' ? 'Alerta' : 'Notificación'}
          </div>
          <div className="text-sm font-bold leading-tight text-white">{message}</div>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white p-1"><X size={16} /></button>
      </div>
    </div>
  );
};

// Filter Tabs
export interface FilterOption {
  id: string;
  label: string;
}

interface FilterTabsProps {
  options: FilterOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ options, selectedId, onSelect, className }) => (
  <div className={cx("flex gap-2 overflow-x-auto no-scrollbar", className)}>
    {options.map(f => {
      const active = selectedId === f.id;
      return (
        <button
          type="button"
          key={f.id}
          onClick={() => {
              triggerHaptic('light');
              onSelect(f.id);
          }}
          className={cx(
            "px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-[.15em] transition-all flex-shrink-0 active:scale-95",
            active ? "bg-[#D8C2A2] text[#0E0C09] border[#D8C2A2] shadow-[0_0_15px_rgba(216,194,162,0.3)]" : "bg-transparent text-[var(--f)] border-[var(--b)] hover:border-[var(--s)]"
          )}
        >
          {f.label}
        </button>
      );
    })}
  </div>
);

// Pull To Refresh Component (Optimized)
interface PullToRefreshProps {
    children: React.ReactNode;
    onRefresh: () => Promise<void>;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ children, onRefresh }) => {
    const [startY, setStartY] = useState(0);
    const [translateY, setTranslateY] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (containerRef.current && containerRef.current.scrollTop <= 0) {
            setStartY(e.touches[0].clientY);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!startY || refreshing) return;
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        
        if (diff > 0 && (!containerRef.current || containerRef.current.scrollTop <= 0)) {
            // Logarithmic resistance for natural feel
            const p = Math.min(diff * 0.4, 100); 
            setTranslateY(p);
        }
    };

    const handleTouchEnd = async () => {
        if (!startY) return; 
        setStartY(0);
        
        if (translateY > 50) {
            setRefreshing(true);
            setTranslateY(60); // Snap to loading position
            triggerHaptic('medium');
            await onRefresh();
            triggerHaptic('success');
            setRefreshing(false);
            setTranslateY(0);
        } else {
            setTranslateY(0); // Snap back
        }
    };

    return (
        <div 
            ref={containerRef}
            className="h-full overflow-y-auto no-scrollbar relative touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div 
                className="absolute top-0 left-0 right-0 flex justify-center items-center pointer-events-none"
                style={{ 
                    height: '60px', 
                    transform: `translate3d(0, ${translateY - 60}px, 0)`,
                    opacity: Math.min(translateY / 40, 1),
                    transition: refreshing ? 'transform 0.3s ease' : 'none'
                }}
            >
                {refreshing ? (
                    <Loader2 className="animate-spin text-[var(--o)]" size={20} />
                ) : (
                    <div className="text-[9px] font-black uppercase text-[var(--o)] tracking-[.2em] transition-transform duration-200" style={{ transform: `rotate(${translateY * 3}deg)` }}>
                        ▼
                    </div>
                )}
            </div>
            
            <div 
                style={{ 
                    transform: `translate3d(0, ${translateY}px, 0)`, 
                    transition: !startY ? 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none' 
                }}
            >
                {children}
            </div>
        </div>
    );
};
