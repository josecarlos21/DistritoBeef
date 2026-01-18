import { ArrowUpRight, Phone } from 'lucide-react';
import { GlassContainer } from '../atoms';
import { triggerHaptic } from '@/utils';

export const AdCard: React.FC = () => {
    return (
        <a
            href="mailto:contacto@administracion.ai"
            onClick={() => triggerHaptic('light')}
            className="block h-full min-h-[160px] group outline-none focus:scale-[1.02] transition-transform"
        >
            <GlassContainer className="h-full p-5 flex flex-col justify-between border-white/5 bg-gradient-to-br from-purple-500/10 to-blue-500/10 hover:bg-white/10 transition-colors relative overflow-hidden">
                {/* Decorative background element - Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <svg width="100%" height="100%">
                        <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1" className="text-white" fill="currentColor" />
                        </pattern>
                        <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
                    </svg>
                </div>

                {/* Glow */}
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-o/20 rounded-full blur-3xl group-hover:bg-o/30 transition-colors" />

                <div className="flex justify-between items-start z-10">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-o border border-white/10">
                        <Phone size={14} className="animate-pulse" />
                    </div>
                    <ArrowUpRight size={16} className="text-white/30 group-hover:text-white transition-colors" />
                </div>

                <div className="z-10 mt-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-f mb-1">Publicidad</div>
                    <div className="text-sm font-bold text-white leading-tight group-hover:text-o transition-colors pr-4">
                        Anúnciate aquí
                    </div>
                    <div className="text-[9px] text-white/50 mt-1 font-mono">
                        contacto@administracion.ai
                    </div>
                </div>
            </GlassContainer>
        </a>
    );
};
