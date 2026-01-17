
import React, { useMemo, useState, useEffect } from 'react';
import { RefreshCw, ShieldCheck, HelpCircle, SlidersHorizontal } from 'lucide-react';
import { GlassContainer } from '../atoms';
import { UnifiedHeader, HeaderTitle, HeaderAction } from '../organisms';
import { triggerHaptic, cx } from '@/utils';
import { useLocale } from '@/context/LocaleContext';
import { useAuth } from '@/context/AuthContext';
import { Apple, Facebook, X, Key, User as UserIcon } from 'lucide-react';

interface WalletViewProps {
    onOpenConfig: () => void;
}

export const WalletView: React.FC<WalletViewProps> = ({ onOpenConfig }) => {
    const { user, logout } = useAuth();
    const userName = user?.name || "Invitado";
    // Simulate dynamic QR noise
    const [seed, setSeed] = useState(0);
    const { t } = useLocale();

    useEffect(() => {
        let lastUpdate = 0;
        let frameId: number;

        const loop = (time: number) => {
            if (document.visibilityState === 'visible' && (time - lastUpdate) > 2000) {
                setSeed(s => s + 1);
                lastUpdate = time;
            }
            frameId = requestAnimationFrame(loop);
        };

        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
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

            <div className="pt-28 pb-24 flex flex-col items-center justify-center h-full animate-in fade-in zoom-in-95 duration-500 overflow-y-auto no-scrollbar">

                <div className="w-full max-w-sm relative group px-4">

                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-b from-[var(--o)] to-[var(--c)] rounded-[32px] opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-1000 mx-4" />

                    <GlassContainer strong className="p-8 relative overflow-hidden">
                        {/* Top Pattern */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--o)] via-[var(--s)] to-[var(--o)]" />

                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <div className="text-[11px] font-black uppercase tracking-[.22em] text-s">{t('wallet.pass')}</div>
                                <div className="text-[10px] font-bold uppercase tracking-wider opacity-60 mt-1 text-white">{t('wallet.fullAccess')}</div>
                            </div>
                            <ShieldCheck size={24} className="text-ok" strokeWidth={2.5} />
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <div className="w-28 h-28 rounded-full border-4 border-[var(--bg)] shadow-[0_0_20px_rgba(255,138,29,0.3)] overflow-hidden bg-white/10 flex items-center justify-center">
                                    {/* Use transparent background placeholder if no specific image logic is present (generic user) */}
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=161310&color=f97316&size=240&bold=true`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-ok text-black text-[9px] font-black px-3 py-1 rounded-full border-4 border-b shadow-md">
                                    {t('wallet.active')}
                                </div>
                            </div>

                            <div className="text-3xl font-black uppercase tracking-tight text-center mt-5 text-white font-display text-ellipsis overflow-hidden w-full whitespace-nowrap">{userName}</div>

                            <div className="mt-3 flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                                {user?.provider === 'apple' && <Apple size={12} className="text-white" />}
                                {user?.provider === 'facebook' && <Facebook size={12} className="text-[#1877F2]" />}
                                {user?.provider === 'x' && <X size={12} className="text-white" />}
                                {user?.provider === 'pin' && <Key size={12} className="text-o" />}
                                {user?.provider === 'guest' && <UserIcon size={12} className="text-f" />}
                                <span className="text-[10px] font-black uppercase tracking-[.15em] text-f">{user?.provider || 'member'}</span>
                            </div>
                        </div>

                        {/* Dynamic QR Area */}
                        <div className="mt-8 mb-4 relative bg-white rounded-[32px] p-5 shadow-bento">
                            <div className="w-full aspect-square grid grid-cols-4 gap-2">
                                {blocks.map((x, i) => (
                                    <div
                                        key={i}
                                        className={cx("rounded-lg transition-colors duration-500", x ? "wallet-code-on" : "wallet-code-off")}
                                    />
                                ))}
                            </div>
                            {/* Scanner Line */}
                            <div className="absolute inset-0 rounded-[36px] bg-gradient-to-b from-transparent via-[var(--o)] to-transparent opacity-20 h-[20%] w-full animate-[scan_3s_ease-in-out_infinite] pointer-events-none" />
                        </div>

                        {/* Explicit Refresh Button */}
                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="w-full h-12 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center gap-3 border border-white/10 active:scale-[0.98] transition mb-6"
                        >
                            <RefreshCw size={16} className="text-o" strokeWidth={2.5} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">{t('action.refresh')}</span>
                        </button>

                        <div className="flex items-center justify-between pt-6 border-t border-white/10">
                            <div className="text-center">
                                <div className="text-[9px] font-bold text-f uppercase mb-1">{t('wallet.expires')}</div>
                                <div className="text-xs font-black text-white">02 FEB</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[9px] font-bold text-f uppercase mb-1">{t('wallet.zone')}</div>
                                <div className="text-xs font-black text-white">ALL ACCESS</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[9px] font-bold text-f uppercase mb-1">{t('wallet.id')}</div>
                                <div className="text-xs font-black text-white">{user?.id.toUpperCase() || '#0000'}</div>
                            </div>
                        </div>

                    </GlassContainer>
                </div>

                <div className="mt-8 text-center px-8 opacity-70 flex flex-col items-center gap-3">
                    <p className="text-[11px] font-medium leading-relaxed text-f">
                        {t('wallet.dynamicNote')}
                    </p>
                    <div className="flex items-center gap-4">
                        <button type="button" className="flex items-center gap-2 text-o text-[10px] font-bold uppercase tracking-wider p-2">
                            <HelpCircle size={14} strokeWidth={2.5} />
                            {t('action.help')}
                        </button>
                        <div className="w-px h-3 bg-white/10" />
                        <button
                            type="button"
                            onClick={() => { triggerHaptic('medium'); logout(); }}
                            className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-wider p-2"
                        >
                            {t('action.logout')}
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
};
