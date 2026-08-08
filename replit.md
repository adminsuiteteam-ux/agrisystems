# Agrisystems Community Food Access

A white-led community food access MVP that helps households coordinate transparent group purchases from trusted agricultural suppliers.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/agrisystem-community/` — responsive React + Vite MVP
- `artifacts/agrisystem-community/src/App.tsx` — client routes, demo data, and group-buy interactions
- `artifacts/agrisystem-community/src/index.css` — Agrisystems visual theme and responsive styling
- `attached_assets/agrosystem_logo-copy_1786259279741.jpeg` — supplied logo source asset

## Architecture decisions

- The first release uses local demo data so the member and group-leader journeys can be validated before payment and identity integrations are added.
- The product is organized around transparent community group purchases rather than a traditional individual shopping cart.
- Group progress, contribution simulation, allocation preview, pickup details, and leader authorization are treated as first-class trust surfaces.

## Product

- Discover active community group buys and see group pricing, savings, trust signals, and funding progress.
- Browse and filter offers, join a group, adjust contribution quantity, and view a member group dashboard.
- Review a group purchase detail page with allocation and pickup information.
- Create a group and simulate funding and payment authorization from the leader workspace.

## User preferences

- Use the supplied Agrisystems logo as the product logo and favicon.
- Keep white as the primary color while deriving supporting colors from the supplied logo.

## Gotchas

- Demo contributions and payment authorization are intentionally simulated in the MVP and should be clearly distinguished from real payment flows when integrations are added.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
