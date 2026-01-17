import React, { useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { triggerHaptic } from '../../src/utils';

interface PullToRefreshProps {
    children: React.ReactNode;
    onRefresh: () => Promise<void>;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ children, onRefresh }) => {
    const [startY, setStartY] = useState(0);
    const [translateY, setTranslateY] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (containerRef.current && containerRef.current.scrollTop <= 0) {
            setStartY(e.touches[0].clientY);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!startY || refreshing) return;
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;

        if (diff > 0 && (!containerRef.current || containerRef.current.scrollTop <= 0)) {
            // Logarithmic resistance for natural feel
            const p = Math.min(diff * 0.4, 100);
            setTranslateY(p);
        }
    };

    const handleTouchEnd = async () => {
        if (!startY) return;
        setStartY(0);

        if (translateY > 50) {
            setRefreshing(true);
            setTranslateY(60); // Snap to loading position
            triggerHaptic('medium');
            await onRefresh();
            triggerHaptic('success');
            setRefreshing(false);
            setTranslateY(0);
        } else {
            setTranslateY(0); // Snap back
        }
    };

    const indicatorRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    React.useLayoutEffect(() => {
        if (indicatorRef.current) {
            indicatorRef.current.style.setProperty('--ptr-y', translateY.toString());
            indicatorRef.current.style.setProperty('--ptr-opacity', Math.min(translateY / 40, 1).toString());
            indicatorRef.current.style.setProperty('--ptr-transition', refreshing ? 'transform 0.3s ease' : 'none');
        }
    }, [translateY, refreshing]);

    React.useLayoutEffect(() => {
        if (iconRef.current) {
            iconRef.current.style.setProperty('--ptr-y', translateY.toString());
        }
    }, [translateY]);

    React.useLayoutEffect(() => {
        if (contentRef.current) {
            contentRef.current.style.setProperty('--ptr-y', translateY.toString());
            contentRef.current.style.setProperty('--ptr-content-transition', !startY ? 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none');
        }
    }, [translateY, startY]);

    return (
        <div
            ref={containerRef}
            className="h-full overflow-y-auto no-scrollbar relative touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div
                ref={indicatorRef}
                className="absolute top-0 left-0 right-0 flex justify-center items-center pointer-events-none ptr-indicator"
            >
                {refreshing ? (
                    <Loader2 className="animate-spin text-o" size={20} />
                ) : (
                    <div ref={iconRef} className="text-[9px] font-black uppercase text-o tracking-[.2em] transition-transform duration-200 ptr-icon">
                        ▼
                    </div>
                )}
            </div>

            <div
                ref={contentRef}
                className="ptr-content"
            >
                {children}
            </div>
        </div>
    );
};
