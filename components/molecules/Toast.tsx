import React, { useEffect, useRef } from 'react';
import { X, Bell } from 'lucide-react';
import { cx, triggerHaptic } from '../../src/utils/index';
import { useLocale } from '../../src/context/LocaleContext';

interface ToastProps {
    message: string;
    type?: 'info' | 'alert';
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const { t } = useLocale();

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
            <div className={cx(
                "rounded-2xl border p-4 shadow-2xl backdrop-blur-xl flex items-start gap-3 relative overflow-hidden bg-glass-strong",
                type === 'alert' ? "border-o" : "border-b"
            )}
            >
                <div className={cx("w-1 absolute left-0 top-0 bottom-0", type === 'alert' ? "bg-[var(--o)]" : "bg-[var(--c)]")} />
                <div className="mt-0.5">
                    <Bell size={16} color={type === 'alert' ? 'var(--o)' : 'var(--tx)'} />
                </div>
                <div className="flex-1">
                    <div className="text-[10px] font-black uppercase tracking-[.2em] mb-1 text-m">
                        {type === 'alert' ? t('toast.alert') : t('toast.notification')}
                    </div>
                    <div className="text-sm font-bold leading-tight text-white">{message}</div>
                </div>
                <button onClick={onClose} className="text-white/40 hover:text-white p-1" aria-label={t('action.close')}><X size={16} /></button>
            </div>
        </div>
    );
};
