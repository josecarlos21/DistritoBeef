import React from 'react';
import { cx } from '../../src/utils';

interface BadgeProps {
    label: string;
    dot?: boolean;
    color?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, dot, color }) => (
    <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md bg-black-40 border-b"
    >

        {dot ? (
            <span
                className={cx(
                    "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]",
                    !color ? "bg-[var(--o)]" : "bg-[var(--badge-color)]"
                )}
                style={color ? { '--badge-color': color } as React.CSSProperties : undefined}
            />
        ) : null}
        <span className="text-[10px] font-black uppercase tracking-[.16em] text-tx">{label}</span>
    </div>
);
