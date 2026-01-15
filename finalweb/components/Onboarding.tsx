
import React, { useState } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { cx } from '../utils';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleCode = (val: string) => {
    if (val.length > 4) return;
    setCode(val);
    setError(false);
  };

  const submit = () => {
    if (code === '2026' || code === '0000') {
      onComplete();
    } else {
      setError(true);
      setTimeout(() => setCode(''), 500);
    }
  };

  return (
    <div className="absolute inset-0 z-[200] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700" style={{ background: "var(--bg)" }}>
      
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] opacity-30" 
             style={{ background: "radial-gradient(circle, var(--c) 0%, transparent 60%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-xs">
        {step === 0 ? (
          <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[.4em] mb-4 text-[var(--o)]">Bienvenido a</div>
              <h1 className="text-5xl font-black tracking-tighter text-white mb-2 leading-[0.9] font-display">
                DISTRICT<br/><span className="text-[var(--s)]">VALLARTA</span>
              </h1>
            </div>
            
            <p className="text-sm font-medium text-[var(--m)] leading-relaxed">
              Tu compañero inmersivo para el distrito. Eventos en tiempo real, mapa de calor social y acceso exclusivo.
            </p>

            <button 
              onClick={() => setStep(1)}
              className="w-full h-14 rounded-full bg-white text-black font-black uppercase tracking-[.2em] text-[11px] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              Comenzar <ArrowRight size={16} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-2xl border border-[var(--b)] bg-white/5 flex items-center justify-center">
                <Lock size={20} color="var(--tx)" />
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-white mb-1 font-display">Código de Acceso</h2>
              <p className="text-xs text-[var(--f)] uppercase tracking-wider">Ingresa tu pass del wallet</p>
            </div>

            <div className="relative">
              <input 
                type="tel" 
                value={code}
                onChange={(e) => handleCode(e.target.value)}
                className={cx(
                  "w-full h-16 bg-transparent border-b-2 text-center text-3xl font-mono text-white focus:outline-none transition-colors",
                  error ? "border-red-500 text-red-500" : "border-[var(--b)] focus:border-[var(--o)]"
                )}
                placeholder="____"
              />
            </div>

            <button 
              onClick={submit}
              disabled={code.length !== 4}
              className="w-full h-14 rounded-2xl bg-[var(--o)] text-black font-black uppercase tracking-[.2em] text-[10px] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all mt-4"
            >
              Desbloquear
            </button>
            
            <div className="text-[9px] text-[var(--f)] mt-4">
              Usa <span className="text-white font-mono">2026</span> para demo
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
