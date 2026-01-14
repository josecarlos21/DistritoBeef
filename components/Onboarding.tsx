
import React, { useState } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { cx } from '../utils';
import { useAuth } from '../src/context/AuthContext';
import { useLocale } from '../src/context/LocaleContext';

export const Onboarding: React.FC = () => {
  const { validatePin, login } = useAuth();
  const [step, setStep] = useState(0);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(false);
  const { t } = useLocale();

  const handleCode = (val: string) => {
    if (val.length > 4) return;
    setCode(val);
    setError(false);
  };

  const submitCode = () => {
    if (validatePin(code)) {
      setStep(2); // Go to Name step
    } else {
      setError(true);
      setTimeout(() => setCode(''), 500);
    }
  };

  const submitName = () => {
    if (name.trim().length > 0) {
      login(name);
    }
  };

  return (
    <div className="absolute inset-0 z-[200] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700 bg-deep">

      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] opacity-30"
          style={{ background: "radial-gradient(circle, var(--c) 0%, transparent 60%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-xs">
        {step === 0 ? (
          <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[.4em] mb-4 text-o">{t('onboarding.welcomeTo')}</div>
              <h1 className="text-5xl font-black tracking-tighter text-white mb-2 leading-[0.9] font-display">
                DISTRICT<br /><span className="text-s">VALLARTA</span>
              </h1>
            </div>

            <p className="text-sm font-medium text-m leading-relaxed">
              {t('onboarding.description')}
            </p>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full h-14 rounded-full bg-white text-black font-black uppercase tracking-[.2em] text-[11px] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              {t('action.start')} <ArrowRight size={16} strokeWidth={3} />
            </button>
          </div>
        ) : step === 1 ? (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-2xl border border-b bg-white/5 flex items-center justify-center">
                <Lock size={20} className="text-tx" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-1 font-display">{t('onboarding.accessCode')}</h2>
              <p className="text-xs text-f uppercase tracking-wider">{t('onboarding.enterWalletPass')}</p>
            </div>

            <div className="relative">
              <input
                id="pin-input"
                type="tel"
                value={code}
                onChange={(e) => handleCode(e.target.value)}
                className={cx(
                  "w-full h-16 bg-transparent border-b-2 text-center text-3xl font-mono focus:outline-none transition-colors",
                  error ? "border-red-500 text-red-500" : "border-b focus:border-o text-white"
                )}
                placeholder="____"
                aria-label="Ingresa el PIN de 4 dígitos"
                maxLength={4}
                autoFocus
              />
            </div>

            <button
              type="button"
              onClick={submitCode}
              disabled={code.length !== 4}
              className="w-full h-14 rounded-2xl bg-o text-black font-black uppercase tracking-[.2em] text-[10px] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all mt-4"
            >
              {t('action.next')}
            </button>

            <div className="text-[9px] text-f mt-4">
              {t('onboarding.useDemo')}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
            <div>
              <h2 className="text-xl font-bold text-white mb-1 font-display">{t('onboarding.namePrompt')}</h2>
              <p className="text-xs text-f uppercase tracking-wider">{t('onboarding.nameHint')}</p>
            </div>

            <input
              id="name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-16 bg-transparent border-b-2 border-b focus:border-o text-center text-2xl font-bold text-white focus:outline-none transition-colors placeholder:text-white/20"
              placeholder="Tu Nombre"
              aria-label="Ingresa tu nombre"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && submitName()}
            />

            <button
              type="button"
              onClick={submitName}
              disabled={name.trim().length === 0}
              className="w-full h-14 rounded-2xl bg-white text-black font-black uppercase tracking-[.2em] text-[10px] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all mt-4 shadow-lg"
            >
              {t('action.enter')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
