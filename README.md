<div align="center">
  <img src="/public/logo.svg" alt="DistritoBeef Logo" width="120" />
  <h1>DistritoBeef</h1>
  <p><strong>The Ultimate Guide to Puerto Vallarta's BeefDip Bear Week & Community</strong></p>
</div>

---

## 🚀 Overview

DistritoBeef is a Progressive Web App (PWA) designed to provide a premium, fluid experience for attendees of BeefDip Bear Week and visitors to Puerto Vallarta's Zona Romántica. It features an interactive map, event schedule, wallet system, and community recommendations.

> **Architecture**: This project operates on a **"Local-First & Privacy-Focused"** architecture. All data persistence happens on the user's device (IndexedDB), ensuring high performance and zero-latency even with spotty connectivity.

## 🛠 Technical Stack

Built with a focus on performance, aesthetics, and type safety:

- **Core:** [Vite](https://vitejs.dev/) + [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [TailwindCSS](https://tailwindcss.com/) + Custom Glassmorphism Theme
- **State:** React Context + Hooks (Refactored for Clean Architecture)
- **Maps:** [React Leaflet](https://react-leaflet.js.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **PWA:** Vite Plugin PWA

## 📂 Project Structure

The project follows **Atomic Design** principles to ensure scalability and maintainability:

```text
src/
├── components/
│   ├── atoms/       # Basic building blocks (Badge, GlassContainer)
│   ├── molecules/   # Simple combinations (NotificationDrawer, ErrorBoundary)
│   ├── organisms/   # Complex sections (UnifiedHeader, EventList)
│   └── views/       # Full page layouts (HomeView, MapView)
├── context/         # React Context (Auth, Locale)
├── theme/           # CSS Variables & Global Styles
└── utils/           # Helper functions
```

## 🔒 Security & Performance

- **Zero Secret Leakage:** No API keys are exposed or required for the client bundle.
- **Optimized Assets:** Images are loaded via Unsplash with optimized quality/width parameters.
- **Strict Typing:** Codebase audited for explicit types (no `any`).

## 🏁 Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   ```

2. **Run locally:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 📱 Use the Demo

- **Login:** Use PIN `2026` to access the full experience.
- **Wallet:** Generates a unique, deterministic QR code based on session.

---

*(c) 2026 DistritoBeef Project*
