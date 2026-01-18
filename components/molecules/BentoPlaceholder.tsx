import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { GlassContainer } from '../atoms';
import { triggerHaptic } from '@/utils';

interface BentoPlaceholderProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}

export const BentoPlaceholder: React.FC<BentoPlaceholderProps> = ({ isOpen, onClose, title = "Coming Soon" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-sm animate-in zoom-in-95 duration-300">
                <GlassContainer strong className="relative p-8 flex flex-col items-center text-center overflow-hidden">
                    <button
                        onClick={() => { triggerHaptic('light'); onClose(); }}
                        className="absolute top-4 right-4 text-white/40 hover:text-white transition"
                        aria-label="Cerrar"
                        title="Cerrar"
                    >
                        <X size={20} />
                    </button>

                    {/* Ambient Background */}
                    <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[var(--accent-brown)]/20 to-transparent blur-2xl -z-10" />

                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 ring-1 ring-white/10 shadow-[0_0_30px_rgba(192,122,80,0.15)]">
                        <Sparkles size={32} className="text-[var(--accent-brown)] animate-pulse" />
                    </div>

                    <h3 className="text-2xl font-black uppercase font-display text-white mb-2 tracking-tight">
                        {title}
                    </h3>

                    <p className="text-sm text-f font-medium leading-relaxed mb-8 max-w-[200px]">
                        Estamos trabajando en esta experiencia para ti.
                    </p>

                    <button
                        onClick={() => { triggerHaptic('medium'); onClose(); }}
                        className="w-full py-4 rounded-xl bg-[var(--accent-brown)] text-black font-black uppercase tracking-widest text-xs hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                        Entendido
                    </button>

                </GlassContainer>
            </div>
        </div>
    );
};
