import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './src/theme/theme.css';
import 'leaflet/dist/leaflet.css';

// Only try to register the service worker in production where Vite PWA emits it
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Silent failure; offline support best-effort
    });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
