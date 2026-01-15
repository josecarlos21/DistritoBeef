import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY_DEMO = 'app.session.demo_authenticated';
// Explicitly labeled as DEMO PINS to avoid security confusion.
// This is not real authentication, just a simple gate for the demo experience.
const DEMO_PINS = ['2026', '0000'];

export const IS_DEMO_MODE = true;

interface User {
    name: string;
    isDemoUser: boolean;
}

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    login: (name: string) => void;
    logout: () => void;
    validatePin: (pin: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        try {
            const isAuth = localStorage.getItem(STORAGE_KEY_DEMO) === 'true';
            const savedName = localStorage.getItem('app.session.username');

            if (isAuth) {
                setIsAuthenticated(true);
                if (savedName) setUser({ name: savedName, isDemoUser: true });
            }
        } catch {
            console.warn('Failed to restore demo session');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = (name: string) => {
        setIsAuthenticated(true);
        setUser({ name, isDemoUser: true });
        try {
            localStorage.setItem(STORAGE_KEY_DEMO, 'true');
            localStorage.setItem('app.session.username', name);
        } catch { /* ignore */ }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        try {
            localStorage.removeItem(STORAGE_KEY_DEMO);
            localStorage.removeItem('app.session.username');
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
