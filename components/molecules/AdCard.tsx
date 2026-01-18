import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { GlassContainer } from '../atoms';
import { triggerHaptic } from '@/utils';

export const AdCard: React.FC = () => {
    return (
        <a
            href="mailto:contacto@administracion.ai"
            onClick={() => triggerHaptic('light')}
            className="block h-full min-h-[160px] group outline-none focus:scale-[1.02] transition-transform"
        >
            <GlassContainer className="h-full p-5 flex flex-col justify-between border-white/5 bg-gradient-to-br from-white/5 to-transparent hover:bg-white/10 transition-colors relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-o/10 rounded-full blur-2xl group-hover:bg-o/20 transition-colors" />

                <div className="flex justify-between items-start z-10">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-o">
                        <Sparkles size={14} />
                    </div>
                    <ArrowUpRight size={16} className="text-white/30 group-hover:text-white transition-colors" />
                </div>

                <div className="z-10">
                    <div className="text-[10px] font-black uppercase tracking-widest text-f mb-1">Publicidad</div>
                    <div className="text-sm font-bold text-white leading-tight group-hover:text-o transition-colors">
                        Tu marca aquí
                    </div>
                    <div className="text-[9px] text-white/50 mt-1 font-mono">
                        contacto@administracion.ai
                    </div>
                </div>
            </GlassContainer>
        </a>
    );
};
