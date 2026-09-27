# ALIZEIDAN → Hostinger

## Repository
- GitHub: `alizizo888-code/ALIZEIDAN`
- Branch: `main`
- App: React + Vite + TypeScript

## Production build
```bash
npm install
npm run lint
npm run build
```

Vite outputs the production site to `dist/`.

## Hostinger handoff

If Hostinger is configured to deploy directly from GitHub, connect this repository and use:

- Repository: `alizizo888-code/ALIZEIDAN`
- Branch: `main`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

Do not deploy `src/` directly as the public website; the public production files are generated in `dist/`.

## Important architecture note

The landing-page supervisor settings are persisted through the existing application store/local storage and are read by `ManagedLandingView`. The operational order/customer/technician data remains shared through the existing store.

## Current implementation checkpoint

The landing supervisor can control:
- hero title, text, page title and subtitle
- hero image
- primary and accent colors
- show/hide hero, services, pricing, offers, graphics, announcements and quick actions
- visible quick-action buttons
- landing service prices
- landing offers and their active state

A GitHub Actions workflow is included at `.github/workflows/ci.yml` to run TypeScript validation and a production build on pushes and pull requests to `main`.
