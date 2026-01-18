
import React from 'react';
import { cx } from '@/utils';

interface SkeletonProps {
    className?: string;
    variant?: 'rect' | 'circle' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, variant = 'rect' }) => {
    return (
        <div
            className={cx(
                "animate-pulse bg-white/5",
                variant === 'circle' ? "rounded-full" : "rounded-2xl",
                className
            )}
        />
    );
};

export const BentoSkeleton = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 h-[450px] gap-4 px-4 overflow-hidden animate-in fade-in duration-1000">
            {/* Hero Skeleton */}
            <div className="col-span-2 row-span-2 relative">
                <Skeleton className="w-full h-full rounded-[32px] !bg-white/10" />
                <div className="absolute bottom-6 left-6 space-y-2 w-2/3">
                    <Skeleton variant="text" className="h-4 w-1/4" />
                    <Skeleton variant="text" className="h-8 w-full" />
                </div>
            </div>

            {/* Small Cards Skeletons */}
            <Skeleton className="col-span-1 row-span-1 rounded-[32px]" />
            <Skeleton className="col-span-1 row-span-1 rounded-[32px]" />
            <Skeleton className="col-span-1 row-span-1 rounded-[32px]" />
            <Skeleton className="col-span-1 row-span-1 rounded-[32px]" />
        </div>
    );
};
