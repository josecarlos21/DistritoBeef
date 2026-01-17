/**
 * Structured Logger with Trace Context Support
 * 
 * Provides type-safe logging with automatic trace context injection
 * and support for different log levels.
 * 
 * Note: OpenTelemetry integration can be added later via @opentelemetry/api
 */

// Simplified trace context for now (can be replaced with OTel later)
interface TraceContext {
    traceId?: string;
    spanId?: string;
}

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    CRITICAL = 4,
}

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

    private getTraceContext(): TraceContext {
        // Simple trace ID generation (can be replaced with OTel later)
        return {
            traceId: crypto.randomUUID?.() || Date.now().toString(36),
        };
    }

    private log(level: LogLevel, message: string, ctx: LogContext = {}, error?: Error): void {
        if (level < this.minLevel) return;

        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level: LogLevel[level],
            message,
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

        // Console output for development
        const logFn = level >= LogLevel.ERROR ? console.error :
            level === LogLevel.WARN ? console.warn :
                console.log;

        logFn(JSON.stringify(entry));

        // Send ERROR+ to analytics in production
        if (level >= LogLevel.ERROR && import.meta.env.PROD) {
            this.sendToAnalytics(entry);
        }
    }

    private async sendToAnalytics(entry: LogEntry): Promise<void> {
        try {
            // Send to Cloudflare Workers Analytics or similar
            await fetch('/api/logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry),
            });
        } catch (err) {
            console.error('Failed to send log to analytics:', err);
        }
    }

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
}

// Singleton instance
export const logger = new Logger(
    import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO
);
