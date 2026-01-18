# Deployment Guide

This project is configured for automated deployment via GitHub Actions to [Cloudflare Pages](https://pages.cloudflare.com/), with a `vite-plugin-pwa` configuration for offline capabilities.

## Prerequisites

To deploy this project successfully, you need:
1.  **Cloudflare Account**: With a Pages project created.
2.  **GitHub Repository**: Connected to the Cloudflare project (or using direct upload via API).

## Environment Variables & Secrets

### Production (`.env.production`)
These are bundled into the build.
```bash
VITE_ACCESS_PINS=2026,BEEF,BEAR  # Comma-separated list of valid access codes
```

### GitHub Secrets (Required for CI/CD)
Configure these in your GitHub Repo -> Settings -> Secrets and variables -> Actions:

| Secret Name | Description |
|-------------|-------------|
| `CLOUDFLARE_API_TOKEN` | API Token with "Edit Cloudflare Pages" permissions. |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare Account ID. |
| `CLOUDFLARE_PROJECT_NAME` | The name of your project in Cloudflare Pages (e.g., `distrito-beef`). |
| `VITE_ACCESS_PINS_PROD` | (Optional) Production PINs if you want to override the `.env` value during build. |

## Deployment Process

### Automated (Recommended)
1.  Push code to the `main` branch.
2.  The GitHub Action `.github/workflows/ci-cd.yml` will trigger.
3.  It runs: Lint -> Typecheck -> Test -> Build.
4.  If successful, it deploys to Cloudflare Pages.

### Manual Deployment
If you need to deploy manually from your local machine:

1.  **Build the project**:
    ```bash
    npm run build
    ```
    This creates a `dist/` folder.

2.  **Preview locally**:
    ```bash
    npm run preview
    ```

3.  **Upload to Cloudflare** (requires `wrangler`):
    ```bash
    npx wrangler pages deploy dist --project-name <your-project-name>
    ```

## PWA & Caching
The app uses `vite-plugin-pwa` to generate a Service Worker (`sw.js`).
- **Strategy**: Auto-update.
- **Offline**: Assets (JS, CSS, HTML, Fonts) are precached.
- **Images**: Unsplash images are cached with `StaleWhileRevalidate` strategy.

> **Note**: To force a Service Worker update for users, bump the `version` in `package.json` before deploying.
