import React, { createContext, useContext, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { logger } from '@/utils/logger';
import { rateLimiter } from '@/utils/rateLimiter';

// Explicitly labeled as DEMO PINS to avoid security confusion.
const DEMO_PINS = (import.meta.env.VITE_ACCESS_PINS || '').split(',').filter(Boolean);

interface AuthContextType {
    isAuthenticated: boolean;
    hasAccess: boolean;
    isLoading: boolean;
    user: { id: string; name: string; img?: string; provider: string; isDemoUser: boolean } | null;
    login: (name: string, provider: 'apple' | 'facebook' | 'x' | 'pin' | 'guest', img?: string) => void;
    enterAsGuest: () => void;
    logout: () => void;
    validatePin: (pin: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const store = useAppStore();

    // Sync store logout with legacy cleanup if needed
    useEffect(() => {
        if (!store.hasAccess) {
            try {
                localStorage.removeItem('distrito_beef_agenda'); // Legacy cleanup
            } catch { /* ignore */ }
        }
    }, [store.hasAccess]);

    const validatePin = (pin: string): boolean => {
        // Check rate limit first
        const identifier = `pin-validation-${navigator.userAgent.slice(0, 50)}`; // Simple fingerprint
        const limitCheck = rateLimiter.checkLimit(identifier);

        if (!limitCheck.allowed) {
            logger.warn('PIN validation rate limit exceeded', {
                identifier,
                resetAt: limitCheck.resetAt?.toISOString(),
            });
            return false;
        }

        const isValid = DEMO_PINS.includes(pin);

        if (isValid) {
            logger.info('User Authenticated via PIN', {
                timestamp: new Date().toISOString(),
                method: 'PIN',
                remaining: limitCheck.remaining,
            });
            // Reset rate limit on successful auth
            rateLimiter.reset(identifier);
        } else {
            logger.warn('Failed PIN validation attempt', {
                pinLength: pin.length,
                remaining: limitCheck.remaining,
            });
        }

        return isValid;
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated: store.isAuthenticated,
            hasAccess: store.hasAccess,
            isLoading: false,
            user: store.user,
            login: store.login,
            enterAsGuest: store.enterAsGuest,
            logout: store.logout,
            validatePin
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
