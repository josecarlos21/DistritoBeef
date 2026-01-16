import React, { createContext, useContext, useEffect, useState } from 'react';

// Explicitly labeled as DEMO PINS to avoid security confusion.
// This is not real authentication, just a simple gate for the demo experience.
const DEMO_PINS = ['2026', '0000'];

export const IS_DEMO_MODE = true;

interface User {
    name: string;
    img?: string;
    isDemoUser: boolean;
}

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    login: (name: string, img?: string) => void;
    logout: () => void;
    validatePin: (pin: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // No persistence by design: every session requires a fresh PIN entry.
        setIsLoading(false);
    }, []);

    const login = (name: string, img?: string) => {
        setIsAuthenticated(true);
        setUser({ name, img, isDemoUser: true });
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        // Clear demo-only data to honor "no data stored" promise.
        try {
            localStorage.removeItem('distrito_beef_agenda');
            localStorage.removeItem('distrito_beef_itinerary');
        } catch { /* ignore */ }
    };

    const validatePin = (pin: string) => {
        return DEMO_PINS.includes(pin);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout, validatePin }}>
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
