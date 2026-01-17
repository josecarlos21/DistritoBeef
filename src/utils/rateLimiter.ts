/**
 * Rate Limiter for PIN Validation
 * 
 * Implements sliding window rate limiting to prevent brute-force attacks.
 * Stores attempt counts in memory (can be upgraded to KV for distributed systems).
 */

interface RateLimitEntry {
    attempts: number;
    firstAttempt: number;
    blocked: boolean;
    blockedUntil?: number;
}

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutes

class RateLimiter {
    private store: Map<string, RateLimitEntry> = new Map();

    private getKey(identifier: string): string {
        // In production, use IP address or device fingerprint
        return `ratelimit:${identifier}`;
    }

    private cleanup(): void {
        const now = Date.now();
        for (const [key, entry] of this.store.entries()) {
            // Remove expired entries
            if (now - entry.firstAttempt > WINDOW_MS && !entry.blocked) {
                this.store.delete(key);
            }
            // Unblock after block duration
            if (entry.blocked && entry.blockedUntil && now > entry.blockedUntil) {
                this.store.delete(key);
            }
        }
    }

    checkLimit(identifier: string): { allowed: boolean; remaining: number; resetAt?: Date } {
        this.cleanup();

        const key = this.getKey(identifier);
        const entry = this.store.get(key);
        const now = Date.now();

        // First attempt
        if (!entry) {
            this.store.set(key, {
                attempts: 1,
                firstAttempt: now,
                blocked: false,
            });
            return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
        }

        // Blocked
        if (entry.blocked && entry.blockedUntil && now < entry.blockedUntil) {
            return {
                allowed: false,
                remaining: 0,
                resetAt: new Date(entry.blockedUntil),
            };
        }

        // Window expired, reset
        if (now - entry.firstAttempt > WINDOW_MS) {
            this.store.set(key, {
                attempts: 1,
                firstAttempt: now,
                blocked: false,
            });
            return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
        }

        // Increment attempts
        entry.attempts++;

        // Block if exceeded
        if (entry.attempts > MAX_ATTEMPTS) {
            entry.blocked = true;
            entry.blockedUntil = now + BLOCK_DURATION_MS;
            this.store.set(key, entry);
            return {
                allowed: false,
                remaining: 0,
                resetAt: new Date(entry.blockedUntil),
            };
        }

        this.store.set(key, entry);
        return {
            allowed: true,
            remaining: MAX_ATTEMPTS - entry.attempts,
        };
    }

    reset(identifier: string): void {
        const key = this.getKey(identifier);
        this.store.delete(key);
    }
}

export const rateLimiter = new RateLimiter();
