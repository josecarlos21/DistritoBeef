import React from 'react';
import { cx } from '../../src/utils';

interface GlassContainerProps {
    children: React.ReactNode;
    className?: string;
    strong?: boolean;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({ children, className, strong }) => (
    <div
        className={cx(
            "relative rounded-[28px] border backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,.55)]",
            strong ? "bg-glass-strong border-bs" : "bg-glass-light border-b",
            className
        )}
    >
        {children}
    </div>
);
