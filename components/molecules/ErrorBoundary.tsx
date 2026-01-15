import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { GlassContainer } from '../atoms';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 flex items-center justify-center bg-black p-6 z-[9999]">
                    <GlassContainer strong className="p-8 max-w-sm w-full text-center border-red-500/30">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                            <AlertTriangle size={32} className="text-red-500" strokeWidth={2} />
                        </div>

                        <h1 className="text-xl font-black uppercase text-white mb-2 font-display tracking-wide">
                            Algo salió mal
                        </h1>

                        <p className="text-sm text-[var(--f)] mb-8 leading-relaxed font-medium opacity-80">
                            Hemos detectado un error inesperado. Por favor intenta recargar la aplicación.
                        </p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="w-full h-14 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-gray-100 active:scale-95 transition-all"
                        >
                            <RefreshCw size={16} strokeWidth={2.5} />
                            Recargar
                        </button>

                        {this.state.error && (
                            <div className="mt-8 p-4 bg-black/40 rounded-xl text-left border border-white/5 overflow-hidden">
                                <div className="text-[9px] font-bold text-red-400 font-mono break-all line-clamp-3">
                                    {this.state.error.toString()}
                                </div>
                            </div>
                        )}
                    </GlassContainer>
                </div>
            );
        }

        return this.props.children;
    }
}
