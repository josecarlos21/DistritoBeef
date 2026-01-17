import React from 'react';
import { cx } from '../../src/utils';

interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    strong?: boolean;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({ children, className, strong, ...props }) => (
    <div
        {...props}
        className={cx(
            "relative rounded-[32px] border backdrop-blur-3xl shadow-bento transition-all duration-300",
            strong ? "bg-glass-strong border-white/10" : "bg-glass-light border-white/5",
            className
        )}
    >
        {children}
    </div>
);
