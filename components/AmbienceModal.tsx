import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { AmbienceState } from '../types';
import { GlassContainer, IconButton } from './UI';
import { clamp } from '../utils';
import { INITIAL_AMBIENCE } from '../constants';

interface AmbienceModalProps {
  open: boolean;
  onClose: () => void;
  ambience: AmbienceState;
  setAmbience: React.Dispatch<React.SetStateAction<AmbienceState>>;
}

const ControlRow = ({ label, value, min, max, step, unit, onChange }: { 
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
      <span className="text-[10px] font-black uppercase tracking-[.18em]" style={{ color: "var(--m)" }}>{label}</span>
      <span className="text-[10px] font-black uppercase tracking-[.18em]" style={{ color: "var(--f)" }}>
        {unit ? `${Math.round(value)}°` : `${Math.round(value * 100)}%`}
      </span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step} 
      value={value} 
      onChange={e => onChange(+e.target.value)} 
      className="w-full" 
    />
  </div>
);

export const AmbienceModal: React.FC<AmbienceModalProps> = ({ open, onClose, ambience, setAmbience }) => {
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-[120] flex items-center justify-center p-6">
      <button onClick={onClose} className="absolute inset-0" style={{ background: "rgba(0,0,0,.55)" }} />
      <div className="relative w-full max-w-sm">
        <GlassContainer strong className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl border flex items-center justify-center" style={{ background: "rgba(0,0,0,.28)", borderColor: "var(--b)" }}>
                <Sparkles size={16} color="var(--o)" strokeWidth={2.8} />
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-tight" style={{ color: "var(--tx)" }}>Ambiente</div>
                <div className="text-[9px] font-black uppercase tracking-[.22em]" style={{ color: "var(--f)" }}>Glow / Aurora / Trails</div>
              </div>
            </div>
            <IconButton Icon={X} onClick={onClose} label="Cerrar" />
          </div>
          
          <div className="space-y-4">
            <ControlRow label="Nebula" value={ambience.g} min={0} max={1} step={.01} onChange={v => setAmbience(s => ({ ...s, g: clamp(v, 0, 1) }))} />
            <ControlRow label="Hue" value={ambience.h} min={0} max={360} step={1} unit onChange={v => setAmbience(s => ({ ...s, h: clamp(v, 0, 360) }))} />
            <ControlRow label="Aurora" value={ambience.a} min={0} max={1} step={.01} onChange={v => setAmbience(s => ({ ...s, a: clamp(v, 0, 1) }))} />
            <ControlRow label="Trails" value={ambience.t} min={0} max={1} step={.01} onChange={v => setAmbience(s => ({ ...s, t: clamp(v, 0, 1) }))} />
            
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button 
                onClick={() => setAmbience(INITIAL_AMBIENCE)} 
                className="h-11 rounded-2xl border font-black uppercase tracking-[.18em] text-[10px] active:scale-[.99] transition backdrop-blur-2xl" 
                style={{ background: "rgba(0,0,0,.28)", borderColor: "var(--b)", color: "var(--tx)" }}
              >
                Reset
              </button>
              <button 
                onClick={onClose} 
                className="h-11 rounded-2xl font-black uppercase tracking-[.18em] text-[10px] active:scale-[.99] transition" 
                style={{ background: "var(--o)", color: "#0E0C09" }}
              >
                Listo
              </button>
            </div>
          </div>
        </GlassContainer>
      </div>
    </div>
  );
};
