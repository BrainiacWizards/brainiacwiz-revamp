# BrainiacWiz Revamp - AI Coding Assistant Guide

## Project Overview

BrainiacWiz is a multiplayer quiz game with crypto rewards, built using Next.js 14 (App Router), HeroUI components, and Prisma ORM. The application has three main user roles: Host, Player, and Admin.

## Architecture

### Core Structure

- **App Router:** Uses Next.js 14 app directory structure with route groups:
    - `/app/host/*` - Routes for quiz creators (create, stats, manage quizzes)
    - `/app/play/*` - Routes for players (gamepin, lobby, quiz, results)
    - `/app/support/*` - Common support routes (contact, FAQs)

### Tech Stack

- **Frontend:** Next.js 14, HeroUI components, Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM (with Accelerate and Optimize extensions)
- **State Management:** React hooks for local state
- **Styling:** Tailwind CSS with HeroUI components

## Key Patterns & Conventions

### Data Flow

- Database interactions happen through Prisma client in `/lib/prisma.ts`
- Models are defined in `/prisma/schema.prisma`
- Route handlers in `/app/api/*/route.tsx` handle API requests

### Component Structure

- UI components from HeroUI library (imported from `@heroui/*` modules)
- Custom components in `/components/*`
- Always use HeroUI primitive components when available
- Custom themes and styling applied via `@heroui/theme` and Tailwind utilities

### Page Structure

```tsx
// Example page structure
import { Component } from "@heroui/component";
// ... imports

export default function PageName() {
	// Component logic
	return <section className="flex flex-col">{/* Content */}</section>;
}
```

## Developer Workflows

### Setup & Development

```bash
# Install dependencies
yarn install

# Run development server with Turbopack
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```

### Database Operations

- Run migrations: `npx prisma migrate dev`
- Generate client: `npx prisma generate`
- Explore database: `npx prisma studio`

## Project-Specific Conventions

1. **HeroUI Component Usage:** Always use HeroUI components for UI elements rather than native HTML
2. **Theme Handling:** Dark theme is default - ensure all components work well in dark/light modes
3. **Prisma Extensions:** All DB queries use Accelerate and Optimize extensions
4. **Route Naming:** Pages should be named `page.tsx` within route directories
5. **TypeScript:** Use TypeScript for all components and utilities

## Integration Points

- **Wallet Integration:** Crypto rewards (cUSD) via Valora or Celo SDK
- **Real-time Interactions:** WebSockets or polling for game updates
- **Authentication:** Clerk for user auth (referenced in schema via `clerkId`)

## Common Gotchas

- Don't mix Client and Server Components incorrectly (components with event handlers must use "use client")
- Use Next.js Link component for navigation rather than traditional `<a>` tags
- Be mindful of HeroUI theme configuration in dark/light modes
