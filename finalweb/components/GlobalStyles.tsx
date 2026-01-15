
import React from 'react';
import { THEME } from '../constants';

export const GlobalStyles = () => (
  <style>{`
    :root {
      --bg: ${THEME.bg};
      --bg2: ${THEME.bg2};
      --vig: ${THEME.vig};
      --c: ${THEME.c};
      --o: ${THEME.o};
      --s: ${THEME.s};
      --ok: ${THEME.ok};
      --tx: ${THEME.tx};
      --m: ${THEME.m};
      --f: ${THEME.f};
      --gl: ${THEME.gl};
      --gs: ${THEME.gs};
      --b: ${THEME.b};
      --bs: ${THEME.bs};
      
      --ease-ios: cubic-bezier(0.32, 0.72, 0, 1);
    }

    * {
        -webkit-tap-highlight-color: transparent;
        box-sizing: border-box;
    }
    
    body {
        overscroll-behavior-y: none; /* Prevent bounce effect on body */
    }

    /* Animation Polyfills & Optimizations */
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes zoomIn95 { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    @keyframes slideInBottomFull { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes slideInBottomSmall { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideInTopSmall { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideInRightSmall { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }

    .animate-in { 
        animation-timing-function: var(--ease-ios); 
        animation-fill-mode: both; 
        will-change: transform, opacity;
    }
    
    .fade-in { animation-name: fadeIn; }
    .zoom-in-95 { animation-name: zoomIn95; }
    .slide-in-from-bottom-full { animation-name: slideInBottomFull; }
    .slide-in-from-bottom-2 { animation-name: slideInBottomSmall; }
    .slide-in-from-bottom-4 { animation-name: slideInBottomSmall; } /* Same logic, naming convention support */
    .slide-in-from-top-4 { animation-name: slideInTopSmall; }
    .slide-in-from-top-2 { animation-name: slideInTopSmall; }
    .slide-in-from-right-8 { animation-name: slideInRightSmall; }

    .duration-300 { animation-duration: 300ms; }
    .duration-500 { animation-duration: 500ms; }
    .duration-700 { animation-duration: 700ms; }
    
    .delay-100 { animation-delay: 100ms; }
    
    /* Typography Utils */
    .font-display { font-family: 'Montserrat', sans-serif; }
    .font-body { font-family: 'Inter', sans-serif; }

    /* Touch Optimizations */
    button {
        touch-action: manipulation;
        user-select: none;
        -webkit-user-select: none;
    }

    /* Custom Scrollbar Logic - Unified */
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
  `}</style>
);
