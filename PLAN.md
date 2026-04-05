# Nexus Implementation Plan

## Phase 1 - Monorepo Foundation
Complexity: Low
- Initialize workspace layout under `nexus/`
- Add root `package.json` with npm workspaces
- Add strict TypeScript baseline configs for shared/client/server
- Add `.env.example`, `.gitignore`, and initial README structure

## Phase 2 - Shared Contracts (`packages/shared`)
Complexity: Medium
- Implement canonical TypeScript domain types for API + socket events
- Implement Zod validation schemas for auth, users, servers, channels, messages, DMs, invites
- Export package entrypoints for client/server consumption

## Phase 3 - Backend Core (`apps/server`)
Complexity: High
- Configure Express, security middlewares (helmet/cors), logging (morgan), cookie parser, JSON parser
- Add environment validation, MongoDB connection, Cloudinary adapter, Upstash Redis adapter
- Implement JWT auth (access + refresh), bcrypt password hashing, centralized error handling
- Implement file upload pipeline (multer memory storage + Cloudinary stream upload)

## Phase 4 - Mongoose Data Layer
Complexity: High
- Implement all required models:
  - User, Server, ServerMember, Role, Channel, Message, DirectMessage, DirectMessageContent
- Add indexes and virtual population rules (message author virtual)
- Add model-level hooks (hash password, default invite generation)

## Phase 5 - REST API Surface
Complexity: High
- Implement `/api/v1` route groups:
  - Auth, Users, Servers, Channels, Messages, Direct Messages, Invites
- Apply auth middleware and zod request validation
- Implement cursor pagination for channel and DM message history

## Phase 6 - Realtime Layer (`socket.io`)
Complexity: High
- Socket auth via JWT handshake
- Room strategy:
  - `server:{serverId}`
  - `channel:{channelId}`
- Implement all requested client->server and server->client events
- Add Upstash presence heartbeat + disconnect updates + shared-room presence broadcast
- Add voice signaling relay events (offer/answer + ICE)

## Phase 7 - Frontend Foundation (`apps/client`)
Complexity: High
- Vite + React 18 + TS + Tailwind + React Router setup
- Axios client with auth refresh interceptor
- Zustand stores: auth/ui/voice
- React Query provider + hooks for key resources
- Route tree for `/login`, `/register`, `/channels/@me`, `/channels/:serverId/:channelId`

## Phase 8 - Frontend UI System & Screens
Complexity: High
- Implement design tokens (tailwind exact color palette + typography)
- Build core layouts: `ServerLayout`, `DMLayout`
- Build requested component inventory (navigation, channels, chat, overlays, members, voice, misc)
- Integrate virtualized message list with `@tanstack/react-virtual`

## Phase 9 - Documentation & Deployment
Complexity: Medium
- Finalize `.env.example` for all apps
- Add client `vercel.json`
- Add Render deployment steps in README
- Validate scripts and cross-package imports

## Phase 10 - Hardening / QA Checklist
Complexity: Medium
- Verify strict TypeScript passes
- Smoke-test API and socket startup flow
- Confirm error boundaries + user-facing toast behavior
- Add “next improvements” checklist suitable for portfolio presentation
