# 🌿 Agrisystems Community Food Access

A community group-buying platform connecting Nigerian households with trusted farm suppliers, enabling bulk purchases at farm-direct prices.

## Overview

Agrisystems lets households band together into buying groups, pool their contributions, and receive farm-fresh produce at significantly lower prices than retail — delivered to a single community pickup point.

## Features

- **Real user accounts** — sign up as Household Member, Group Leader, Farmer/Supplier, or Admin
- **Group buying** — browse active offers, join groups, and track funding progress in real time
- **Persistent backend** — all data (users, groups, contributions, pickups) stored in PostgreSQL
- **Payment-ready** — architecture supports Paystack / Flutterwave integration
- **Farmer profiles** — verified supplier information, produce listings, pricing
- **Admin dashboard** — manage users, farmers, disputes, and platform analytics
- **Notification system** — alerts for group status changes, contribution confirmations, pickup schedules

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS v4 |
| API server | Express 5 + TypeScript (ESM) |
| Database | PostgreSQL + Drizzle ORM |
| Auth | JWT (access + refresh tokens), bcrypt |
| Monorepo | pnpm workspaces |

## Project Structure

```
Agrosystem-app/
├── artifacts/
│   ├── agrisystem-community/   # React frontend (Vite)
│   └── api-server/             # Express REST API
├── lib/
│   ├── db/                     # Drizzle ORM schemas + client
│   └── api-spec/               # OpenAPI specification
└── scripts/                    # Utility scripts
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 15+

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/adminsuiteteam-ux/agrisystems.git
cd agrisystems

# 2. Install dependencies
pnpm install

# 3. Configure environment
cp .env.example .env
# Edit .env and fill in your DATABASE_URL, JWT_SECRET, etc.

# 4. Run the API server (defaults to port 3001)
cd artifacts/api-server
pnpm run dev

# 5. Run the frontend (defaults to port 5173)
cd artifacts/agrisystem-community
pnpm run dev
```

### Database Setup

```bash
# Push the Drizzle schema to your PostgreSQL instance
cd lib/db
pnpm run db:push
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT tokens |
| GET | `/api/auth/me` | Get current user profile |
| GET | `/api/groups` | List all buying groups |
| POST | `/api/groups` | Create a new group |
| POST | `/api/groups/:id/join` | Join a group |
| GET | `/api/offers` | List farm offers |
| POST | `/api/contributions` | Submit a contribution |
| GET | `/api/farmers` | List verified farmers |
| GET | `/api/admin/dashboard` | Admin stats (admin only) |

See [`lib/api-spec/openapi.yaml`](lib/api-spec/openapi.yaml) for the full OpenAPI specification.

## User Roles

| Role | Description |
|---|---|
| `household_member` | Browse offers, join groups, make contributions |
| `group_leader` | Create and manage buying groups, authorize payments |
| `farmer_supplier` | List produce, manage offers, view orders |
| `admin` | Full platform access, dispute resolution, analytics |

## Payment Integration

The platform is designed for Nigerian payment providers:
- **Paystack** — preferred for Nigerian cards/bank transfers
- **Flutterwave** — fallback option

Set `PAYSTACK_SECRET_KEY` or `FLUTTERWAVE_SECRET_KEY` in your `.env` file to activate live payments. Without these, the app runs in demo/simulation mode.

## License

MIT
