
import React, { useState, useEffect } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { cx } from '../../src/utils';
import { useAuth } from '../../src/context/AuthContext';
import { useLocale } from '../../src/context/LocaleContext';
export const Onboarding: React.FC = () => {
  const { validatePin, login, enterAsGuest } = useAuth();
  const [step, setStep] = useState(0);
  const [code, setCode] = useState('2026');
  const [name, setName] = useState('');
  const [error, setError] = useState(false);
  const { t } = useLocale();

  const handleCode = (val: string) => {
    if (val.length > 4) return;
    setCode(val);
    setError(false);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(false);
        setCode('');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const submitCode = () => {
    if (validatePin(code)) {
      setStep(2); // Go to Name step
    } else {
      setError(true);
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
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] opacity-30 bg-radial-faded" />
      </div>

      <div className="relative z-10 w-full max-w-xs">
        {step === 0 ? (
          <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[.4em] mb-4 text-o">{t('onboarding.welcomeTo')}</div>
              <h1 className="text-5xl font-black tracking-tighter text-white mb-2 leading-[0.9] font-display">
                DISTRICT<br /><span className="text-s"><span className="text-o">V</span>ALLARTA</span> <span className="text-[8px] text-white/30 font-bold tracking-wider">1.0.1</span>
              </h1>
            </div>

            <p className="text-sm font-medium text-m leading-relaxed">
              {t('onboarding.description')}
            </p>

            <div className="text-[10px] text-f uppercase tracking-widest leading-relaxed bg-white/5 border border-white/10 rounded-2xl p-3">
              Demo informativa: no almacenamos tus datos en servidores; el acceso requiere PIN y la agenda se queda solo en tu dispositivo.
            </div>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full h-14 rounded-full bg-white text-black font-black uppercase tracking-[.2em] text-[11px] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] mb-4"
            >
              {t('action.start')} <ArrowRight size={16} strokeWidth={3} />
            </button>

            <button
              type="button"
              onClick={enterAsGuest}
              className="w-full h-12 rounded-full bg-white/5 border border-white/10 text-white font-bold uppercase tracking-[.15em] text-[10px] flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
            >
              Continuar como Invitado
            </button>

            {/* Third-party shortcuts removed to enforce PIN-only entry */}
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

            <button
              type="button"
              onClick={() => { setStep(0); setCode(''); setError(false); }}
              className="w-full h-10 mt-2 rounded-2xl bg-transparent text-white/50 font-bold uppercase tracking-[.15em] text-[9px] hover:text-white active:scale-95 transition-all"
            >
              {t('action.cancel', 'Cancelar')}
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
      <div className="absolute bottom-4 left-4 right-4 text-center z-10 pointer-events-none opacity-40">
        <p className="text-[7px] text-f uppercase tracking-wider leading-relaxed max-w-md mx-auto">
          AVISO LEGAL: Esta aplicación opera exclusivamente como una herramienta informativa de itinerario y guía.
          No está afiliada oficialmente con los organizadores de los eventos.
          La información puede cambiar sin previo aviso.
          Verifique siempre los horarios y ubicaciones en los canales oficiales de cada evento.
          Distrito Vallarta no asume responsabilidad por cambios de agenda, cancelaciones o errores en la información.
        </p>
      </div>
    </div>
  );
};
