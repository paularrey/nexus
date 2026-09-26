# Ravecard

Frontend-only UI prototype for Ravecard — a payments experience for everyday
money tasks. **No backend, no database, no real APIs.** All data is mocked in
`lib/mock-data/`.

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
npx tsc --noEmit # typecheck
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
  ui/                 # Reusable primitives (Button, CardSection, PageHeader,
                      #   EmptyState, BackLink, SuccessBanner, FeeBreakdown, …)
  layout/             # AppShell, SplashScreen, nav, onboarding, cookie consent
  auth/               # AuthModal
  payments/           # PinModal (mock payment confirmation)
lib/
  context/            # Auth + preferences React contexts
  hooks/              # useAuthGate, usePinFlow, useMockVerification
  mock-data/          # All mock datasets (imported by pages)
  utils/              # cn(), formatters (formatNaira/formatUsd), onboarding storage
types/                # Shared TypeScript interfaces
public/               # Static assets
```

## Conventions

- **PascalCase** file names for components (`.tsx`)
- **camelCase** for hooks, functions, variables (`useX` prefix for hooks)
- kebab-case for non-component modules (`mock-data`, contexts)
- No `any` types; props are explicitly typed
- Shared domain types live in `types/` — mock files and pages import from there
- Money formatting goes through `formatNaira()` / `formatUsd()` in
  `lib/utils/format.ts` — never hand-write `₦` or `$` prefixes in pages
- Repeated page chrome (header, card shell, empty state) comes from
  `components/ui/` — do not copy-paste it into pages

## Theming

- Ravecard has a **single default theme**: Deep Black `#121212` background with Coral Orange `#FF5733` accent. There is no separate light palette.
- Colors are CSS variables registered in `app/globals.css` under Tailwind's `@theme` — use utility classes (`bg-card`, `text-primary`, `border-border`, …), never hardcoded hex values.

## Demo credentials

- Mock PIN: `1234`
- Mock 2FA/OTP code: `123456`
