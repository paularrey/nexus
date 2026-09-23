# Ravecard (Nexus Pay)

Frontend-only UI prototype for Ravecard — a warm, friendly lifestyle payments experience. **No backend, no database, no real APIs.** All data is mocked in `lib/mock-data/`.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build
npm run lint    # eslint
```

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript (strict)
- Tailwind CSS v4 + shadcn-style tokens
- framer-motion, vaul (drawers), sonner (toasts), next-themes

## Folder structure

```
app/                  # Routes only — pages compose components
  (auth)/             # Auth route group
  gift-cards/         # Nested dynamic routes
  bookings/
components/
  ui/                 # Reusable primitives (Button, FeeBreakdown, ProviderCard, …)
  layout/             # AppShell, SplashScreen, nav, onboarding, cookie consent
  auth/               # AuthModal
  payments/           # PinModal (mock payment confirmation)
lib/
  context/            # Auth + preferences React contexts
  hooks/              # useAuthGate, useMockVerification
  mock-data/          # All mock datasets (imported by pages)
  utils/              # cn(), formatters, onboarding storage
types/                # Shared TypeScript interfaces
public/               # Static assets
```

## Conventions

- **PascalCase** file names for components (`.tsx`)
- **camelCase** for hooks, functions, variables
- kebab-case for non-component modules (`mock-data`, contexts)
- No `any` types; props are explicitly typed
- Shared domain types live in `types/` — mock files import from there

## Theming

- Light theme is the **hard default** on first load (not system preference).
- Dark theme only applies via the in-app toggle; “System” is available as an explicit choice on Settings.
- Colors are CSS variables registered in `app/globals.css` under Tailwind’s `@theme` — use utility classes (`bg-card`, `text-primary`, `border-border`, …), never hardcoded hex values.

## Demo credentials

- Mock PIN: `1234`
- Mock 2FA/OTP code: `123456`
