# Contributing to District Vallarta

Thank you for your interest in contributing! We follow a strict **Atomic Design** philosophy and **Solid** principles.

## 🏗 Project Structure

- **`src/components/atoms`**: Basic building blocks (Buttons, Inputs, Badges). Pure UI, no logic.
- **`src/components/molecules`**: Combinations of atoms (SearchBars, EventCards). Can have local state.
- **`src/components/organisms`**: Complex sections (Navigation, AgendaView). Connect to global state.
- **`src/components/views`**: Full page layouts (HomeView, MapView).

## 🚀 Development Workflow

1.  **Clone & Install**:
    ```bash
    git clone ...
    npm install
    ```
2.  **Start Dev Server**:
    ```bash
    npm run dev
    ```
3.  **Lint & Test**:
    Before committing, ensure all checks pass:
    ```bash
    npm run lint
    npm run typecheck
    npm test
    ```

## 📏 Code Standards

- **Strict TypeScript**: No `any`. All props must be typed.
- **Tailwind CSS**: Use utility classes. Avoid inline styles.
- **Zustand**: Use the global store for shared state.
- **Zod**: Validate all external data.

## 🤝 Pull Request Process

1.  Create a feature branch (`feature/my-cool-feature`).
2.  Commit your changes with clear messages.
3.  Open a PR to `main`.
4.  Ensure CI pipeline passes.

## 🌍 Localization
Always use the `useLocale` hook. Do not hardcode Spanish/English strings in the UI.

```tsx
const { t } = useLocale();
<span>{t('my.key')}</span>
```
