# Replit.md

## Overview

This is a retro pixel-art styled educational game built as a full-stack web application. The game presents a 2D explorable world where players walk around, interact with NPCs, objects, and signs to discover stories, facts, and scenarios about civil rights and immigration enforcement (ICE). The project has two main views: the Game (player-facing) and an Admin Dashboard for managing content. The game tracks player awareness and story discovery progress.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React with TypeScript, bundled via Vite
- **Routing**: Wouter (lightweight client-side router) with two routes: `/` (Game) and `/admin` (Dashboard)
- **State Management**: TanStack React Query for server state; React useState for local game state
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives with Tailwind CSS
- **Styling**: Tailwind CSS with CSS variables for theming; retro pixel-art aesthetic using `Press Start 2P` and `VT323` fonts; `image-rendering: pixelated` globally applied
- **Animations**: Framer Motion for UI transitions and modal animations
- **Game Input**: Keyboard controls (WASD/Arrows) via `usehooks-ts` event listeners
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Framework**: Express 5 on Node.js with TypeScript (run via tsx)
- **API Pattern**: REST endpoints defined in `shared/routes.ts` with Zod validation schemas, keeping route definitions shared between client and server
- **Development**: Vite dev server with HMR proxied through Express middleware (`server/vite.ts`)
- **Production**: Client built to `dist/public/`, server bundled with esbuild to `dist/index.cjs`
- **Static Serving**: Express serves the built client assets and falls back to `index.html` for SPA routing

### Data Layer
- **Database**: PostgreSQL (required, via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for automatic Zod schema generation from table definitions
- **Schema Location**: `shared/schema.ts` — shared between client and server
- **Tables**:
  - `game_content`: Stores educational content (id, title, content, type, category, order). Types are 'fact', 'story', 'scenario'. Categories are 'rights', 'history', 'community'.
  - `player_progress`: Tracks player session progress (id, sessionId, contentId, completed)
- **Migrations**: Drizzle Kit with `drizzle-kit push` for schema synchronization
- **Storage Pattern**: `server/storage.ts` uses a `DatabaseStorage` class implementing `IStorage` interface for data access abstraction

### API Endpoints
- `GET /api/content` — Returns all game content ordered by `order` field
- `POST /api/content` — Creates new game content (validated with Zod)
- `POST /api/progress` — Saves player progress (defined in routes but may need implementation)

### Seed Data
- The server auto-seeds 10 content items on startup if the `game_content` table is empty
- Content covers: wrongful deportation of citizens, use of force against nonviolent people, detention conditions, workplace raids, community impact, know-your-rights info, and actionable steps
- Content types: 'fact' (documented information), 'story' (personal testimonies), 'scenario' (actionable guidance)
- Categories: 'rights', 'history', 'community'

### Game World
- 20x15 tile grid with preset interactable locations (not random)
- Interactables use lucide-react icons: User (stories), FileText (facts), AlertTriangle (scenarios)
- Color coding: cyan (NPCs), rose (objects), amber (signs)
- Player moves with WASD/Arrows, interacts with Space
- Mobile touch controls for directional movement and interaction

### Build System
- **Dev**: `npm run dev` — runs tsx with Vite HMR
- **Build**: `npm run build` — Vite builds client, esbuild bundles server; select dependencies are bundled (allowlist in `script/build.ts`) to reduce cold start times
- **DB**: `npm run db:push` — pushes schema changes to PostgreSQL via Drizzle Kit

## External Dependencies

### Database
- **PostgreSQL** — Required. Connection via `DATABASE_URL` environment variable. Used with `pg` (node-postgres) Pool and Drizzle ORM.

### Key NPM Packages
- **drizzle-orm** + **drizzle-zod** + **drizzle-kit** — ORM, schema validation, and migration tooling
- **express** v5 — HTTP server
- **@tanstack/react-query** — Server state management on client
- **framer-motion** — Animations for game UI
- **usehooks-ts** — Utility hooks including keyboard event handling
- **wouter** — Client-side routing
- **zod** — Runtime schema validation (shared between client/server)
- **shadcn/ui** components built on multiple **@radix-ui** primitives
- **tailwindcss** — Utility-first CSS framework
- **lucide-react** — Icon library
- **connect-pg-simple** — PostgreSQL session store (available but not currently used for auth)

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal** — Error overlay in development
- **@replit/vite-plugin-cartographer** — Dev tooling (conditionally loaded)
- **@replit/vite-plugin-dev-banner** — Dev banner (conditionally loaded)