import React from 'react';
import { LucideIcon } from 'lucide-react';
import { triggerHaptic } from '../../src/utils';

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
        className="w-10 h-10 rounded-2xl border backdrop-blur-xl flex items-center justify-center active:scale-95 transition-transform bg-black-40 border-b"
    >
        <Icon size={16} color={color || "var(--tx)"} strokeWidth={2.6} />
    </button>
);
