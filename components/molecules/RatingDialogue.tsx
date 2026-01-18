import React, { useState, useEffect } from 'react';
import { Star, X, Check } from 'lucide-react';
import { triggerHaptic, cx } from '@/utils';

interface RatingDialogueProps {
    isOpen: boolean;
    onClose: () => void;
    onRate: (rating: number) => void;
    title: string;
}

const QUESTIONS_POOL = [
    '¿Qué tal la música?',
    '¿Nivel de ligue?',
    '¿Ambiente general?',
    '¿Calidad del servicio?',
    '¿Energía de la gente?',
    '¿Iluminación y show?',
    '¿Volverías mañana?',
];

export const RatingDialogue: React.FC<RatingDialogueProps> = ({ isOpen, onClose, onRate, title }) => {
    const [answers, setAnswers] = useState<Record<number, number>>({});

    const [questions, setQuestions] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            // Defer state update to next tick to avoid synchronous set-state-in-effect warning
            setTimeout(() => {
                const shuffled = [...QUESTIONS_POOL].sort(() => 0.5 - Math.random());
                setQuestions(shuffled.slice(0, 3));
            }, 0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleStarClick = (questionIndex: number, star: number) => {
        triggerHaptic('light');
        setAnswers(prev => ({ ...prev, [questionIndex]: star }));
    };

    const isComplete = questions.length > 0 && Object.keys(answers).length === questions.length;

    const handleSubmit = () => {
        if (!isComplete) return;
        triggerHaptic('success');

        // Calculate average rating
        const total = Object.values(answers).reduce((acc, curr) => acc + curr, 0);
        const average = Number((total / questions.length).toFixed(1));

        // Show Demo Alert
        alert("Modo Demo: Tu calificación se ha registrado localmente.\n\nEn próximas versiones se guardará en la nube.");

        onRate(average);
        onClose();
        // Reset after closing
        setTimeout(() => setAnswers({}), 300);
    };

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in"
                onClick={onClose}
            />

            <div className="relative w-full max-w-sm bg-deep border border-white/10 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-5">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white"
                    aria-label="Cerrar"
                >
                    <X size={20} />
                </button>

                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2 text-center">
                    Califica tu Experiencia
                </h3>
                <p className="text-white/50 text-xs text-center mb-6 uppercase tracking-widest">
                    {title}
                </p>

                <div className="space-y-6">
                    {questions.map((q, qIdx) => (
                        <div key={qIdx} className="space-y-2">
                            <p className="text-white/90 text-sm font-medium text-center">{q}</p>
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        id={`q - ${qIdx} -s - ${star} `}
                                        onClick={() => handleStarClick(qIdx, star)}
                                        className={cx(
                                            "p-1 transition-all active:scale-90",
                                            (answers[qIdx] || 0) >= star ? "text-o scale-110" : "text-white/20 hover:text-white/40"
                                        )}
                                        aria-label={`Calificar ${star} estrellas`}
                                    >
                                        <Star
                                            size={24}
                                            className={(answers[qIdx] || 0) >= star ? "fill-current" : ""}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!isComplete}
                    className={cx(
                        "w-full mt-8 h-12 rounded-xl flex items-center justify-center gap-2 font-black uppercase tracking-widest transition-all",
                        isComplete
                            ? "bg-o text-white shadow-lg shadow-o/20 hover:scale-[1.02] active:scale-[0.98]"
                            : "bg-white/10 text-white/30 cursor-not-allowed"
                    )}
                >
                    {isComplete ? (
                        <>
                            <Check size={18} />
                            Enviar Rating
                        </>
                    ) : (
                        <span>Responde todo</span>
                    )}
                </button>
            </div>
        </div>
    );
};
