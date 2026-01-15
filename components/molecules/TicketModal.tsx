import React, { useState, useEffect } from 'react';
import { Minus, Plus, CreditCard, Check, Loader2, X, Ticket } from 'lucide-react';
import { EventData } from '../../types';
import { GlassContainer, IconButton } from '../atoms';
import { useLocale } from '../../src/context/LocaleContext';
import { triggerHaptic } from '../../utils';

interface TicketModalProps {
    event: EventData | null;
    onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ event, onClose }) => {
    const { t } = useLocale();
    const [step, setStep] = useState<'select' | 'processing' | 'success'>('select');
    const [qty, setQty] = useState(1);
    const PRICE = 450; // MXN fixed for demo

    useEffect(() => {
        if (event) {
            setStep('select');
            setQty(1);
        }
    }, [event]);

    if (!event) return null;


    const handleRSVP = () => {
        triggerHaptic('heavy');
        setStep('processing');
        setTimeout(() => {
            triggerHaptic('success');
            setStep('success');
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-end justify-center sm:items-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

            <GlassContainer strong className="w-full max-w-sm overflow-hidden animate-in slide-in-from-bottom-full duration-500 rounded-t-[40px] sm:rounded-[40px]">

                {/* Header */}
                <div className="h-24 relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-cover bg-center opacity-60 dynamic-event-bg" style={{ backgroundImage: `url(${event.image})` }} />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0E0C09]" />
                    <div className="absolute top-4 right-4">
                        <IconButton Icon={X} onClick={onClose} label={t('action.close')} />
                    </div>
                    <div className="absolute bottom-2 left-6">
                        <div className="text-[10px] font-black uppercase tracking-wider text-o">RSVP / GUESTLIST</div>
                        <div className="text-xl font-black text-white font-display uppercase tracking-tight">{event.title}</div>
                    </div>
                </div>

                <div className="p-6 pt-4 min-h-[300px] flex flex-col">

                    {step === 'select' && (
                        <div className="flex-1 flex flex-col justify-between animate-in slide-in-from-right-8 duration-300">
                            <div className="space-y-6">
                                {/* Information Note */}
                                <div className="bg-[#14110C] rounded-2xl p-4 border border-white/5">
                                    <h4 className="text-white font-bold mb-1">Información del Evento</h4>
                                    <p className="text-xs text-f leading-relaxed">
                                        Este evento es informativo. Confirma tu asistencia para recibir actualizaciones y recordatorios.
                                        No se requiere pago en línea.
                                    </p>
                                </div>

                                {/* Guest Count */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black uppercase tracking-widest text-m">{t('checkout.quantity')}</span>
                                    <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-1 border border-white/10">
                                        <button
                                            type="button"
                                            onClick={() => { triggerHaptic('light'); setQty(Math.max(1, qty - 1)); }}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 active:scale-90 transition"
                                            aria-label="Disminuir cantidad"
                                        >
                                            <Minus size={16} color="white" />
                                        </button>
                                        <span className="text-xl font-black w-4 text-center text-white">{qty}</span>
                                        <button
                                            type="button"
                                            onClick={() => { triggerHaptic('light'); setQty(Math.min(10, qty + 1)); }}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-o text-black active:scale-90 transition shadow-lg"
                                            aria-label="Aumentar cantidad"
                                        >
                                            <Plus size={16} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleRSVP}
                                className="w-full h-14 mt-6 rounded-2xl bg-o text-black font-black uppercase tracking-[.2em] text-[11px] flex items-center justify-center gap-3 active:scale-[0.98] transition hover:brightness-110 shadow-[0_0_30px_rgba(255,159,69,0.3)]"
                            >
                                <Ticket size={16} strokeWidth={2.5} />
                                Confirmar Asistencia
                            </button>
                        </div>
                    )}

                    {step === 'processing' && (
                        <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-o rounded-full blur-xl opacity-20 animate-pulse" />
                                <Loader2 size={48} className="text-o animate-spin relative z-10" />
                            </div>
                            <div className="text-sm font-black uppercase tracking-widest text-white animate-pulse">{t('checkout.processing')}...</div>
                            <div className="text-xs text-f mt-2">Registrando en lista de invitados</div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 rounded-full bg-ok flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(37,192,109,0.4)] animate-in slide-in-from-bottom-4">
                                <Check size={40} className="text-black" strokeWidth={4} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2 font-display">¡Asistencia Confirmada!</h3>
                            <p className="text-xs text-f max-w-[200px] leading-relaxed mb-8">
                                Te hemos añadido a la lista de invitados para {qty} persona{qty > 1 ? 's' : ''}.
                            </p>
                            <button
                                onClick={() => { triggerHaptic('light'); onClose(); }}
                                className="px-8 py-3 rounded-xl border border-white/20 hover:bg-white/5 font-black uppercase text-[10px] tracking-widest transition text-white"
                            >
                                Cerrar
                            </button>
                        </div>
                    )}

                </div>
            </GlassContainer>
        </div>
    );
};

