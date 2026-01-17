# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2026-01-17

### Added
- **Live Event Gamified Ranking**: Users can now rate events during a live window (1 hour before/after) using a dynamic questionnaire (Music, Vibe, Service, etc.) instead of generic stars.
- **Offline-First Architecture**: Implemented `IndexedDB` storage adaptation for `Zustand`, allowing the app to basic functions (Agenda, User Session) without internet.
- **Service Worker**: Added PWA capabilities with `vite-plugin-pwa` for asset caching and offline fallback.
- **Offline Indicator**: Non-intrusive UI notification when the device loses connectivity.
- **Documentation**: Added `CONTRIBUTING.md` and `DEPLOYMENT.md` guides.

### Changed
- **EventDetail UI**: Redesigned to be more compact ("Bento" style) on desktop and mobile, reducing scroll fatigue.
- **Locale Switcher**: Persistent language preference (ES/EN) using local storage and context.
- **CI/CD**: Hardened GitHub Actions pipeline with stricter schema validation and secret management.
- **Security**: Added `Content-Security-Policy` meta headers and strict input validation.

### Fixed
- **Testing**: Resolved `indexedDB` missing global in Vitest environment.
- **Linting**: Fixed various `eslint` and `typescript` errors, including impure render functions in rating logic.
