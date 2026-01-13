
import React, { useMemo, useState, useEffect } from 'react';
import { Award, RefreshCw, ShieldCheck, HelpCircle } from 'lucide-react';
import { GlassContainer } from './UI';
import { triggerHaptic } from '../utils';

export const WalletView: React.FC = () => {
  // Simulate dynamic QR noise
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeed(s => s + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
      triggerHaptic('success');
      setSeed(s => s + 10);
  };

  const blocks = useMemo(() => {
    return Array.from({ length: 16 }).map((_, i) => {
        // Deterministic pseudo-random based on seed + index
        const val = Math.sin(seed * 99 + i * 13) > 0;
        return val ? 1 : 0;
    });
  }, [seed]);

  return (
    <div className="pt-10 pb-24 flex flex-col items-center justify-center h-full animate-in fade-in zoom-in-95 duration-500 overflow-y-auto no-scrollbar">
      
      <div className="w-full max-w-sm relative group">
        
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-b from-[var(--o)] to-[var(--c)] rounded-[40px] opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-1000" />

        <GlassContainer strong className="p-8 relative overflow-hidden">
            {/* Top Pattern */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--o)] via-[var(--s)] to-[var(--o)]" />
            
            <div className="flex justify-between items-start mb-8">
                 <div>
                    <div className="text-[11px] font-black uppercase tracking-[.22em] text-[var(--s)]">Pase de distrito</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider opacity-60 mt-1 text-white">Acceso Total</div>
                 </div>
                 <ShieldCheck size={24} color="var(--ok)" strokeWidth={2.5} />
            </div>

            <div className="flex flex-col items-center">
                <div className="relative">
                    <div className="w-28 h-28 rounded-full border-4 border-[var(--bg)] shadow-[0_0_20px_rgba(255,138,29,0.3)] overflow-hidden">
                        <img src="https://i.pravatar.cc/240?u=1" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-[var(--ok)] text-black text-[9px] font-black px-3 py-1 rounded-full border-4 border-[var(--bg)] shadow-md">
                        ACTIVO
                    </div>
                </div>
                
                <div className="text-3xl font-black uppercase tracking-tight text-center mt-5 text-white font-display">Rafael Méndez</div>
                
                <div className="mt-3 flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                    <Award size={14} color="var(--o)" strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-[.15em] text-[var(--o)]">Socio Gold</span>
                </div>
            </div>

            {/* Dynamic QR Area - Larger for accessibility */}
            <div className="mt-8 mb-4 relative bg-white rounded-[36px] p-5 shadow-[0_0_40px_rgba(255,255,255,0.08)]">
                <div className="w-full aspect-square grid grid-cols-4 gap-2">
                    {blocks.map((x, i) => (
                        <div 
                            key={i} 
                            className="rounded-lg transition-colors duration-500" 
                            style={{ background: x ? "#0E0C09" : "#e5e5e5" }} 
                        />
                    ))}
                </div>
                {/* Scanner Line */}
                <div className="absolute inset-0 rounded-[36px] bg-gradient-to-b from-transparent via-[var(--o)] to-transparent opacity-20 h-[20%] w-full animate-[scan_3s_ease-in-out_infinite] pointer-events-none" />
            </div>

            {/* Explicit Refresh Button */}
            <button 
                onClick={handleRefresh}
                className="w-full h-12 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center gap-3 border border-white/10 active:scale-[0.98] transition mb-6"
            >
                <RefreshCw size={16} className="text-[var(--o)]" strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Actualizar Código</span>
            </button>

            <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <div className="text-center">
                    <div className="text-[9px] font-bold text-[var(--f)] uppercase mb-1">Vence</div>
                    <div className="text-xs font-black text-white">02 FEB</div>
                </div>
                <div className="text-center">
                    <div className="text-[9px] font-bold text-[var(--f)] uppercase mb-1">Zona</div>
                    <div className="text-xs font-black text-white">ALL ACCESS</div>
                </div>
                 <div className="text-center">
                    <div className="text-[9px] font-bold text-[var(--f)] uppercase mb-1">ID</div>
                    <div className="text-xs font-black text-white">#8829</div>
                </div>
            </div>

        </GlassContainer>
      </div>
      
      <div className="mt-8 text-center px-8 opacity-70 flex flex-col items-center gap-3">
        <p className="text-[11px] font-medium leading-relaxed text-[var(--f)]">
            Este código QR es dinámico. Las capturas de pantalla no funcionarán.
        </p>
        <button className="flex items-center gap-2 text-[var(--o)] text-[10px] font-bold uppercase tracking-wider p-2">
            <HelpCircle size={14} strokeWidth={2.5} />
            ¿Necesitas ayuda?
        </button>
      </div>

      <style>{`
        @keyframes scan {
            0% { top: -20%; }
            100% { top: 120%; }
        }
      `}</style>
    </div>
  );
};
