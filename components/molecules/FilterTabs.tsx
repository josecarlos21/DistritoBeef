import React from 'react';
import { cx, triggerHaptic } from '../../src/utils';

export interface FilterOption {
    id: string;
    label: string;
}

interface FilterTabsProps {
    options: FilterOption[];
    selectedId: string;
    onSelect: (id: string) => void;
    className?: string;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ options, selectedId, onSelect, className }) => (
    <div className={cx("flex gap-2 overflow-x-auto no-scrollbar", className)}>
        {options.map(f => {
            const active = selectedId === f.id;
            return (
                <button
                    type="button"
                    key={f.id}
                    onClick={() => {
                        triggerHaptic('light');
                        onSelect(f.id);
                    }}
                    aria-label={f.label}
                    className={cx(
                        "px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-[.15em] transition-all flex-shrink-0 active:scale-95",
                        active ? "bg-[var(--s)] text-[var(--bg)] border-[var(--s)] shadow-[0_0_15px_rgba(215,182,118,0.3)]" : "bg-transparent text-f border-b hover:border-s"
                    )}
                >
                    {f.label}
                </button>
            );
        })}
    </div>
);
