import React from 'react';
import { Apple, Facebook, X } from 'lucide-react';

interface ThirdPartyLoginButtonProps {
    provider: 'apple' | 'facebook' | 'x';
    onClick: (provider: string) => void;
}

export const ThirdPartyLoginButton: React.FC<ThirdPartyLoginButtonProps> = ({ provider, onClick }) => {
    const getIcon = () => {
        switch (provider) {
            case 'apple': return <Apple size={24} />;
            case 'facebook': return <Facebook size={24} />;
            case 'x': return <X size={24} />;
        }
    };

    const getLabel = () => {
        switch (provider) {
            case 'apple': return 'Apple';
            case 'facebook': return 'Facebook';
            case 'x': return 'X';
        }
    };

    return (
        <button
            onClick={() => onClick(provider)}
            className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all mb-3 backdrop-blur-md border border-white/5"
            aria-label={`Continue with ${getLabel()}`}
        >
            {getIcon()}
            <span className="font-medium tracking-wide">Continue with {getLabel()}</span>
        </button>
    );
};
