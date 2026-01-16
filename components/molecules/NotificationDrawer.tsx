
import React from 'react';
import { X, Bell, Info, AlertTriangle } from 'lucide-react';
import { IconButton } from '../atoms';
import { triggerHaptic } from '../../src/utils';
import { useLocale } from '../../src/context/LocaleContext';

interface NotificationDrawerProps {
    open: boolean;
    onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ open, onClose }) => {
    const { t } = useLocale();

    if (!open) return null;

    const notifs = [
        { id: 1, type: 'alert', title: t('drawer.density'), msg: t('drawer.density.msg'), time: '2m' },
        { id: 2, type: 'info', title: t('drawer.pass'), msg: t('drawer.pass.msg'), time: '1h' },
        { id: 3, type: 'info', title: t('drawer.weather'), msg: t('drawer.weather.msg'), time: '3h' },
    ];

    return (
        <div className="absolute inset-0 z-[110] flex flex-col pointer-events-auto">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

            {/* Drawer */}
            <div className="relative bg-[#0E0C09] w-full rounded-b-[40px] shadow-2xl border-b border-b animate-in slide-in-from-top-full duration-500 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--o)] via-[var(--c)] to-[var(--o)]" />

                <div className="p-6 pb-8">
                    <div className="flex items-center justify-between mb-6 pt-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[var(--bg2)] flex items-center justify-center border border-b">
                                <Bell size={18} className="text-o" />
                            </div>
                            <h2 className="text-xl font-black text-white font-display uppercase tracking-tight">{t('notif.title')}</h2>
                        </div>
                        <IconButton Icon={X} onClick={onClose} label={t('action.close')} />
                    </div>

                    <div className="space-y-3">
                        {notifs.map((n, i) => (
                            <button
                                key={n.id}
                                type="button"
                                onClick={() => triggerHaptic('light')}
                                className="w-full text-left p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 active:scale-[0.98] transition flex gap-4 animate-in slide-in-from-top-4 drawer-item"
                                style={{ '--delay': `${i * 100}ms` } as React.CSSProperties}
                            >
                                <div className="mt-1">
                                    {n.type === 'alert' ? <AlertTriangle size={18} className="text-o" /> : <Info size={18} className="text-s" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div className="text-sm font-bold text-white leading-none mb-1.5">{n.title}</div>
                                        <div className="text-[9px] font-bold text-f">{n.time}</div>
                                    </div>
                                    <div className="text-xs text-m leading-snug">{n.msg}</div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 text-center">
                        <button type="button" onClick={onClose} className="text-[10px] font-black uppercase tracking-[.2em] text-f hover:text-white transition">
                            {t('action.markRead')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
