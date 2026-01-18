/**
 * Structured Logger with Governance SDK Support
 * 
 * Provides type-safe logging with automatic trace context injection
 * and enforcement of Semantic Prefixes (SSOT).
 */

import {
    GovernanceScope,
    TelemetryPrefix,
    EventDescriptor,
    TelemetryEvent,
    validateEvent
} from '@/lib/governance';

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    CRITICAL = 4,
}

// Re-export SDK types for consumers
export { GovernanceScope, TelemetryPrefix, EventDescriptor };

interface LogContext {
    userId?: string;
    sessionId?: string;
    traceId?: string;
    spanId?: string;
    [key: string]: unknown;
}

interface LogEntry {
    timestamp: string;
    level: string;
    message: string;
    telemetry?: TelemetryEvent; // Optional structured telemetry
    context: LogContext;
    error?: {
        name: string;
        message: string;
        stack?: string;
    };
}

class Logger {
    private minLevel: LogLevel;

    constructor(minLevel: LogLevel = LogLevel.INFO) {
        this.minLevel = minLevel;
    }

    private getTraceContext(): { traceId?: string } {
        // Simple trace ID generation
        return {
            traceId: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36),
        };
    }

    private log(level: LogLevel, message: string, ctx: LogContext = {}, error?: Error, telemetry?: TelemetryEvent): void {
        if (level < this.minLevel) return;

        // Governance Validation on Telemetry
        if (telemetry && !validateEvent(telemetry)) {
            console.warn(`[GOVERNANCE VIOLATION] Invalid telemetry event: ${JSON.stringify(telemetry)}`);
            // We still log, but flag it locally
        }

        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level: LogLevel[level],
            message,
            telemetry,
            context: {
                ...ctx,
                ...this.getTraceContext(),
            },
        };

        if (error) {
            entry.error = {
                name: error.name,
                message: error.message,
                stack: error.stack,
            };
        }

        // Console output
        const logFn = level >= LogLevel.ERROR ? console.error :
            level === LogLevel.WARN ? console.warn :
                console.log;

        // Dev-friendly output
        if (import.meta.env.DEV) {
            logFn(`[${LogLevel[level]}] ${message}`, entry);
        } else {
            logFn(JSON.stringify(entry));
        }

        // Send ERROR+ to analytics in production
        if (level >= LogLevel.ERROR && import.meta.env.PROD) {
            this.sendToAnalytics(entry);
        }
    }

    private async sendToAnalytics(entry: LogEntry): Promise<void> {
        try {
            await fetch('/api/logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry),
            });
        } catch (err) {
            console.error('Failed to send log to analytics:', err);
        }
    }

    // --- Standard Methods ---

    debug(message: string, context?: LogContext): void {
        this.log(LogLevel.DEBUG, message, context);
    }

    info(message: string, context?: LogContext): void {
        this.log(LogLevel.INFO, message, context);
    }

    warn(message: string, context?: LogContext): void {
        this.log(LogLevel.WARN, message, context);
    }

    error(message: string, context?: LogContext, error?: Error): void {
        this.log(LogLevel.ERROR, message, context, error);
    }

    critical(message: string, context?: LogContext, error?: Error): void {
        this.log(LogLevel.CRITICAL, message, context, error);
    }

    // --- Governance-Aware Methods ---

    /**
     * Log a strictly typed telemetry event
     */
    track(
        prefix: TelemetryPrefix,
        scope: GovernanceScope,
        descriptor: EventDescriptor,
        value?: number,
        unit?: string
    ) {
        const event: TelemetryEvent = { prefix, scope, descriptor, value, unit };
        this.log(LogLevel.INFO, `[TELEM] ${prefix}-${scope}-${descriptor}`, {}, undefined, event);
    }
}

// Singleton instance
export const logger = new Logger(
    import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO
);
