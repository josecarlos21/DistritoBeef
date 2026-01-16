import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { triggerHaptic } from '../../src/utils';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Critical System Failure:', error, errorInfo);
        // In a real app, send to Sentry/Crashlytics here
    }

    private handleReload = () => {
        triggerHaptic('medium');
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 text-center text-white font-sans z-[9999]">
                    <div className="mb-6 p-6 rounded-full bg-red-500/10 border border-red-500/20 animate-pulse">
                        <AlertTriangle size={48} className="text-red-500" />
                    </div>

                    <h1 className="text-2xl font-black uppercase tracking-tighter mb-2 font-display">
                        System Malfunction
                    </h1>
                    <p className="text-sm font-medium text-white/50 mb-8 max-w-[250px] leading-relaxed">
                        The neural interface encountered a critical anomaly. Protocol requires a system reboot.
                    </p>

                    <button
                        onClick={this.handleReload}
                        className="h-14 px-8 bg-red-600 hover:bg-red-500 rounded-xl flex items-center gap-3 transition-transform active:scale-95 shadow-[0_0_30px_rgba(220,38,38,0.4)]"
                    >
                        <RefreshCw size={20} className="animate-[spin_4s_linear_infinite]" />
                        <span className="text-xs font-black uppercase tracking-[.2em]">Reboot System</span>
                    </button>

                    <div className="absolute bottom-8 text-[9px] text-white/20 font-mono">
                        Error Code: 0x{Math.floor(Math.random() * 9999).toString(16).toUpperCase()}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
