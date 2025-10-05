# BrainiacWiz Revamp – Development Plan

## Phase 1: Foundation & Setup

- Initialize Next.js app with App Router
- Install HeroUI and configure Tailwind CSS
- Set up global styles, fonts, and theme switcher
- Scaffold layout.tsx and navbar.tsx with HeroUI components

## Phase 2: Core Game Flow

### Host Side

- `/host/create`: Form to create a new quiz
- `/host/quiz`: Live dashboard to manage quiz flow
- `/host/stats`: Post-game analytics

### Player Side

- `/play/gamepin`: Enter game code
- `/play/lobby`: Waiting room with live player count
- `/play/quiz`: Real-time question interface
- `/play/results`: Show individual performance
- `/play/leaderboard/[quizId]`: Quiz-specific leaderboard
- `/play/leaderboard/global`: Global rankings

## Phase 3: API & Backend Integration

- Replace `/api/example-route` with:
    - `POST /api/quiz/create`
    - `GET /api/quiz/:id`
    - `POST /api/quiz/:id/submit`
    - `GET /api/leaderboard/:id`
- Integrate wallet logic (cUSD, NFT rewards)
- Add WebSocket or polling for real-time updates

## Phase 4: UX Polish & Support

- `/about`: Game overview
- `/support/contact`: Feedback form
- `/support/faqs`: Common questions
- Add animations via Framer Motion
- Responsive design and dark mode toggle

## Phase 5: Testing & Deployment

- Unit tests for components
- Integration tests for game flow
- Deploy to Vercel or custom infra
- Monitor performance and error boundaries
