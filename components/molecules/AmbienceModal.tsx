import React, { useState, useEffect } from 'react';
import FocusLock from 'react-focus-lock';
import { Sparkles, X } from 'lucide-react';
import { AmbienceState } from '../../src/types';
import { GlassContainer, IconButton } from '../atoms';
import { clamp } from '../../src/utils';
import { INITIAL_AMBIENCE } from '../../constants';
import { useLocale } from '../../src/context/LocaleContext';

interface AmbienceModalProps {
  open: boolean;
  onClose: () => void;
  ambience: AmbienceState;
  setAmbience: React.Dispatch<React.SetStateAction<AmbienceState>>;
}

const ControlRow = ({ id, label, value, min, max, step, unit, onChange }: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: boolean;
  onChange: (n: number) => void;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="text-[10px] font-black uppercase tracking-[.18em] text-m">{label}</label>
      <span className="text-[10px] font-black uppercase tracking-[.18em] text-f">
        {unit ? `${Math.round(value)}°` : `${Math.round(value * 100)}%`}
      </span>
    </div>
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={e => onChange(+e.target.value)}
      className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-o"
      aria-label={label}
    />
  </div>
);

export const AmbienceModal: React.FC<AmbienceModalProps> = ({ open, onClose, ambience, setAmbience }) => {
  const { t } = useLocale();
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if react-focus-lock is available at runtime
    setIsInstalled(true);
  }, []);

  if (!open) return null;

  const content = (
    <div className="absolute inset-0 z-[120] flex items-center justify-center p-6">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        aria-label={t('action.close', 'Cerrar')}
      />
      <div className="relative w-full max-w-sm">
        <GlassContainer strong className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl border flex items-center justify-center bg-black/30 border-b">
                <Sparkles size={16} className="text-o" strokeWidth={2.8} />
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-tight text-tx">Ambiente</div>
                <div className="text-[9px] font-black uppercase tracking-[.22em] text-f">Glow / Aurora / Trails</div>
              </div>
            </div>
            <IconButton Icon={X} onClick={onClose} label={t('action.close', 'Cerrar')} />
          </div>

          <div className="space-y-4">
            <ControlRow id="nebula-val" label="Nebula" value={ambience.g} min={0} max={1} step={.01} onChange={v => setAmbience((s: AmbienceState) => ({ ...s, g: clamp(v, 0, 1) }))} />
            <ControlRow id="hue-val" label="Hue" value={ambience.h} min={0} max={360} step={1} unit onChange={v => setAmbience((s: AmbienceState) => ({ ...s, h: clamp(v, 0, 360) }))} />
            <ControlRow id="aurora-val" label="Aurora" value={ambience.a} min={0} max={1} step={.01} onChange={v => setAmbience((s: AmbienceState) => ({ ...s, a: clamp(v, 0, 1) }))} />
            <ControlRow id="trails-val" label="Trails" value={ambience.t} min={0} max={1} step={.01} onChange={v => setAmbience((s: AmbienceState) => ({ ...s, t: clamp(v, 0, 1) }))} />

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setAmbience(INITIAL_AMBIENCE)}
                className="h-11 rounded-2xl border font-black uppercase tracking-[.18em] text-[10px] active:scale-[.99] transition backdrop-blur-2xl bg-black/30 border-b text-tx"
              >
                {t('action.reset')}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-11 rounded-2xl font-black uppercase tracking-[.18em] text-[10px] active:scale-[.99] transition bg-o text-[#0E0C09]"
              >
                {t('action.done')}
              </button>
            </div>
          </div>
        </GlassContainer>
      </div>
    </div>
  );

  return isInstalled ? <FocusLock>{content}</FocusLock> : content;
};
