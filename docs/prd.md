# BrainiacWiz Revamp – Product Requirements Document (PRD)

## 1. Product Overview

BrainiacWiz is a multiplayer quiz game that blends education, competition, and crypto rewards. The revamp introduces a modern UI (HeroUI), real-time gameplay, and wallet-based incentives.

## 2. Goals

- Improve UX with HeroUI and Tailwind
- Modularize game flow for host/player
- Enable real-time quiz sessions
- Integrate wallet-based rewards (cUSD, NFTs)

## 3. User Roles

| Role   | Capabilities                                     |
| ------ | ------------------------------------------------ |
| Host   | Create quiz, launch session, monitor stats       |
| Player | Join game, answer questions, view results        |
| Admin  | Manage content, monitor abuse, view global stats |

## 4. Key Features

### Host

- Quiz creation form
- Live session control
- Post-game analytics

### Player

- Game code entry
- Lobby with live updates
- Quiz interface with timer
- Results and leaderboard

### Rewards

- Wallet integration (deposit, payout)
- NFT distribution for top performers

## 5. Tech Stack

- Frontend: Next.js (App Router), HeroUI, Tailwind CSS
- Backend: API routes (Next.js), Supabase or custom DB
- Real-time: WebSocket or polling
- Wallet: cUSD integration via Valora or Celo SDK

## 6. Design Principles

- Mobile-first
- Accessible and responsive
- Minimalist with bold accents
- Gamified transitions and feedback
