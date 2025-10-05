# BrainiacWiz API Specification (with Clerk Authentication)

## Overview

This API powers the multiplayer quiz experience for BrainiacWiz, enabling hosts to create games, players to join and participate, and the system to track results and distribute rewards. Clerk is used for authentication and session management.

---

## Authentication

### Clerk Integration

- All protected routes require a valid Clerk session.
- Authenticated users have access to their `userId`, `email`, and `walletAddress` (if linked).
- Use `getAuth()` in server components or `useUser()` in client components.

---

## Endpoints

### Quiz Management

#### POST `/api/quiz/create`

Create a new quiz session.

- **Auth**: Required (host only)
- **Request Body**:
    - `title`: string
    - `questions`: array of `{ question, options[], correctIndex }`
    - `duration`: number (seconds per question)
    - `prize`: number (cUSD)
- **Response**:
    - `quizId`: string
    - `status`: "created"

#### GET `/api/quiz/:id`

Fetch quiz details.

- **Auth**: Optional (host or player)
- **Params**:
    - `id`: quizId
- **Response**:
    - `title`, `questions`, `status`, `hostId`

---

### Game Flow

#### POST `/api/quiz/:id/start`

Start the quiz session.

- **Auth**: Required (host only)
- **Params**:
    - `id`: quizId
- **Response**:
    - `status`: "started"
    - `startTime`: timestamp

#### POST `/api/quiz/:id/submit`

Submit player answers.

- **Auth**: Required (player)
- **Request Body**:
    - `answers`: array of `{ questionId, selectedIndex }`
- **Response**:
    - `score`: number
    - `rank`: number

#### GET `/api/quiz/:id/status`

Get live quiz status.

- **Auth**: Optional
- **Response**:
    - `currentQuestion`: number
    - `playersJoined`: number
    - `timeRemaining`: number

---

### Leaderboards & Results

#### GET `/api/leaderboard/:quizId`

Fetch leaderboard for a specific quiz.

- **Auth**: Optional
- **Response**:
    - `players`: array of `{ name, score, rank }`

#### GET `/api/leaderboard/global`

Fetch global leaderboard.

- **Auth**: Optional
- **Response**:
    - `topPlayers`: array of `{ name, totalWins, avgScore }`

---

### Rewards & Wallets

#### POST `/api/rewards/distribute`

Distribute cUSD and NFT rewards.

- **Auth**: Required (host or admin)
- **Request Body**:
    - `quizId`: string
    - `winners`: array of `{ playerId, walletAddress }`
- **Response**:
    - `status`: "success"
    - `txHashes`: array of strings

---

## Error Handling

- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing or invalid Clerk session
- `403 Forbidden`: Role mismatch (e.g. player accessing host-only route)
- `404 Not Found`: Quiz or player not found
- `500 Internal Server Error`: Unexpected failure

---

## Rate Limits

- Max 10 quiz creations per host per hour
- Max 100 submissions per quiz per minute

---

## Notes

- All timestamps are in ISO 8601 format
- All monetary values are in cUSD
- NFT metadata follows ERC-721 standard
- Clerk session tokens are validated server-side using middleware
