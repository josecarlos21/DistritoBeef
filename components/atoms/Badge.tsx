import React, { useMemo } from 'react';
import { cx } from '../../src/utils';
import { TrackType } from '../../src/types';

interface BadgeProps {
    label: string;
    dot?: boolean;
    color?: string;
    track?: TrackType | 'featured';
}

export const Badge: React.FC<BadgeProps> = ({ label, dot, color, track }) => {
    const dotColorClass = useMemo(() => {
        if (track === 'beefdip') return 'bg-orange-500';
        if (track === 'bearadise') return 'bg-purple-500';
        if (track === 'community') return 'bg-blue-500';
        if (track === 'featured') return 'bg-white';
        return null;
    }, [track]);

    return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md bg-black-40 border-b">
            {dot ? (
                <span
                    className={cx(
                        "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]",
                        dotColorClass ? dotColorClass : "bg-[var(--badge-color,var(--o))]"
                    )}
                    style={!dotColorClass && color ? { '--badge-color': color } as React.CSSProperties : undefined}
                />
            ) : null}
            <span className="text-[10px] font-black uppercase tracking-[.16em] text-tx">{label}</span>
        </div>
    );
};
