
import React, { useMemo, useState, useEffect } from 'react';
import { ShieldCheck, HelpCircle, SlidersHorizontal, User as UserIcon, QrCode } from 'lucide-react';
import { GlassContainer, Badge } from '../atoms';
import { UnifiedHeader, HeaderTitle, HeaderAction } from '../organisms';
import { triggerHaptic, cx } from '@/utils';
import { useLocale } from '@/context/LocaleContext';
import { useAuth } from '@/context/AuthContext';
import { Apple, Facebook, X as XIcon, Key } from 'lucide-react';
import { BackupPanel } from '../molecules/BackupPanel';

interface WalletViewProps {
    onOpenConfig: () => void;
}

export const WalletView: React.FC<WalletViewProps> = ({ onOpenConfig }) => {
    const { user, logout } = useAuth();
    const userName = user?.name || "Invitado";
    const { t } = useLocale();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial simulated load
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);



    return (
        <div className="h-full relative font-sans">
            <UnifiedHeader
                left={<div className="w-10" />}
                center={<HeaderTitle title={t('header.wallet')} />}
                right={
                    <HeaderAction ariaLabel={t('action.settings')} onClick={onOpenConfig}>
                        <SlidersHorizontal size={20} strokeWidth={2.5} />
                    </HeaderAction>
                }
            />

            <div className="pt-28 pb-32 flex flex-col items-center h-full animate-in fade-in zoom-in-95 duration-500 overflow-y-auto no-scrollbar scroll-smooth">

                <div className="w-full max-w-sm px-5 relative group">
                    {/* Ambient Glow */}
                    {/* Ambient Glow & Liquid Effect */}
                    <div className="absolute top-10 inset-x-10 h-60 bg-[var(--accent-brown)]/20 blur-[60px] rounded-full pointer-events-none mix-blend-screen animate-pulse" />
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-[var(--accent-brown)]/10 blur-[100px] rounded-full pointer-events-none" />

                    {/* MAIN FESTIVAL GAFFETTE (BADGE) */}
                    <div className="relative w-full">
                        {/* Lanyard/Clip Visual */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-32 bg-white/5 blur-2xl rounded-full pointer-events-none" />
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-zinc-800 rounded-full border border-white/20 shadow-lg z-30 flex items-center justify-center">
                            <div className="w-8 h-1 bg-black/50 rounded-full" />
                        </div>

                        <GlassContainer strong className="relative p-0 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 rounded-[32px] backdrop-blur-3xl bg-[#1a120b]/80">

                            {/* 1. Header Band: The "Event" Brand */}
                            <div className="h-32 bg-gradient-to-b from-[var(--accent-brown)] to-[#8a5333] relative overflow-hidden flex flex-col items-center justify-center border-b border-white/10 pt-4">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                                {/* Abstract topographical lines or decorative pattern */}
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--bg)_1px,_transparent_1px)] bg-[size:10px_10px]" />

                                <div className="relative z-10 text-center">
                                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-black/60 mb-1">OFFICIAL ACCESS</div>
                                    <h1 className="text-3xl font-black font-display text-white tracking-tighter leading-none drop-shadow-md">
                                        DISTRICT<br />VALLARTA
                                    </h1>
                                    <div className="mt-2 px-3 py-0.5 bg-black/20 backdrop-blur-md rounded-full border border-white/10 inline-block">
                                        <span className="text-[10px] font-bold text-white tracking-[0.2em]">{new Date().getFullYear()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Content Body: User Identity */}
                            <div className="px-8 pb-8 pt-12 flex flex-col items-center bg-gradient-to-b from-[#1a120b] to-black relative">
                                {/* Profile Photo - Breaking the boundary */}
                                <div className="absolute -top-14 w-28 h-28 rounded-full p-1.5 bg-[#1a120b] shadow-2xl">
                                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-[var(--accent-brown)] relative">
                                        {loading ? (
                                            <div className="w-full h-full bg-white/5 animate-pulse" />
                                        ) : (
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=000&color=C07A50&size=240&bold=true`}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                        {/* Status Dot */}
                                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-ok border-2 border-black rounded-full shadow-[0_0_10px_var(--ok)]" />
                                    </div>
                                </div>

                                {/* Name & Role */}
                                <div className="mt-14 text-center space-y-1 w-full">
                                    <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight truncate px-2">
                                        {userName}
                                    </h2>
                                    <div className="flex items-center justify-center gap-2 opacity-80">
                                        <Badge label="GUEST" className="bg-white/5 text-f border-white/10 text-[9px] px-3" />
                                        <span className="text-[9px] text-f font-mono tracking-widest">ID: {user?.id.substring(0, 6) || "---"}</span>
                                    </div>
                                </div>

                                {/* Unifying Divider */}
                                <div className="w-full my-6 border-t border-dashed border-white/10 relative">
                                    <div className="absolute -left-9 -top-3 w-6 h-6 bg-[#000] rounded-full" />
                                    <div className="absolute -right-9 -top-3 w-6 h-6 bg-[#000] rounded-full" />
                                </div>

                                {/* 3. The "Key" (QR) */}
                                <div className="w-full flex justify-between items-center gap-4">
                                    <div className="flex-1">
                                        <div className="text-[9px] font-black uppercase tracking-widest text-f mb-1">Access Level</div>
                                        <div className="text-xl font-black italic text-[var(--accent-brown)] tracking-tighter">ALL ACCESS</div>
                                    </div>

                                    {/* Minimalist Grid QR */}
                                    <div className="p-2 bg-white rounded-lg shadow-lg">
                                        <div className="flex gap-0.5">
                                            {Array.from({ length: 5 }).map((_, col) => (
                                                <div key={col} className="flex flex-col gap-0.5">
                                                    {Array.from({ length: 5 }).map((_, row) => {
                                                        const active = ((user?.id?.charCodeAt((col * 5 + row) % user?.id?.length) || 0) + col) % 2 === 0;
                                                        return <div key={row} className={cx("w-2 h-2 rounded-[1px]", active ? "bg-black" : "bg-transparent")} />
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 w-full text-center">
                                    <div className="text-[8px] font-bold text-white/20 uppercase tracking-[0.3em]">Distrito Vallarta Non-Transferable</div>
                                </div>

                            </div>
                        </GlassContainer>
                    </div>

                    {/* Reflection / Grounding Shadow */}
                    <div className="mx-8 h-4 bg-black/40 blur-xl rounded-[100%] mt-[-10px] relative -z-10" />
                </div>

                {/* Actions Footer */}
                <div className="mt-10 flex flex-col items-center gap-4 w-full max-w-sm px-8">
                    <p className="text-center text-[10px] text-f/60 font-medium leading-relaxed max-w-[250px]">
                        Este pase es personal e intransferible. Muestra este código al staff de Distrito Beef para acceder.
                    </p>

                    <div className="flex items-center gap-6 mt-2">
                        <button type="button" className="group flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-active:scale-95 transition-transform">
                                <HelpCircle size={16} className="text-f" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-wider text-f">{t('action.help')}</span>
                        </button>

                        <div className="w-px h-8 bg-white/5" />

                        <button
                            type="button"
                            onClick={() => { triggerHaptic('medium'); logout(); }}
                            className="group flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
                        >
                            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 group-active:scale-95 transition-transform">
                                <UserIcon size={16} className="text-red-400" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-wider text-red-400">{t('action.logout')}</span>
                        </button>
                    </div>

                    <div className="w-full mt-6 opacity-80">
                        <BackupPanel />
                    </div>
                </div>

            </div>

            <style>{`
                @keyframes scan-x {
                    0% { left: -10%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { left: 110%; opacity: 0; }
                }
                @keyframes float {
                     0%, 100% { transform: translateY(0px); }
                     50% { transform: translateY(-10px); }
                }
            `}</style>
        </div>
    );
};
