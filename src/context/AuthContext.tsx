import React, { createContext, useContext, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

// Explicitly labeled as DEMO PINS to avoid security confusion.
const DEMO_PINS = ['2026', '0000'];

interface AuthContextType {
    isAuthenticated: boolean;
    hasAccess: boolean;
    isLoading: boolean;
    user: { name: string; img?: string; isDemoUser: boolean } | null;
    login: (name: string, img?: string) => void;
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

    const validatePin = (pin: string) => {
        return DEMO_PINS.includes(pin);
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
