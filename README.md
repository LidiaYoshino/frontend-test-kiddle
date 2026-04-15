# Frontend Test Base - Kiddle

Frontend starter for a coding challenge using:

- React + TypeScript (Vite, no SSR)
- Tailwind CSS
- Axios
- date-fns
- Radix UI primitives
- Lucide icons

## Requirements

- Node.js 20+ recommended
- A package manager available in your terminal (`npm`, `pnpm`, or `yarn`)

## Quick start

1. Install dependencies:
   - `npm install`
2. Start dev server with hot reload:
   - `npm run dev`
3. Open the printed local URL in your browser.

## Scripts

- `npm run dev` - start Vite dev server with hot reload
- `npm run build` - typecheck and build production bundle
- `npm run preview` - preview production build locally
- `npm run typecheck` - run TypeScript checks
- `npm run lint` - run ESLint

## API

- Base URL is configured in `src/lib/api/client.ts`:
  - `https://kiddle-code-challenge-0b5750a3aba2.herokuapp.com/`

The starter page calls `/` on load and when clicking **Refresh API**.