
import React from 'react';

// Uses CSS variables from theme.css; keeps utility styles here.
export const GlobalStyles = () => (
    <style>{`
    * {
        -webkit-tap-highlight-color: transparent;
        box-sizing: border-box;
    }
    
    body {
        margin: 0;
        padding: 0;
        background: #0E0C09; /* Core Dark Onyx */
        color: var(--tx);
        overscroll-behavior-y: none; /* Prevent bounce effect on body */
    }

    /* Animation Polyfills & Optimizations */
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes zoomIn95 { from { opacity: 0; transform: scale(0.95); } to { transform: scale(1); } }
    @keyframes scan { 0% { top: -20%; } 100% { top: 120%; } }
    @keyframes slideInBottomFull { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes slideInBottomSmall { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideInTopSmall { from { opacity: 0; transform: translateY(-20px); } to { transform: translateY(0); } }
    @keyframes slideInRightSmall { from { opacity: 0; transform: translateX(20px); } to { transform: translateX(0); } }

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

    /* Utility Classes - Pink Dance & Atomic Design */
    .bg-aurora-nebula { background: radial-gradient(circle at 50% 18%, rgba(255,138,29,.12), rgba(0,0,0,0) 58%); }
    .bg-aurora-depth { background: radial-gradient(circle at 26% 72%, rgba(90,58,37,.20), rgba(0,0,0,0) 58%); }
    .bg-aurora-glow { background: radial-gradient(circle at 70% 68%, rgba(216,194,162,.06), rgba(0,0,0,0) 62%); }
    .bg-vignette { background: radial-gradient(circle at 50% 68%, var(--vig), rgba(0,0,0,0) 62%); }

    .nav-map-btn {
        background: var(--o);
        border-color: rgba(14, 12, 9, 1);
    }

    /* Color & Border Utilities */
    .text-tx { color: var(--tx); }
    .text-o { color: var(--o); }
    .text-s { color: var(--s); }
    .text-f { color: var(--f); }
    .text-m { color: var(--m); }
    .text-ok { color: var(--ok); }
    .border-b { border-color: var(--b); }
    .border-bs { border-color: var(--bs); }
    .border-o { border-color: var(--o); }
    .bg-o { background: var(--o); }
    .bg-ok { background: var(--ok); }
    .bg-black-40 { background: rgba(0,0,0,0.4); }
    .bg-black-55 { background: rgba(0,0,0,0.55); }
    .bg-black-85 { background: rgba(0,0,0,0.85); }
    .bg-glass { background: rgba(14, 12, 9, 0.6); }
    .bg-glass-light { background: var(--gl); }
    .bg-glass-strong { background: var(--gs); }
    .bg-deep { background: #1a120b; }
    
    .border-white-10 { border-color: rgba(255,255,255,0.1); }
    .border-white-20 { border-color: rgba(255,255,255,0.2); }
    .border-b { border-color: var(--b); }
    
    .text-tx { color: var(--tx); }
    .text-o { color: var(--o); }
    .text-s { color: var(--s); }
    .text-f { color: var(--f); }
    .text-m { color: var(--m); }
    .text-ok { color: var(--ok); }
    .text-white-45 { color: rgba(255,255,255,0.45); }
    
    .accent-o { accent-color: var(--o); }

    .hero-gradient { background: linear-gradient(to top, #0E0C09 5%, rgba(14,12,9,0.5) 40%, rgba(14,12,9,0) 80%); }

    /* Custom Scrollbar Logic - Unified */
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    /* Linting Fix Utilities */
    /* PINK DANCE DESIGN SYSTEM TOKENS 
       - Core: Onyx/Black (#0E0C09)
       - Accent: Orange/District (#F97316 - var(--o))
       - Secondary: Gold/Sand (#D8C2A2 - var(--s))
       - Community: Blue (#3B82F6 - var(--c))
    */
    .bg-theme-main { background: var(--bg); }
    
    .badge-dot { 
        background: var(--badge-color); 
        color: var(--badge-color); 
    }
    
    .dynamic-event-bg {
        background: var(--event-bg);
        background-size: cover;
        background-position: center;
    }

    .mask-gradient-bottom {
        mask-image: linear-gradient(to bottom, black 85%, transparent);
        -webkit-mask-image: linear-gradient(to bottom, black 85%, transparent);
    }
    
    .drawer-item { 
        animation-delay: var(--delay); 
    }

    /* Pull To Refresh Dynamic Classes */
    .ptr-indicator {
        height: 60px;
        transform: translate3d(0, calc(var(--ptr-y) * 1px - 60px), 0);
        opacity: var(--ptr-opacity);
        transition: var(--ptr-transition);
    }
    
    .ptr-content {
        transform: translate3d(0, calc(var(--ptr-y) * 1px), 0);
        transition: var(--ptr-content-transition);
    }

    .ptr-icon {
        transform: rotate(calc(var(--ptr-y) * 3deg));
    }

    /* Wallet View */
    .wallet-code-on { background: #0E0C09; }
    .wallet-code-off { background: #e5e5e5; }
    
    /* Onboarding */
    .bg-radial-faded { background: radial-gradient(circle, var(--c) 0%, transparent 60%); }

  `}</style>
);
