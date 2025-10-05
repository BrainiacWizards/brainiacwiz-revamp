---
mode: edit
---

## Task Definition

Revamp the BrainiacWiz multiplayer quiz game using the following technologies:

- **Next.js (App Router)**
- **HeroUI** for UI components and styling
- **Prisma ORM** for database access
- **Neon Postgres** as the database
- **Clerk** for authentication and user management

The goal is to build a modular, scalable, and visually engaging quiz platform that supports real-time gameplay, wallet-based rewards, and leaderboard tracking.

---

## Requirements

### Functional Requirements

- Host can create, launch, and monitor quiz sessions
- Players can join via game code, answer questions, and view results
- Real-time updates for quiz progress and player stats
- Leaderboards for individual quizzes and global rankings
- Wallet integration for cUSD payouts and NFT rewards
- Clerk-based authentication for all user roles
- Admin access for content moderation and analytics

### Technical Requirements

- Use HeroUI components for all UI elements
- Use Prisma ORM with Neon Postgres for data modeling
- Implement API routes for quiz creation, submission, and leaderboard access
- Protect routes using Clerk middleware and role-based access control
- Store NFT metadata and transaction hashes in the database
- Ensure mobile responsiveness and dark mode support

---

## Constraints

- All monetary values must be stored and displayed in cUSD
- NFT metadata must follow ERC-721 JSON schema
- Quiz creation rate limited to 10 per host per hour
- Submissions rate limited to 100 per quiz per minute
- Only authenticated users can access game features
- Use only HeroUI components for UI consistency

---

## Success Criteria

- ✅ Fully functional quiz flow for host and player
- ✅ Clerk-authenticated user sessions with role separation
- ✅ Real-time gameplay experience with live updates
- ✅ Accurate leaderboard and reward distribution
- ✅ Responsive UI with HeroUI styling and dark mode
- ✅ Clean Prisma schema with normalized relations
- ✅ Deployed and tested on Vercel or equivalent platform
- ✅ All endpoints documented and tested with mock data
